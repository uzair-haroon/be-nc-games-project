const { query } = require("../db/connection");
const db = require("../db/connection");

exports.selectCategories = () => {
    return db
        .query(
            `
                SELECT *
                FROM categories
            `
        )
        .then((result) => {
            return result.rows;
        });
};

exports.selectReviews = () => {
    return db
        .query(
            `
                SELECT reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes, CAST(COUNT( comments.comment_id ) AS int) AS comment_count
                FROM reviews
                LEFT JOIN comments
                ON reviews.review_id = comments.review_id
                GROUP BY reviews.review_id
                ORDER BY reviews.created_at DESC;
            `
        )
        .then((result) => {
            return result.rows;
        });
};
