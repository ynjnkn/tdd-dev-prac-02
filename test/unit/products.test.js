const productController = require('../../controllers/products');
const productModel = require("../../models/products");
const httpMocks = require("node-mocks-http");

const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-products.json");
const productId = '621cb640b05c7d475fb238eb';
const updatedProduct = { name: "UPDATED", description: "UPDATED", price: 99999 };

productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("Product Controller Create", () => {
    beforeEach(() => {
        req.body = newProduct;
    });
    test("should have a createProduct function", () => {
        expect(typeof (productController.createProduct)).toBe("function");
    });
    test("should call productModel.create", async () => {
        await productController.createProduct(req, res, next);
        expect(productModel.create).toHaveBeenCalledWith(newProduct);
    });
    test("should return 201 response code", async () => {
        await productController.createProduct(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should return json body in response", async () => {
        productModel.create.mockReturnValue(newProduct);
        await productController.createProduct(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newProduct);
    })
    test("should handle errors", async () => {
        const errorMessage = { message: "description property missing" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.create.mockReturnValue(rejectedPromise);
        await productController.createProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
});

describe("Product Controller Get", () => {
    test("should have a getProducts function", () => {
        expect(typeof (productController.getProducts)).toBe("function");
    });
    test("should call productModel.find({})", async () => {
        await productController.getProducts(req, res, next);
        expect(productModel.find).toHaveBeenCalledWith({});
    })
    test("should return status code 200", async () => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should return json body in response", async () => {
        productModel.find.mockReturnValue(allProducts);
        await productController.getProducts(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProducts);
    });
    test("should handle errors", async () => {
        const errorMessage = { message: "error loading products" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.find.mockReturnValue(rejectedPromise);
        await productController.getProducts(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
});

describe("Product Controller GetById", () => {
    test("should have a getProductById function", () => {
        expect(typeof (productController.getProductById)).toBe("function");
    });
    test("should call productModel.findById", async () => {
        req.params.productId = productId;
        await productController.getProductById(req, res, next);
        expect(productModel.findById).toHaveBeenCalledWith(productId);
    });
    test("should return status code 200 and json body", async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should return status code 404 if queried item does not exist", async () => {
        req.params.productId = "nonexistingproductid";
        productModel.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should handle errors", async () => {
        const errorMessage = { message: "error loading queried product" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectedPromise);
        await productController.getProductById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe("Product Controller Update", () => {
    test("should have an updateProduct function", () => {
        expect(typeof (productController.updateProduct)).toBe("function");
    });
    test("should call productModel.findByIdAndUpdate", async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        await productController.updateProduct(req, res, next);
        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
            productId,
            updatedProduct,
            { new: true }
        );
    });
    test("should return status code 200 and json body", async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(updatedProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should handle errors", async () => {
        const errorMessage = { message: "error updating the product" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await productController.updateProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })

});

describe("Product Controller Delete", () => {
    beforeEach(() => {
        req.params.productId = productId;
    })

    test("should have a deleteProduct function", () => {
        expect(typeof (productController.deleteProduct)).toBe("function");
    });
    test("should call productModel.findByIdAndDelete", async () => {
        await productController.deleteProduct(req, res, next);
        expect(productModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
    })
    test("should return status code 200 and json body", async () => {
        const deletedProduct = newProduct;
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(deletedProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should return status code 404 when the item to be deleted does not exist", async () => {
        productModel.findByIdAndDelete.mockReturnValue(null);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should handle errors", async () => {
        const errorMessage = { message: "error deleting the product" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await productController.deleteProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});
