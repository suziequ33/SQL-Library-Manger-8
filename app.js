const express = require('express');
const { sequelize } = require('./models');
const { Book } = require('./models/index');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//Routes setup
const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();
const PORT = 3000;

//Middleware and configurations
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/books', books);

//Function test database connection and synchroize models
const testDataBaseConn = async() => {
try {
        await sequelize.authenticate();
        console.log('Connection to the database successful!');

        await sequelize.sync();
        console.log('Model synchronized with the database.');
    } catch (error) {
        console.log('Error connection to the database:', error);
    }
};

testDataBaseConn();

// 404 handler
app.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    res.status(404).render('page-not-found', { error });
});

//global error handler
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).render('page-not-found');
    } else {
        next(err);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
