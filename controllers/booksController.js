const Book = require("../models/Book")
const fs = require("fs")

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)
    //empêche la création en cas de conflit ID/token
    if (bookObject.userId != req.auth.userId) {
        res.status(403).json({message:"Requête non-autorisée"})
        
    } else {
        delete bookObject._id
        const book = new Book({
        ...bookObject,
        
        userId: req.auth.userId,
        // imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        imageUrl: `https://${req.get("host")}/images/${req.file.filename}`

        })

        book.save()
        .then(() => res.status(201).json({message: "Livre enregistré avec succès"}))
        .catch(error => res.status(400).json({error}))
    }
}

exports.getAllBooks = (req, res, next) => {
    console.log(req.protocol)
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({error}))
}

exports.getOneBook = (req, res, next) => {
    Book.findById(req.params.id)
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({error}))
}

exports.getBestBooks = (req, res, next) => {
    const maxResults = 3; 
  
    Book.aggregate([
      {
        $sort: {averageRating: -1}
      },
      {
        $limit: maxResults
      }
    ])
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error: error.message}))
}

exports.deleteBook = (req, res, next) => {
    console.log(req.body)

    Book.findById(req.params.id)
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({message: "Requête non-autorisée"})
            } else {
                const filename = book.imageUrl.split("/images/")[1]
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message: "Objet supprimé !"}))
                        .catch(error => res.status(401).json({error}))
                })
            }
        })
        .catch(error => res.status(500).json({error}))
}

exports.updateBook = (req, res, next) => {
    const {id} = req.params
    // vérifie si un fichier a été inclus dans la requête.
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `https://${req.get("host")}/images/${req.file.filename}`
    } : {...req.body}
    
    //  supprime la clé "_userId" de l'objet "bookObject". Cela garantit que l'utilisateur ne peut pas modifier cette clé.
    delete bookObject._userId
    Book.findById(id)
        .then(book => {
            // vérifie si l'utilisateur est autorisé à modifier cet objet 
            if (book.userId != req.auth.userId) {
                res.status(403).json({message:"Requête non-autorisée"})
            } else {
                Book.updateOne({_id: id}, {...bookObject, _id: id})
                .then(() => res.status(200).json({message : "Objet modifié!"}))
                .catch(error => res.status(401).json({error}))
            }
        })
        .catch(error => res.status(500).json({error}))
}

exports.addRatingToBook = (req, res, next) => {

    // définition d'un nouvel objet car le front envoie "rating", et non "grade"
    const newRating = {
        userId: req.body.userId,
        grade: req.body.rating
    }
  
    Book.findById(req.params.id)
        .then(book => {
            // la méthode .toHexString() transforme new ObjectId() en string
            if (book.ratings.find(rating => rating.userId.toHexString() === req.body.userId)) {
            return res.status(400).json({message: "Vous avez déjà donné une note à ce livre"})

            } else {
            // push la nouvelle note
            book.ratings.push(newRating)
            
            const ratings = book.ratings.map((rating) => rating.grade);
            const sum = ratings.reduce((acc, cur) => acc + cur, 0);
            // pour gérer les décimales sur le back; arrondit à l'entier supérieur 
            // (devrait être fait sur le front, qui gère mal l'affichage des étoiles avec un arrondisement incorrect)
            const average = Math.ceil(sum / ratings.length)

            book.averageRating = average
            book.save()
                .then(book => res.status(200).json(book))
                .catch(error => res.status(400).json({error}))
            }
        })
        .catch(error => res.status(500).json({error}))
  }



// Version alternative createBook

// Fonction create book - ne bloque PAS un utilisateur ayant conflit token/userId, mais va remplacer l'userId par le auth.userId
//   exports.createBook = (req, res, next) => {
//     const bookObject = JSON.parse(req.body.book)
//     delete bookObject._id
//     delete bookObject.userId
//     const book = new Book({
//         ...bookObject,
        
//         userId: req.auth.userId,
//         imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
//     })

//     book.save()
//         .then(() => res.status(201).json({message: "Livre enregistré avec succès"}))
//         .catch(error => res.status(400).json({error}))
// }