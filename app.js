const express = require("express");

const {} = require("./controllers/games-controllers");

const app = express();

app.use(express.json());

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Route not found" });
});

// PSQL Error Handling
app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" });
    } else {
        next(err);
    }
});

// Manual Error Handling
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

// Server Erros?
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "server error" });
});

module.exports = app;
