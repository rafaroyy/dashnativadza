// Client-side XSS protection utilities
const DOMPurify = require("isomorphic-dompurify")

// Sanitize HTML content
export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    ALLOWED_ATTR: ["href"],
  })
}

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input

  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
}

// Validate URLs
export const isValidURL = (url) => {
  try {
    const urlObj = new URL(url)
    return ["http:", "https:"].includes(urlObj.protocol)
  } catch {
    return false
  }
}
