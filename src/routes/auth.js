const express = require('express')
const router = express.Router()

router.get('/route', (req, res) => {
    res.send('router route')
})

router.post('/signup', (req, res) => {
   const { name, email, password } = req.body
   if(!name || !password || !email) {
    return res.status(422).json({err: 'Please enter all credentials'})
   }

   res.status(200).json({message: 'Successful'})
})

module.exports = router