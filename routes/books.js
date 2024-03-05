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
            next(error)
        }
    };
}

router.get('/', async (req, res) => {
    const books = await Book.findAll();
    res.render('books/index', { books });
});

//Get books listing
router.get('/books', asyncHandler(async(req, res) => {
    const books = await Book.findAll();
    res.render('books/index', { books });
}));


//Create new book form
router.get('/new', (req, res) => {
    res.render('books/new', {book: {}, title: "New Book"});
});

//Post create book from database
router.post('/new', asyncHandler(async (req, res) => {
   let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/books/' + book.id);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            book = await Book.build(req.body);
            res.render('books/new', { book, errors: error.errors, title: "New Book "});
        } else {
            throw error;
        }
    }
}));

// Edit book form
router.get('/:id/edit', asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        if (book) {
        res.render('books/edit', { book, title: 'Edit Book' });
    } else {
        res.sendStatus(404);
    }
}));

//Get individual book
router.get('/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('books/detail', { book, title: book.title });
    } else {
        res.sendStatus(404);
    }
}));

//Update book info from database
router.post('/:id/edit', asyncHandler(async (req, res) => {
    let book; 
    try {
        //retrieve existing book from database
         book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect('/books/' + book.id);
        } else {
            res.sendStatus(404);
        }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                book = await Book.build(req.body);
                book.id = req.params.id;
                res.render('books/edit', { book, error: error.errors, title: 'Edit Book' });
            } else {
                throw error; 
            }
        }
        }));

//Delete book form
router.get('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('books/delete', { book, title: 'Delete Book' });
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