const {
    selectCategories,
    selectReviews,
    selectReviewById,
    selectCommentsByReviewId,
    insertComment,
} = require("../models/games-model");

exports.getCategories = (req, res, next) => {
    selectCategories().then((categories) => {
        res.status(200).send({ categories: categories });
    });
};

exports.getReviews = (req, res, next) => {
    selectReviews().then((reviews) => {
        res.status(200).send({ reviews: reviews });
    });
};

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;

    selectReviewById(review_id)
        .then((review) => {
            res.status(200).send({ review: review });
        })
        .catch((error) => {
            next(error);
        });
};

exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params;

    selectCommentsByReviewId(review_id)
        .then((comments) => {
            res.status(200).send({ comments: comments });
        })
        .catch((error) => {
            next(error);
        });
};

exports.postComment = (req, res, next) => {
    const { review_id } = req.params;
    const { username, body } = req.body;

    if (
        !(
            Object.keys(req.body).length === 2 &&
            Object.keys(req.body).includes("body") &&
            Object.keys(req.body).includes("username")
        )
    ) {
        next({ status: 400, msg: "Bad Request" });
    }

    if (
        !(
            typeof req.body.username === "string" &&
            typeof req.body.body === "string"
        )
    ) {
        next({
            status: 422,
            msg: "Unprocessable Entity: Request body contains invalid types",
        });
    }

    insertComment(username, body, review_id)
        .then((comment) => {
            res.status(201).send({ comment: comment });
        })
        .catch(next);
};
