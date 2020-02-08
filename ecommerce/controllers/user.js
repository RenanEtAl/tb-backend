const User = require('../models/user')
const jwt = require('jsonwebtoken') // generate signed token
const expressJwt = require('express-jwt') // authorization check

const { errorHandler } = require('../helpers/dbErrorHandler')

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user
        next()
    })
}