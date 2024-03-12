const express = require('express');
const router = express.Router();

const bookRoute = require('./books');

//Home route redirects to books
router.get('/', async (req, res) => {
    res.redirect('/books');
});

router.use('/books', bookRoute)

module.exports = router;