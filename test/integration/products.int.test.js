const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const newProduct = require('../data/new-product.json');

test("CREATE POST SUCCESS /api/products", async () => {
    const response = await request(app)
        .post("/api/products")
        .send(newProduct);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.description).toBe(newProduct.description);
});

test("CREATE POST ERROR /api/products", async () => {
    const response = await request(app)
        .post("/api/products")
        .send({ "name": "양키캔들라지자 + 캔들워머 7종 SET (할로겐전구2개증정)(빛 조절)" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({ message: "Product validation failed: description: Path `description` is required." });
});

afterAll(async () => {
    await mongoose.disconnect();
});