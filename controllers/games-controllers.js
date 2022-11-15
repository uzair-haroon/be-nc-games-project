const { selectCategories, selectReviews } = require("../models/games-model");

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
