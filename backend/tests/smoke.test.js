// Smoke test ringan — jalankan dengan: npm test
// Butuh MySQL lokal aktif dengan database dari backend/.env (default: parfum_db).
process.env.NODE_ENV = "test"; // menonaktifkan rate limiter (harus sebelum require server)

const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../server");

before(async () => {
  // Tunggu sync skema selesai sebelum query pertama
  await app.ready;
});

test("GET /api/products tanpa pagination -> data penuh, tanpa meta", async () => {
  const res = await request(app).get("/api/products").expect(200);
  assert.equal(res.body.status, "success");
  assert.ok(Array.isArray(res.body.data));
  assert.ok(res.body.data.length > 0);
  assert.equal(res.body.meta, undefined);
});

test("GET /api/products?page=1&limit=5 -> terpaginasi dengan meta", async () => {
  const res = await request(app).get("/api/products?page=1&limit=5").expect(200);
  assert.equal(res.body.status, "success");
  assert.ok(res.body.data.length <= 5);
  assert.equal(res.body.meta.page, 1);
  assert.equal(res.body.meta.limit, 5);
  assert.ok(res.body.meta.total >= res.body.data.length);
  assert.ok(res.body.meta.totalPages >= 1);
});

test("GET /api/events -> punya registeredCount, tidak membocorkan data pendaftar", async () => {
  const res = await request(app).get("/api/events").expect(200);
  assert.equal(res.body.status, "success");
  assert.ok(res.body.data.length > 0);
  for (const event of res.body.data) {
    assert.ok("registeredCount" in event, "setiap event punya registeredCount");
    assert.ok(!("EventRegistrations" in event), "data pendaftar (PII) tidak ikut dikirim");
  }
});

test("GET /api/events/:id yang tidak ada -> 404", async () => {
  const res = await request(app).get("/api/events/999999").expect(404);
  assert.equal(res.body.status, "fail");
});

test("GET endpoint API tak dikenal -> 404 JSON", async () => {
  const res = await request(app).get("/api/tidak-ada").expect(404);
  assert.equal(res.body.status, "fail");
  assert.ok(res.body.message);
});

test("POST /api/auth/login kredensial salah -> 401", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "tidak-ada@contoh.com", password: "salah-satu" })
    .expect(401);
  assert.equal(res.body.status, "fail");
});
