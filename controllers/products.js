const productModel = require('../models/products');

const createProduct = async (req, res, next) => {
    try {
        const createdProduct = await productModel.create(req.body);
        res
            .status(201)
            .json(createdProduct);
    } catch (error) {
        next(error);
    }
};

module.exports = { createProduct }