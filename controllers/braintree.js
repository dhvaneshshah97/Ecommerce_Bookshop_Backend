const User = require('../models/user.js');
const braintree = require('braintree');
require('dotenv').config();


// connecting to braintree via gateway first before generating the token
const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
});

// use gateway to generate the token
exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if(err){
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    })
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    // charge 
    let newTransaction = gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true,
        },
    }, (error, result) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json(result);
        }
    });
}