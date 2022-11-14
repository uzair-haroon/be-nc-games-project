const express = require("express");

const {
    getCategories,
    getReviews,
} = require("./controllers/games-controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Route not found" });
});

// Server Erros?
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "server error" });
});

module.exports = app;
