const validator = require("validator")
const ErrorResponse = require("../utils/errorResponse")

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize all string inputs
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        // Remove potential XSS
        obj[key] = validator.escape(obj[key])
        // Remove potential NoSQL injection
        obj[key] = obj[key].replace(/[{}$]/g, "")
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key])
      }
    }
  }

  if (req.body) sanitizeObject(req.body)
  if (req.query) sanitizeObject(req.query)
  if (req.params) sanitizeObject(req.params)

  next()
}

// Email validation
const validateEmail = (email) => {
  return validator.isEmail(email) && validator.isLength(email, { max: 254 })
}

// Password strength validation
const validatePassword = (password) => {
  return validator.isLength(password, { min: 8, max: 128 }) && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
}

module.exports = {
  sanitizeInput,
  validateEmail,
  validatePassword,
}
