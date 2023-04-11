const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
require('dotenv').config()

exports.signup = (req, res, next) => {
    // hash the password
    bcrypt.hash(req.body.password, 10)
        //resolve the promise
        .then(hash => {
            //create a new user
            const user = new User({
                email: req.body.email,
                password: hash
            })
            //save the user
            user.save()
                .then(() => res.status(201).json({message: "Utilisateur créé"}))
                .catch(error => res.status(400).json({error}))
        })
        // error code 500: server
        .catch(error => {
            res.status(500).json({error})
        })
}


exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            //Pas d'utilisateur enregistré avec cet identifiant
            if(!user) {
                res.status(401).json({message: "Paire identifiant/mot de passe incorrecte"})
            //Utilisateur enregistré
            } else {
                //compare le mot de passe fourni à celui existant dans la BdD
                bcrypt.compare(req.body.password, user.password)
                    .then(existingUser => {
                        //Pas d'utilisateur enregistré avec ce mot de passe
                        if(!existingUser) {
                            res.status(401).json({message: "Paire identifiant/mot de passe incorrecte"})
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

