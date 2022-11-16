const { query } = require("../db/connection");
const db = require("../db/connection");
const { checkReviewExists, checkUserExists } = require("./utils");

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

exports.selectReviewById = (review_id) => {
    return db
        .query(
            `
                SELECT *
                FROM reviews
                WHERE review_id = $1;
            `,
            [review_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `Review ID : ${review_id} does not exist`,
                });
            }
            return result.rows[0];
        });
};

exports.selectCommentsByReviewId = (review_id) => {
    return checkReviewExists(review_id)
        .then(() => {
            return db.query(
                `
                    SELECT *
                    FROM comments
                    WHERE review_id = $1
                    ORDER BY created_at DESC;
                `,
                [review_id]
            );
        })
        .then((result) => {
            return result.rows;
        });
};

exports.insertComment = (username, body, review_id) => {
    return db
        .query(
            `
                INSERT INTO comments
                    (body, author, review_id)
                VALUES 
                    ($1, $2, $3)
                RETURNING *;
             `,
            [body, username, review_id]
        )
        .then((result) => {
            return result.rows[0];
        });
};

exports.updateReview = (inc_votes, review_id) => {
    return checkReviewExists(review_id)
        .then(() => {
            return db.query(
                `
                    UPDATE reviews
                    SET votes = votes + $1
                    WHERE review_id = $2
                    RETURNING *;
                `,
                [inc_votes, review_id]
            );
        })
        .then((result) => {
            return result.rows[0];
        });
};
