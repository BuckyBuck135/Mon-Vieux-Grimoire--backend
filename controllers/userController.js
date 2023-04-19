const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
require('dotenv').config()

exports.signup = (req, res, next) => {
    // hash le  mot de passe
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //création d'un nouvel User
            const user = new User({
                email: req.body.email,
                password: hash
            })
            //sauvegarde
            user.save()
                .then(() => res.status(201).json({message: "Utilisateur créé"}))
                // error code 400: client
                .catch(error => res.status(400).json({error}))
        })
        // error code 500: server
        .catch(error => {
            res.status(500).json({error: error.message})
        })
}


exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            //Pas d'utilisateur enregistré avec cet identifiant
            if(!user) {
                res.status(401).json({message: "Requête non-autorisée"})
            //Utilisateur enregistré
            } else {
                //compare le mot de passe fourni à celui existant dans la BdD
                bcrypt.compare(req.body.password, user.password)
                    .then(existingUser => {
                        //Pas d'utilisateur enregistré avec ce mot de passe
                        if(!existingUser) {
                            res.status(401).json({message: "Requête non-autorisée"})
                        // On renvoie "authorization" comprenant le JWT
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    process.env.SECRETKEY,
                                    {expiresIn: "24h"}
                                )
                            })
                        }
                    })
                    //Erreur serveur
                    .catch(error => res.status(500).json({error}))
            }
        })
        .catch(error => res.status(500).json({error}))

}

