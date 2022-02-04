const express = require('express');
const helmet = require('helmet')
const morgan = require('morgan');
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({
    extended: true
}));

app.use(morgan("common"));

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());


module.exports = app;