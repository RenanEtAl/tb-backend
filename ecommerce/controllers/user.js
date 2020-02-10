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

exports.read = (req, res) => {
    // do not semnt the hashed_password and salt
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

// exports.update = (req, res) => {
//     console.log('user update', req.body);
//     req.body.role = 0; // role will always be 0
//     // find user by id
//     // set whatever new information in the body; email, name, password
//     // newly updated record will be sent to front end with {new: true}
//     User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'You are not authorized to perform this action'
//             });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         res.json(user);
//     });
// };


exports.update = (req, res) => {
    // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
    const { name, password } = req.body;

    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};



exports.purchaseHistory = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate('user', '_id name')
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(orders);
        });
};
