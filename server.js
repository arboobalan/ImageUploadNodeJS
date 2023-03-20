const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

//database
mongoose.connect('mongodb://localhost:27017/ImageOnly', { useUnifiedTopology: true })
    .then(() => {
        console.log('Mongoose connected');
    }).catch(() => {
        console.log('Mongoose not connected');
    });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

//session
app.use(session({
    secret: 'secret key',
    resave: true,
    saveUninitialized: false
}));

//routes
const imageRoutes = require('./controller/imgcontroller');
app.use('/', imageRoutes);

//uploads
app.use(express.static('uploads'));

//404 not found
app.use((req, res, next) => {
    const msg = '<h2>File not found <a href="/"> click here to Homepage </a></h2>';
    const err = Error(msg);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

port = 1021;

app.listen(port, (req, res) => {
    console.log(`Port started at => http://localhost:${port}`);
});