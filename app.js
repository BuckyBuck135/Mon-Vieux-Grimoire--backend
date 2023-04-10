const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const rateLimit = require("./middleware/rate-limiter")
const {mongoDB_URI} = require("./config/config")

mongoose.connect(mongoDB_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"))

  
const app = express()
app.use(express.json());

const booksRoutes = require("./routes/routes-books")
const userRoutes = require("./routes/routes-user")

const cors = require("cors")
app.use(cors())
// middleware pour headers CORS
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*")
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
//     next()
// })

// const rateLimit = require("express-rate-limit")
// const apiRequestLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // fenêtres de 1 minute
//   max: 5, // limite chaque IP à 5 requêtes par 
//   handler: function (req, res, next) {
//     return res.status(429).json({error})
//   }
// })

// Use the limit rule as an application middleware
app.use(rateLimit)

app.use("/api/books", booksRoutes)
app.use("/api/auth", userRoutes)
app.use("/images", express.static(path.join(__dirname, "images")))

module.exports = app