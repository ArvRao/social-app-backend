// imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const morgan = require('morgan');
const app = express();
app.use(express.json())
app.use(morgan("common"));

require('./src/models/user')

dotenv.config()
const auth = require('./src/routes/auth')

app.use('/api', auth)
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
}

// middlewares

app.get('/', customMiddleware, (req, res) => {
  console.log('Route');
  res.send('Working...');
})

server = app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
})