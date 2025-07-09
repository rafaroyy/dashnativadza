// Security hardening recommendations
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})

// Security headers
const securityMiddleware = (app) => {
  // Use Helmet for security headers
  app.use(helmet())

  // Apply rate limiting
  app.use("/api/", limiter)

  // Disable X-Powered-By header
  app.disable("x-powered-by")

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader("X-Frame-Options", "DENY")
    res.setHeader("X-XSS-Protection", "1; mode=block")
    next()
  })
}

module.exports = securityMiddleware
