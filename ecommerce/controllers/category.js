const Category = require('../models/category');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');



exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: 'Category does not exist'
            });
        }
        req.category = category;
        next();
    });
}

exports.read = (req, res) => {
    return res.json(req.category)

}

exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if (err) {
            return resizeBy.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({ data })
    })
}

exports.update = (req, res) => {
    console.log('req.body', req.body);
    console.log('category update param', req.params.categoryId);
    // get the category
    const category = req.category;
    // get category's name
    category.name = req.body.name;
    // save
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    // get category
    const category = req.category;
    Product.find({ category }).exec((err, data) => {
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You cant delete ${category.name}. It has ${data.length} associated products.`
            });
        } else {
            // remove the category
            category.remove((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({
                    message: 'Category has been deleted'
                });
            });
        }
    });
};

exports.list = (req, res) => {
    // get all the categories
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};
