'use strict'
const express = require('express');
const cors = require('cors');

//Init
const app = express();
require('./database');

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewars
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//Routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/users.js'));
app.use('/api', require('./routes/employees.js'));
app.use('/api', require('./routes/warhouse'));
app.use('/api', require('./routes/calendar'));

//Server is Listening
app.listen(app.get('port'), () => {
    console.log('Server On Port', app.get('port'));
});