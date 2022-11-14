const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});

describe("/non-existing-route", () => {
    test("GET - 404: Responds with error for non existing route", () => {
        return request(app)
            .delete("/non-existing-route")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Route not found");
            });
    });
});

describe("/api/categories", () => {
    test("GET - 200: Responds with an array of category objects", () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then((res) => {
                const categories = res.body.categories;
                expect(categories.length).toBeGreaterThan(0);
                categories.forEach((category) => {
                    expect(category).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String),
                    });
                });
            });
    });
});
