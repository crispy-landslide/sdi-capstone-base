const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const users = require('./routes/users.js')
const teams = require('./routes/teams.js')
const tasks = require('./routes/tasks.js')
const offices = require('./routes/offices.js')
const events = require('./routes/events.js')
const attacks = require('./routes/attacks.js')

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json())

app.get('/', (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.status(200).send('App root route running');
})

app.use('/api/users', users);
// app.use('/api/teams', teams);
// app.use('/api/tasks', tasks);
app.use('/api/offices', offices);
app.use('/api/events', events);
// app.use('/api/attacks', attacks);


module.exports = app;

