const express = require('express');
const { sequelize } = require('./models');
const path = require('path');
const createError = require('http-errors');

const app = express();
const routes = require('./routes/books');

//Middleware and configurations
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

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
    console.log('Database and tables synced.');
})
.catch((error) => {
    console.error('Error syncing the database:', error);
});

// 404 handler
app.use((req, res, next) => {
    next(createError(404));
    //const error = new Error('Not Found');
    //error.status = 404;
    //const error = createError(404, 'Page not found');
    //throw createError(404, 'Page not found');
    //res.status(404).send('page-not-found', { error });
});

//global error handler
app.use((err, req, res, next) => {
    err.status = err.status || 500;
    err.message = err.message || 'Internal Server Error';
    console.log(`Error status: ${err.status} - ${err.message}`);
    
    res.status(err.status).render('error', { error: err, message: err.message });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
