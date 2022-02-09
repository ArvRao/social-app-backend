// imports
const dotenv = require('dotenv');
const {
  app,
  mongoose,
  vars
} = require("./src/config");
const requireLogin = require('./src/middlewares/requireLogin')
const uploadMedia = require('./src/routes/media')

const auth = require('./src/routes/auth')
const post = require('./src/routes/post')

dotenv.config()

//* database connection
mongoose.connect();

//* Middlewares
app.use('/api', auth)
app.use('/posts', requireLogin, post)
app.use('/upload', uploadMedia)


// Start the server
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