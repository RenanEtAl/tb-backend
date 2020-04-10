const User = require('../models/user')
const { Order } = require('../models/order');

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

exports.addOrderToUserHistory = (req, res, next) => {
    let history = [];
    // get products from the order object
    // forEach - to look for each product and push _id, name... etc
    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id, // "item." part of product
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id, // part of order
            amount: req.body.order.amount // part of order
        });
    });
    // add to the user purchase history
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { history: history } },
        { new: true }, // retrieve user's updated info
        // send back response using callback
        (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: 'Could not update user purchase history'
                });
            }
            next();
        });
};

// user purchaase history
exports.purchaseHistory = (req, res) => {
    // find the order based on User
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
