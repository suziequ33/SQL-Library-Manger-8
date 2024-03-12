const express = require('express');
const { sequelize } = require('./models');
const { Book } = require('./models/index');
const path = require('path');

//Routes setup
const routes = require('./routes/index');
const books = require('./routes/books')

const app = express();
const PORT = 3000;


//Middleware and configurations
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use('/', routes);
app.use('/books', books);


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


//Database connection
sequelize.authenticate()
.then(() => {
    console.log('Connection to the database has been established successfully.');
})
.catch((error) => {
    console.error('Unable to connect to the database:', error);
});

sequelize.sync()
.then(() => {
    console.log('Database synchronized.');

})
.catch((error) => {
    console.error('Error syncing the database:', error);
});


// 404 handler
app.use((req, res, next) => {
    //next(createError(404));
    const error = new Error('Not Found');
    error.status = 404;
    res.status(404).render('page-not-found', { error });
    //error.message = 'Oops! The page you requested could not be fund.';
    //next(error);
    //const error = createError(404, 'Page not found');
    //throw createError(404, 'Page not found');
    //res.status(404).send('page-not-found', { error });
});

//global error handler
app.use((err, req, res, next) => {
    err.status = err.status || 500;
    err.message = err.message || 'Internal Server Error';
    console.error(`Error: ${err.status}: ${err.message}`);
    //res.status(err.status || 500).render('error', { err });
    //res.status(err.status).render('error', { err });
    res.render('error', { err });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
