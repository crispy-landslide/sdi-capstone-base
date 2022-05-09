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
  const { email } = req.body;

  if(email != undefined){
    const newUser = {
      email: email,
      first_name: null,
      last_name: null,
      is_admin: false,
      is_editor: false,
      office_id: null,
      is_deleted: false
    }
  
    knex('users')
    .insert(newUser, ['*'])
    .then(data => res.status(201).json(data))
    .catch(() => res.sendStatus(500))
  } else{
    res.status(400).send('Email not provided in request body. Request body should look like: { "email": <text - non nullable> }')
  }
});

// TODO: CHANGE USER EMAIL TO ID OF TOKEN
// TODO: CREATE GET ROUTE FOR /my-account
router.get('/:user_email', (req, res) =>{
  const { user_email } = req.params;

  knex.select('*').from('users').where({email: user_email})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    email: <user email>
    first_name,
    last_name,
    is_admin,
    is_editor,
    office_id
  }
}
*/
router.patch('/:user_email', (req, res) =>{
  const { user_email } = req.params;
  if(Object.keys(req.body).length !== 0){
    knex('users').where({email: user_email}).update({...req.body}, ['*'])
    .then(data => res.status(201).json(data))
    .catch(() => res.sendStatus(500))
  } else{
    res.status(400).send('Request body not complete. Request body should include one or more of the following: \
    { \
      "email": <text>, \
      "first_name": <text>, \
      "last_name": <text>, \
      "is_admin": <boolean>, \
      "is_editor": <boolean>, \
      "office_id": <integer>, \
      "is_deleted": <boolean> \
    }')
  }
})

router.delete('/:user_email', (req, res) =>{
  const { user_email } = req.params;

  knex('users').where({email: user_email}).update({is_deleted: true}, ['*'])
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500))
})

module.exports = router;