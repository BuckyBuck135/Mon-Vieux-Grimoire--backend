const express = require("express")
const sharp = require('sharp');
const fs = require('fs');
const auth = require("../middleware/auth")
const multerMW = require("../middleware/multer-config")
const sharpMW = require("../middleware/sharp-config")
const router = express.Router()
const booksController = require("../controllers/controller-books")

router.get("/", booksController.getAllBooks)
router.get("/bestrating", booksController.getBestBooks)
router.get("/:id", booksController.getOneBook)

router.post("/", auth, multerMW, sharpMW, booksController.createBook)
router.post("/:id/rating", auth, booksController.addRatingToBook)

router.delete("/:id", auth, booksController.deleteBook)

router.put("/:id", auth, multerMW, booksController.updateBook)

module.exports = router