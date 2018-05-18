const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());


const mainRoutes = require('./routes/main');
app.use('/api', mainRoutes);

const userRoutes = require('./routes/account');
app.use('/api/accounts', userRoutes);

const sellerRoutes = require('./routes/seller');
app.use('/api/seller', sellerRoutes);

const surveyRoutes = require('./routes/survey');
app.use('/api/questionare', surveyRoutes);


mongoose.connect(config.database, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Connected to database');
    app.listen(config.port, () => {
        console.log('API Started on port ' + config.port);
    });
});