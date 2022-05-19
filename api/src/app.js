const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const initKeycloak = require('./keycloak-config.js')
const users = require('./routes/users.js')
const offices = require('./routes/offices.js')

// if (process.env.NODE_ENV === 'development') {
//   const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);

//   (async () => {
//       try {
//         console.log("Rolling back database . . . ")
//         await knex.migrate.rollback()
//         console.log("Migrating database to latest. . . ")
//         await knex.migrate.latest()
//         console.log("Running database seeds . . . ")
//         await knex.seed.run()
//         console.log("Finished database setup.")
//       } catch (err) {
//         console.log(err)
//       }
//   })();
// }


const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json())

const keycloak = initKeycloak();
app.use(keycloak.middleware())
app.use(keycloak.protect())

app.get('/', (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.status(200).send('App root route running');
})

app.use('/api/users', users);
app.use('/api/offices', offices);


module.exports = app;

