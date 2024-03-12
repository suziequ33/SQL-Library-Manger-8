const express = require('express');
const router = express.Router();
const { Book } = require('../models');

//Handler function to wrap each route
function asyncHandler(cd) {
    return async (req, res, next) => {
        try { 
            await  cd(req, res, next)
        } catch (error) {
            //forward error to the golbal error handler
            next(error);
        }
    };
}

//Book routes (full list of books)
router.get('/', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.render('index', { books });
    } catch (error) {
        next(error);
    }
});

//Create new book form
router.get('/new', (req, res) => {
    res.render('new-book', {book: {}, title: "New Book"});
});

//Post new created book to the database
router.post('/new', asyncHandler(async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.redirect('/books');
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const book = await Book.build(req.body);
            const errors = error.errors.map(err => ({ message: err.message }));
            res.render('new-book', { book, errors, title: "New Book "});
        } else {
            throw error;
        }
    }
}));


//Get individual book 
router.get('/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('update-book', { book, title: book.title });
    } else {
        res.sendStatus(404);
    }
}));

//Update book info from database
router.post('/:id', asyncHandler(async (req, res) => {
    try {
        //retrieve existing book from database
        let book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect('/books/' + book.id);
        } else {
            res.sendStatus(404);
        }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
               let book = await Book.build(req.body);
                book.id = req.params.id;
                res.render('edit', { book, error: error.errors, title: 'Edit Book' });
            } else {
                next(error); 
            }
        }
        }));

//Delete book form
router.get('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('delete', { book, title: 'Delete Book' });
    } else {
        res.sendStatus(404);
    }
}));

//Delete individual book
router.post('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect('/books');
    } else {
        res.sendStatus(404);
    }
}));


module.exports = router;