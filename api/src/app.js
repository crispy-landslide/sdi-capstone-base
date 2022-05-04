const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const users = require('./routes/users.js')
const offices = require('./routes/offices.js')

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json())

app.get('/', (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.status(200).send('App root route running');
})

app.use('/api/users', users);
app.use('/api/offices', offices);


module.exports = app;

