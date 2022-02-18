const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
// const routes = require("../routes");


const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({
    extended: true
}));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// routes
app.get("/ping", (req, res) => {
    res.sendStatus(200);
});

// app.use("/email", routes.emailRoutes);

module.exports = app;