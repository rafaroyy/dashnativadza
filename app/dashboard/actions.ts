"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const TaskSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  space_id: z.string().uuid("ID do espaço inválido."),
  priority: z.enum(["urgent", "high", "normal", "low"]).default("normal"),
})

export async function createTask(formData: FormData) {
  const supabase = createClient()

  const validatedFields = TaskSchema.safeParse({
    title: formData.get("title"),
    space_id: formData.get("space_id"),
    priority: formData.get("priority"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      errors: { _form: ["Usuário não autenticado."] },
    }
  }

  const { error } = await supabase.from("tasks").insert({
    title: validatedFields.data.title,
    space_id: validatedFields.data.space_id,
    priority: validatedFields.data.priority,
    // assignee_id pode ser adicionado aqui se necessário
  })

  if (error) {
    return {
      errors: { _form: [error.message] },
    }
  }

  revalidatePath("/dashboard")
  return {
    errors: {},
    message: "Tarefa criada com sucesso!",
  }
}
