const rateLimit = require("express-rate-limit")
module.exports = rateLimit({
  windowMs: 1 * 60 * 1000, // fenêtres de 1 minute
  max: 5, // limite chaque IP à 5 requêtes par 
  handler: function (req, res, next) {
    return res.status(429).json({error})
  }
})