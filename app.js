// imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const morgan = require('morgan');
const app = express();
app.use(express.json())
app.use(morgan("common"));
const user = require('./src/models/user')
const vars = require('./src/config/vars')
const requireLogin = require('./src/middlewares/requireLogin')

dotenv.config()
const auth = require('./src/routes/auth')

app.use('/api', auth)


app.get('/route', requireLogin, (req, res) => {
  res.send('Test router route successful with requireLogin using JWT!')
})


// * open mongoose connection
app.use('/api', auth)
// database connection
mongoose
  .connect(vars.url, {
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

app.listen(vars.port, () => {
  console.log(`Server running at port ${vars.port}`);
})