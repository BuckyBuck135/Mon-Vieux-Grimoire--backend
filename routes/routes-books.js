const express = require("express")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const router = express.Router()
const booksController = require("../controllers/controller-books")


router.post("/", auth, multer, booksController.createBook)
router.post("/:id/rating", auth, booksController.addRatingToBook)
router.get("/", booksController.getAllBooks)
router.get("/bestrating", booksController.getBestBooks)
router.get("/:id", booksController.getOneBook)
router.delete("/:id", auth, booksController.deleteBook)
router.put("/:id", auth, multer, booksController.updateBook)

module.exports = router