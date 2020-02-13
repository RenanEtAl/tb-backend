// import order and cart item model
const { Order, Cartitem } = require('../models/order')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.orderById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.product', 'name price') 
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order = order; // make the order available in request object
            next();
        });
};

exports.create = (req, res) => {
    console.log("CREATE ORDER: ", req.body)

    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        // send email alert to admin
        // order.address
        // order.products.length
        // order.amount
        // const emailData = {
        //     to: 'kaloraat@gmail.com',
        //     from: 'noreply@ecommerce.com',
        //     subject: `A new order is received`,
        //     html: `
        //     <p>Customer name:</p>
        //     <p>Total products: ${order.products.length}</p>
        //     <p>Total cost: ${order.amount}</p>
        //     <p>Login to dashboard to the order in detail.</p>
        // `
        //};
        //sgMail.send(emailData);
        res.json(data);
    });
}


exports.listOrders = (req, res) => {
    // find the orders
    Order.find()
        .populate('user', '_id name address')
        .sort('-created') //  sort by createdAt date
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders);
        });
};

exports.getStatusValues = (req, res) => {
    // grab the status enums from Order model
    res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = (req, res) => {
    // 
    Order.update(
        { _id: req.body.orderId }, // which order to update
        { $set: { status: req.body.status } }, // send the status from the front end
        (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(order);
    });
};