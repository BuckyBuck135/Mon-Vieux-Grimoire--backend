const timeout = require("express-timeout-handler");

const options = {
    //timeout par défaut sur tous les endpoints
  timeout: 3000,
  onTimeout: function(req, res) {
    res.status(403).json({message: "Requête non-autorisée"})
  }
}

module.exports = function(req, res, next) {
  return timeout.handler(options)(req, res, next);
}