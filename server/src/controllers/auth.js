const { supabase } = require("../config/supabase")
const ErrorResponse = require("../utils/errorResponse")

exports.registerUser = async (req, res, next) => {
  const { userEmail, password, fullName } = req.body

  try {
    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || userEmail.split("@")[0],
      },
    })

    if (authError) {
      return next(new ErrorResponse(authError.message, 400))
    }

    // Create user profile in public.users table
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email: userEmail,
        full_name: fullName || userEmail.split("@")[0],
      },
    ])

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Don't fail registration if profile creation fails
    }

    // Create default workspace
    const { data: workspaceData, error: workspaceError } = await supabase
      .from("workspaces")
      .insert([
        {
          name: "Meu Workspace",
          description: "Workspace padrão da DigitalZ",
          user_id: authData.user.id,
        },
      ])
      .select()
      .single()

    if (workspaceError) {
      console.error("Workspace creation error:", workspaceError)
    }

    // Generate access token
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: "signup",
      email: userEmail,
    })

    res.status(201).json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        fullName: authData.user.user_metadata.full_name,
      },
      workspace: workspaceData,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return next(new ErrorResponse("Erro interno do servidor", 500))
  }
}

exports.loginUser = async (req, res, next) => {
  const { userEmail, password } = req.body

  if (!userEmail || !password) {
    return next(new ErrorResponse("Por favor, forneça email e senha", 400))
  }

  try {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: password,
    })

    if (authError) {
      return next(new ErrorResponse("Credenciais inválidas", 401))
    }

    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    if (userError) {
      console.error("User profile fetch error:", userError)
    }

    // Get user workspaces
    const { data: workspaces, error: workspacesError } = await supabase
      .from("workspaces")
      .select("id, name, description")
      .eq("user_id", authData.user.id)

    if (workspacesError) {
      console.error("Workspaces fetch error:", workspacesError)
    }

    res.status(200).json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        fullName: userData?.full_name || authData.user.user_metadata?.full_name,
        avatarUrl: userData?.avatar_url,
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
      },
      workspaces: workspaces || [],
    })
  } catch (error) {
    console.error("Login error:", error)
    return next(new ErrorResponse("Erro interno do servidor", 500))
  }
}

exports.refreshToken = async (req, res, next) => {
  const { refresh_token } = req.body

  if (!refresh_token) {
    return next(new ErrorResponse("Token de atualização necessário", 400))
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refresh_token,
    })

    if (error) {
      return next(new ErrorResponse("Token inválido", 401))
    }

    res.status(200).json({
      success: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    return next(new ErrorResponse("Erro interno do servidor", 500))
  }
}

exports.logoutUser = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return next(new ErrorResponse("Token de acesso necessário", 401))
  }

  const token = authHeader.replace("Bearer ", "")

  try {
    const { error } = await supabase.auth.admin.signOut(token)

    if (error) {
      console.error("Logout error:", error)
    }

    res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return next(new ErrorResponse("Erro interno do servidor", 500))
  }
}

exports.forgotPassword = async (req, res, next) => {
  const { userEmail } = req.body

  if (!userEmail) {
    return next(new ErrorResponse("Email é obrigatório", 400))
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`,
    })

    if (error) {
      return next(new ErrorResponse(error.message, 400))
    }

    res.status(200).json({
      success: true,
      message: "Email de recuperação enviado com sucesso",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return next(new ErrorResponse("Erro interno do servidor", 500))
  }
}

exports.resetPassword = async (req, res, next) => {
  const { access_token, refresh_token, new_password } = req.body

  if (!access_token || !new_password) {
    return next(new ErrorResponse("Token e nova senha são obrigatórios", 400))
  }

  try {
    // Set session with the tokens from the reset link
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })

    if (sessionError) {
      return next(new ErrorResponse("Token inválido ou expirado", 400))
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: new_password,
    })

    if (updateError) {
      return next(new ErrorResponse(updateError.message, 400))
    }

    res.status(200).json({
      success: true,
      message: "Senha atualizada com sucesso",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return next(new ErrorResponse("Erro interno do servidor", 500))
  }
}
