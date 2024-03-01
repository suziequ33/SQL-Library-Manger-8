const express = require('express');
const router = express.Router();

const { Book } = require('../models');

//Get home to /books
router.get('/', (req, res) => {
    res.redirect('/books');
});

//Get to full list of books
router.get('/books', async(req, res) => {
    try {
        const books = await Book.findAll();
        res.render('books/index', { books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).render('error', { error, message: 'Internal Server Error' });
    }
});

//Create new book form
router.get('/books/new', (req, res) => {
    res.render('books/new', {book: {}, title: "New Book"});
});

//Post create book from database
router.post('/books/new', async (req, res) => {
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
});

//Show book detail form
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        res.render('books/detail', { book });
    } catch (error) {
        console.error('Error updating book info:', error);
        res.status(500).render('error', { error, message: 'Internal Server Error'});
    }
});

//Update book info from database
router.post('/books/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        //retrieve existing book from database
        const bookToUpdate = await Book.findByPk(bookId);

        if(!bookToUpdate) {
            return res.status(404).render('error', { error: { status: 404 }, message: 'Book not found' });
        }
        //Update the book properites based on the data in req.body
        bookToUpdate.title = req.body.title;
        bookToUpdate.author = req.body.author;
        bookToUpdate.genre = req.body.genre;
        bookToUpdate.year = req.body.year;

        //Save the changes to the database
        await bookToUpdate.save();
        res.redirect(`/books/${bookId}`);
    } catch {
        console.error('Error updating book info:', error);
        res.status(500).render('error', { error, message: 'Internal Server Error' });
    }
});

//Delete book form
router.post('/books/:id/delete', async (req, res) => {
    const bookId = req.params.id;

    try {
        //retrieve existing book from database
        const bookToUpdate = await Book.findByPk(bookId);

        if (!bookToUpdate) {
            return res.status(404).render('error', { error: { status: 404 }, message: 'Book not found'});
        }
        //Delet boo from the database
        await bookToUpdate.destroy();

        //redirect to the books list after delete
        res.redirect('/books');
    } catch (error) {
        console.error('Error deleting a book:', error);
        res.status(500).render('error', { error, message: 'Internal Server Error' });
    }
});


module.exports = router;