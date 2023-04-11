const rateLimit = require("express-rate-limit")
module.exports = rateLimit({
  windowMs: 1 * 60 * 1000, // fenêtres de X minute
  handler: function (req, res, next) {
    return res.status(429).json({
      error: "Trop de requêtes. Veuillez réessayer plus tard."
    })
  } 
})