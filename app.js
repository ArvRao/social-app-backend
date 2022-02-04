// imports
const dotenv = require('dotenv');
const user = require('./src/models/user')
const {
  app,
  mongoose,
  vars
} = require("./src/config");
const requireLogin = require('./src/middlewares/requireLogin')

const auth = require('./src/routes/auth')
dotenv.config()

//* database connection
mongoose.connect();

//* Middlewares
app.use('/api', auth)

//? Test
const customMiddleware = (req, res, next) => {
  console.log('Custom middleware');
  next()
}

app.get('/protected', requireLogin, (req, res) => {
  res.send('Test router route successful with requireLogin using JWT!')
})

// middlewares
app.get('/', customMiddleware, (req, res) => {
  res.send('Working...');
})

app.listen(vars.port, () => {
  console.log(`Server running at port ${vars.port}`);
})

//! Handle unexpected errors
process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
    process.exit(1);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });