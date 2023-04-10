const multer = require("multer")

//  map le MIME type du fichier en une extension
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  }

const storage = multer.diskStorage({
    // spécifie le dossier dans lequel les images seront sauvegardées sur le disque
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    // spécifie la façon dont les fichiers seront renommés : nom + timestamp + extension
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_")
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + "." + extension)
    }
})

module.exports = multer({storage: storage}).single("image")