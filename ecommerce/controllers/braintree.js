const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();

// connect to braintree
const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox, // change this to production when it's on live server
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err,response){
        if(err){
            res.status(500).send(err)
        } else {
            res.send(response)
        }
    })
}

exports.processPayment = (req, res) => {
    // payment method from the client side
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount;
    // charge the user
    let newTransaction = gateway.transaction.sale( // connect to braintree using gateway
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        // call back
        (error, result) => {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};
