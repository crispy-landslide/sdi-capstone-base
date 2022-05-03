const express = require('express');

const env = process.env.NODE_ENV || 'development'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)

const router = express.Router();

/*
{
  Headers: Token -- only when using authentication
  Body:{
    start_date: <date time of start>
    end_date: <date time of end>
    name: <name>
    office_id: <office_id>
    tags: <tags - optional>
    description: <description - optional>
  }
  
}
*/

router.post('/', (req, res) => {
  console.log(req.body)

  const newEvent = {
    ...req.body,
    report_path: null
  }

  knex('events')
    .insert(newEvent, ['*'])
    .then(data => res.status(201).json(data))

})

module.exports = router;