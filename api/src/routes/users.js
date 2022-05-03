const express = require('express');

const env = process.env.NODE_ENV || 'development'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)

const router = express.Router();

/*
{
  Headers: Token -- only when using authentication
  Body:{
    email: <user email>
  }
  
}
*/

router.post('/', (req, res) => {
    console.log(req.body)

    const newUser = {
      email: req.body.email,
      first_name: null,
      last_name: null,
      is_admin: false,
      is_editor: false,
      office_id: null
    }

    knex('users')
    .insert(newUser, ['*'])
    .then(data => res.status(201).json(data))
});

module.exports = router;