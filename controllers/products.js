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

const getProducts = async (req, res, next) => {
    try {
        const getProducts = await productModel.find({});
        res
            .status(200)
            .json(getProducts);
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findById(productId);
        if (product) {
            res
                .status(200)
                .json(product);
        } else {
            res
                .status(404)
                .send();
        }
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const updatedBody = req.body;
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId, updatedBody, { new: true }
        );
        if (updatedProduct) {
            res
                .status(200)
                .json(updatedProduct);
        } else {
            next({ message: "업데이트하려는 상품이 존재하지 않습니다." });
        }

    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const deletedProduct = await productModel.findByIdAndDelete(productId);
        if (deletedProduct) {
            res
                .status(200)
                .json(deletedProduct);
        } else {
            res
                .status(404)
                .json({ message: "지우려는 상품이 없습니다." });
        }
    } catch (error) {
        next(error);
    }

}

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };