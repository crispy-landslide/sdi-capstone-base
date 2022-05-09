const express = require('express');

const env = process.env.NODE_ENV || 'development'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)

const router = express.Router();

/*
{
  Headers: Token
  Body:{
  }

}
*/
router.post('/', (req, res) => {
  const token = req.kauth.grant.access_token.content;

  const newUser = {
    id: token.sub,
    email: token.email,
    first_name: token.given_name,
    last_name: token.family_name,
    is_admin: false,
    is_editor: false,
    office_id: null,
    is_deleted: false
  }

  knex('users')
  .insert(newUser, ['*'])
  .then(data => res.status(201).json(data))
  .catch(() => res.sendStatus(500))
});

// TODO: CHANGE USER EMAIL TO ID OF TOKEN
// TODO: CREATE GET ROUTE FOR /my-account
router.get('/:user_id', (req, res) =>{
  const { user_id } = req.params;

  knex.select('*').from('users').where({id: user_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

router.get('/my-account', (req, res) =>{
  const token = req.kauth.grant.access_token.content;

  knex.select('*').from('users').where({id: token.sub})
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