const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const cors = require("cors")
const rateLimit = require("./middleware/rate-limiter")
const timeOut = require("./middleware/timeOut")

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"))

  
const app = express()
app.use(express.json());

const booksRoutes = require("./routes/booksRoutes")
const userRoutes = require("./routes/userRoutes")

app.use(cors())
app.use(rateLimit)
app.use(timeOut)
app.use("/api/books", booksRoutes)
app.use("/api/auth", userRoutes)
app.use("/images", express.static(path.join(__dirname, "images")))

module.exports = app