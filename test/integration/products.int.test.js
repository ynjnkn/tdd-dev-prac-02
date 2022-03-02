const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const newProduct = require('../data/new-product.json');
const allProducts = require('../data/all-products.json');
const updatedProduct = { name: "UPDATED", description: "UPDATED", price: 99999 };

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

test("GET POSTS SUCCESS /api/products", async () => {
    const response = await request(app)
        .get("/api/products")
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBe("(20%쿠폰) 독일 친환경 식기세척기세제 그린레몬 50개입 2개 + 틴케이스or행주 증정");
    firstProduct = response.body[0];
})

test("GET POST BY ID SUCCESS /api/products/:productId", async () => {
    const response = await request(app)
        .get(`/api/products/${firstProduct._id}`);
    // console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(firstProduct._id);
    expect(response.body.name).toBe(firstProduct.name);
    expect(response.body.description).toBe(firstProduct.description);
    expect(response.body).toStrictEqual({
        "_id": "621cb640b05c7d475fb238eb",
        "name": "(20%쿠폰) 독일 친환경 식기세척기세제 그린레몬 50개입 2개 + 틴케이스or행주 증정",
        "description": "오늘의집 식기세척기용세제 스토어, (20%쿠폰) 독일 친환경 식기세척기세제 그린레몬 50개입 2개 + 틴케이스or행주 증정. 살까 말까 고민 될 땐 리얼 리뷰와 유저들이 직접 찍은 스타일링샷을 확인해보세요!",
        "price": 36900,
        "__v": 0
    });
});

test("GET POST BY ID ERROR /api/products/:productId", async () => {
    const response = await request(app)
        .get('/api/products/621cb640b05c7d475fb238aa')
    expect(response.statusCode).toBe(404);
});

test("UPDATE POST SUCCESS /api/products/:productId", async () => {
    const response = await request(app)
        .put('/api/products/621e2c00a1be94a5da08bef1')
        .send(updatedProduct)
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("UPDATED");
    expect(response.body.description).toBe("UPDATED");
});

test("UPDATE POST ERROR /api/products/:productId", async () => {
    const response = await request(app)
        .put('/api/products/621e2c00a1be94a5da08beaa')
        .send(newProduct);
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({ message: "업데이트하려는 상품이 존재하지 않습니다." });
});

test("DELETE POST SUCCESS /api/products/:productId", async () => {
    const response = await request(app)
        .delete('/api/products/621e2c00a1be94a5da08bef1')
    expect(response.statusCode).toBe(200);
});

test("DELETE POST ERROR /api/products/:productId", async () => {
    const response = await request(app)
        .delete('/api/products/621e2c00a1be94a5da08beaa')
    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({ message: "지우려는 상품이 없습니다." });
});

afterAll(async () => {
    await mongoose.disconnect();
});