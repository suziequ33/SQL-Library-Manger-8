const express = require('express');
const router = express.Router();
const { Book } = require('../models');

router.use(express.static('public'));

//Handler function to wrap each route
function asyncHandler(cd) {
    return async (req, res, next) => {
        try {
            await cd(req, res, next);
        } catch (error) {
            //forward error to the golbal error handler
            next(error);
        }
    }
}

//Book routes (full list of books)
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render('index', { books, title: 'Books' });
}));

//Create new book form
router.get('/new', (req, res) => {
    res.render('new-book', { book: {}, title: "New Book" });
});

//Post new created book to the database
router.post('/new', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/books');
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            book = await Book.build(req.body);
            res.render('new-book', { book, errors: error.errors, title: "New Book " });
        } else {
            throw error;
        }
    }
}));

//Get individual book 
router.get('/:id', asyncHandler(async (req, res, next) => {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    if (book) {
        res.render('detail', { book });
    } else {
        const error = new Error('Book not found');
        error.status = 404;
        next(error);  //pass the error to the gobal error handler
    }
}));


//Update book info from database
router.post('/:id', asyncHandler(async (req, res, next) => {
    let book;
    try {
        //retrieve existing book from database
         book = await Book.findByPk(req.params.id);
         console.log('Book ID:', req.params.id);
        if (book) {
            //Update book data
            await book.update(req.body);
            //reditect to the list of books
            res.redirect('/books/' + book.id);
        } else {
            //books not found, throw error
            const error = new Error('Book not found');
            error.status = 404;
            next(error);
        }
    } catch (error) {
        console.log('Error updating book:', error);
        if (error.name === 'SequelizeValidationError') {
            //Handel validation errors
            console.log('Validation errors:', error.errors);
             book = await Book.build(req.body);
             console.log('retrieved book:', book);
            book.id = req.params.id;
            console.log('rendering update-book view with validation error');
            res.render('update-book', { book, errors: error.errors, title: 'Update Book' });
        } else {
            //forward other errors to the global error handler
            console.log('forwarding error to global error handler');
            next(error);
            //throw error;
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
        res.redirect('/');
    } else {
        res.sendStatus(404);
    }
}));


module.exports = router;