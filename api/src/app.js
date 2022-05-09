const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const initKeycloak = require('./keycloak-config.js')
const users = require('./routes/users.js')
const offices = require('./routes/offices.js')

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json())

const keycloak = initKeycloak();
app.use(keycloak.middleware())
app.use(keycloak.protect())

app.get('/', (request, response) => {
    // const token = request.kauth.grant.access_token.content;
    // token.sub - user ID
    // token.preferred_username - username
    // token.email
    // token.given_name - first name
    // token.family_name - last name
    // let isAdmin = token.realm_access?.roles?.indexOf('admin') > -1
    response.set("Access-Control-Allow-Origin", "*");
    response.status(200).send('App root route running');
})

app.use('/api/users', users);
app.use('/api/offices', offices);


module.exports = app;

