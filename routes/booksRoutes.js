const express = require("express")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const router = express.Router()
const booksController = require("../controllers/booksController")

router.get("/bestrating", booksController.getBestBooks)
router.post("/:id/rating", auth, booksController.addRatingToBook)

router.get("/", booksController.getAllBooks)
router.get("/:id", booksController.getOneBook)
router.post("/", auth, multer, booksController.createBook)
router.put("/:id", auth, multer, booksController.updateBook)
router.delete("/:id", auth, booksController.deleteBook)

module.exports = router