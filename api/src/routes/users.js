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
    .catch(() => res.sendStatus(500))
});

// TODO: CHANGE USER EMAIL TO ID OF TOKEN
// TODO: CREATE GET ROUTE FOR /my-account
router.get('/:user_email', (req, res) =>{
  const { user_email } = req.params;

  knex.select('*').from('users').where({email: user_email})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

module.exports = router;