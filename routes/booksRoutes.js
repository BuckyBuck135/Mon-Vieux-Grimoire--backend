const express = require("express")
const sharp = require('sharp');
const fs = require('fs');
const auth = require("../middleware/auth")
const multerMW = require("../middleware/multer-config")
const sharpMW = require("../middleware/sharp-config")
const router = express.Router()
const booksController = require("../controllers/booksController")

router.get("/bestrating", booksController.getBestBooks)
router.post("/:id/rating", auth, booksController.addRatingToBook)

router.get("/", booksController.getAllBooks)
router.get("/:id", booksController.getOneBook)
router.post("/", auth, multerMW, sharpMW, booksController.createBook)
router.put("/:id", auth, multerMW, sharpMW, booksController.updateBook)
router.delete("/:id", auth, booksController.deleteBook)

module.exports = router
