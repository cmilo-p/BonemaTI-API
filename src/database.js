'use strict'
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/BonemaTest', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('DB is Connected'))
    .catch(err => console.log(err));