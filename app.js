const express = require('express');
const { sequelize } = require('./models');
const path = require('path');

const app = express();
const routes = require('./routes/index');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use(epress.static(path.join(__dirname, 'public')));


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
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
    //res.status(404).send('page-not-found', { errer });
});

//global error handler
app.use((err, req, res, next) => {
    res.status = err.status || 500;
    err.message = err.message || 'Internal Server Error';
    console.error(`Error statu: ${err.status} - ${err.message}`);

    res.status(err.status).render('error', { error: err,message });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
