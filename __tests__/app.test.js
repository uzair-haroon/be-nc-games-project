const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { readFile } = require("fs/promises");
const path = require("path");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});

describe("/api", () => {
    test("GET - 200: Responds with an array of endpoint objects", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then((res) => {
                const file = path.join(`${__dirname}/..`, "endpoints.json");
                const endpointsBody = res.body.endpoints;
                readFile(file, { encoding: "utf-8" }).then((endpointsFile) => {
                    expect(endpointsBody).toEqual(JSON.parse(endpointsFile));
                });
            });
    });
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
    test("GET - 200: Responds with an array of review objects sorted by date in descending order if no query params are added", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then((res) => {
                const reviews = res.body.reviews;
                expect(reviews).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
    test("GET - 200: Responds with an array of review objects containing only the 'social deduction' category sorted by date in descending order if the category query param was requested", () => {
        return request(app)
            .get("/api/reviews?category=dexterity")
            .expect(200)
            .then((res) => {
                const reviews = res.body.reviews;
                expect(reviews.length).toBeGreaterThan(0);
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        category: "dexterity",
                    });
                });
                expect(reviews).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
    test("GET - 200: Responds with an array of review objects containing only the 'social deduction' category sorted by 'votes' in descending order if the category and sort_by query param was requested", () => {
        return request(app)
            .get("/api/reviews?category=dexterity&sort_by=votes")
            .expect(200)
            .then((res) => {
                const reviews = res.body.reviews;
                expect(reviews.length).toBeGreaterThan(0);
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        category: "dexterity",
                    });
                });
                expect(reviews).toBeSortedBy("votes", {
                    descending: true,
                });
            });
    });
    test("GET - 200: Responds with an array of review objects containing only the 'social deduction' category sorted by 'votes' in ascending order if the category, sort_by and order query param was requested", () => {
        return request(app)
            .get("/api/reviews?category=dexterity&sort_by=votes&order=asc")
            .expect(200)
            .then((res) => {
                const reviews = res.body.reviews;
                expect(reviews.length).toBeGreaterThan(0);
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        category: "dexterity",
                    });
                });
                expect(reviews).toBeSortedBy("votes", {
                    descending: false,
                });
            });
    });
    test("GET - 404: Responds with error if non-existing category is inputted", () => {
        return request(app)
            .get("/api/reviews?category=annoying&sort_by=votes&order=asc")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Category : annoying does not exist");
            });
    });
    test("GET - 400: Responds with error if invalid sort_by is inputted", () => {
        return request(app)
            .get("/api/reviews?category=dexterity&sort_by=age&order=asc")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe(
                    "Bad Request: Invalid query parameter(s)"
                );
            });
    });
    test("GET - 400: Responds with error if invalid order is inputted", () => {
        return request(app)
            .get(
                "/api/reviews?category=social deduction&sort_by=votes&order=upwards"
            )
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe(
                    "Bad Request: Invalid query parameter(s)"
                );
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
    test("GET - 200: Responds with review object containing 0 for comment_count", () => {
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
                    comment_count: 0,
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
    test("PATCH - 200: Responds with the updated review", () => {
        const newReviewData = {
            inc_votes: 5,
        };
        return request(app)
            .patch("/api/reviews/1")
            .send(newReviewData)
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
                    votes: 6,
                    review_body: expect.any(String),
                });
            });
    });
    test("PATCH - 404: Responds with error if valid but non-existant review ID requested", () => {
        const newReviewData = {
            inc_votes: 5,
        };
        return request(app)
            .patch("/api/reviews/100")
            .send(newReviewData)
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Review ID : 100 does not exist");
            });
    });
    test("PATCH - 400: Responds with error if invalid review ID requested", () => {
        const newReviewData = {
            inc_votes: 5,
        };
        return request(app)
            .patch("/api/reviews/not-a-valid-id")
            .send(newReviewData)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request");
            });
    });
    test("PATCH - 400: Responds with error if invalid type for inc_votes is inluded in request body", () => {
        const newReviewData = {
            inc_votes: "five",
        };
        return request(app)
            .patch("/api/reviews/1")
            .send(newReviewData)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe(
                    "Unprocessable Entity: Request body contains invalid types"
                );
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
    test("POST - 201: Responds with the newly posted comment", () => {
        const newComment = {
            username: "bainesface",
            body: "My dog loved this game too!",
        };
        return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(201)
            .then((res) => {
                const comment = res.body.comment;
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: 0, // Default to 0?
                    created_at: expect.any(String),
                    author: "bainesface", // username
                    body: "My dog loved this game too!", // req.body.body
                    review_id: 1, // in URL params
                });
            });
    });
    test("POST - 404: Responds with error if valid but non-existant review ID requested", () => {
        const newComment = {
            username: "bainesface",
            body: "My dog loved this game too!",
        };
        return request(app)
            .post("/api/reviews/100/comments")
            .send(newComment)
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Field does not exist");
            });
    });
    test("POST - 404: Responds with error if non-existant username requested", () => {
        const newComment = {
            username: "some-non-existant-username",
            body: "My dog loved this game too!",
        };
        return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Field does not exist");
            });
    });
    test("POST - 400: Responds with error if anything other than 'username' and 'body' are included in the request body", () => {
        const newComment = {
            username: "bainesface",
            body: "My dog loved this game too!",
            votes: 52,
        };
        return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request");
            });
    });
    test("POST - 400: Responds with error if invalid types for 'username' and 'body' are included in the request body", () => {
        const newComment = {
            username: "bainesface",
            body: 26.23,
        };
        return request(app)
            .post("/api/reviews/1/comments")
            .send(newComment)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe(
                    "Unprocessable Entity: Request body contains invalid types"
                );
            });
    });
});

describe("/api/users", () => {
    test("GET - 200: Responds with an array of user objects", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then((res) => {
                const users = res.body.users;
                expect(users.length).toBeGreaterThan(0);
                users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    });
                });
            });
    });
});

describe("/api/comments/:comment_id", () => {
    test("DELETE - 204: Responds with an empty object", () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then((res) => {
                expect(res.body).toMatchObject({});
            });
    });
    test("DELETE - 404: Responds with error for comment that does not exists", () => {
        return request(app)
            .delete("/api/comments/500")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Comment ID : 500 does not exist");
            });
    });
    test("DELETE - 400: Responds with error for an invalid comment_id", () => {
        return request(app)
            .delete("/api/comments/not-a-valid-id")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request");
            });
    });
});
