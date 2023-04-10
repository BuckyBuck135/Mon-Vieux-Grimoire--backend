const mongoose = require("mongoose")

// créons un schéma de données qui contient les champs souhaités pour chaque Book
const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  }
})

//exportons ce schéma en tant que modèle Mongoose appelé « Book »
module.exports = mongoose.model("Book", bookSchema)
