const db = require("../db/connection");

exports.checkReviewExists = (review_id) => {
    return db
        .query(
            `
                SELECT * 
                FROM reviews 
                WHERE review_id = $1;
            `,
            [review_id]
        )
        .then((res) => {
            if (res.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `Review ID : ${review_id} does not exist`,
                });
            }
        });
};

exports.checkUserExists = (username) => {
    return db
        .query(
            `
                SELECT * 
                FROM users 
                WHERE username = $1;
            `,
            [username]
        )
        .then((res) => {
            if (res.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `Username : '${username}' does not exist`,
                });
            }
        });
};

exports.checkCategoryExists = (category) => {
    if (!category) {
        return Promise.resolve();
    }
    return db
        .query(
            `
                SELECT * 
                FROM categories 
                WHERE slug = $1;
            `,
            [category]
        )
        .then((res) => {
            if (res.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `Category : ${category} does not exist`,
                });
            }
        });
};
