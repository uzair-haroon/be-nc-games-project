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

describe("/api/reviews", () => {
    test("GET - 200: Responds with an array of review objects", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then((res) => {
                const reviews = res.body.reviews;
                expect(reviews.length).toBeGreaterThan(0);
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        category: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number),
                    });
                });
                expect(reviews).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
});

describe("/api/reviews/:review_id", () => {
    test("GET - 200: Responds with review object", () => {
        return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then((res) => {
                const review = res.body.review;
                expect(review).toMatchObject({
                    review_id: 1,
                    title: expect.any(String),
                    category: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    review_body: expect.any(String),
                });
            });
    });
    test("GET - 404: Responds with error if valid but non-existant review ID requested", () => {
        return request(app)
            .get("/api/reviews/100")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Review ID : 100 does not exist");
            });
    });
    test("GET - 400: Responds with error if invalid review ID requested", () => {
        return request(app)
            .get("/api/reviews/not-a-valid-id")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request");
            });
    });
});

describe("/api/reviews/:review_id/comments", () => {
    test("GET - 200: Responds with array of comment objects for requested review", () => {
        return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then((res) => {
                const comments = res.body.comments;
                expect(comments.length).toBeGreaterThan(0);
                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: expect.any(Number),
                    });
                });
                expect(comments).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
    test("GET - 200: Responds with empty array of comment objects for requested review with no comments", () => {
        return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then((res) => {
                const comments = res.body.comments;
                expect(comments.length).toBe(0);
            });
    });
    test("GET - 404: Responds with error if valid but non-existant review ID requested", () => {
        return request(app)
            .get("/api/reviews/100/comments")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Review ID : 100 does not exist");
            });
    });
    test("GET - 400: Responds with error if invalid review ID is requested", () => {
        return request(app)
            .get("/api/reviews/not-a-valid-id/comments")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request");
            });
    });
});
