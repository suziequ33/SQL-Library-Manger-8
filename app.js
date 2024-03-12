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
    const error = new Error('Not Found');
    error.status = 404;
    res.status(404).render('page-not-found', { error });
});

//global error handler
app.use((err, req, res, next) => {
    err.status = err.status || 500;
    err.message = err.message || 'Internal Server Error';
    console.error(`Error: ${err.status}: ${err.message}`);
    res.render('error', { err });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
