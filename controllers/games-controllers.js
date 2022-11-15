const {
    selectCategories,
    selectReviews,
    selectReviewById,
    selectCommentsByReviewId,
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
