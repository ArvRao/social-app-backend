// imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const morgan = require('morgan');
const app = express();
app.use(express.json())

require('./src/models/user')

dotenv.config()

app.use(require('./src/routes/auth'))
// database connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connect) => {
    console.log(`Connected to database successfully`)
  })
  .catch((err) => {
    console.log(err)
  })


const customMiddleware = (req, res, next) => {
    console.log('Custom middleware');
    next();
}

// middlewares
app.use(morgan("common"));

app.get('/', customMiddleware, (req, res) => {
    console.log('Route');
    res.send('Working...');
})

app.listen(process.env.PORT, (req, res) => {
    console.log(`Server running at port ${process.env.PORT}`);
})