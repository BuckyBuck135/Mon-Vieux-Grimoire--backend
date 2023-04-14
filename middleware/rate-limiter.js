const rateLimit = require("express-rate-limit")
module.exports = rateLimit({
  windowMs: 1 * 60 * 1000, // fenêtres de X minute
  max: 100, // limit each IP to 2 requests per windowMs
  handler: function (req, res, next) {
    return res.status(429).json({
      error: "Trop de requêtes. Veuillez réessayer plus tard."
    })
  } 
})