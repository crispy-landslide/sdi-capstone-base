const express = require('express');

const env = process.env.NODE_ENV || 'development'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)

const router = express.Router();


router.post('/', (req, res) => {
  console.log(req.body)

  const newOffice = {
    name: req.body.name
  }

  knex('offices')
  .insert(newOffice, ['*'])
  .then(data => res.status(201).json(data))
})

module.exports = router;