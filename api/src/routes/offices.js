const express = require('express');

const env = process.env.NODE_ENV || 'development'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)

const router = express.Router();

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name: <mandatory>
  } 
}
*/
router.post('/', (req, res) => {
  console.log(req.body)

  const newOffice = {
    ...req.body
  }

  knex('offices')
  .insert(newOffice, ['*'])
  .then(data => res.status(201).json(data))
  .catch(() => res.sendStatus(500))
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    start_date: <date time of start>
    end_date: <date time of end>
    name: <name>
    tags: <tags - optional>
    description: <description - optional>
  }
}
*/
router.post(':office_id/events', async (req, res) =>{
  const { office_id } = req.params;

  const newEvent = {
    ...req.body,
    office_id: office_id,
    report_path: null
  }

  knex('events')
  .insert(newEvent, ['*'])
  .then(data => res.status(201).json(data))
  .catch(() => res.sendStatus(500)) 
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name: <mandatory>,
    notes: <null if none provided>,
    is_complete: <mandatory, boolean>
  } 
}
*/
router.post(':office_id/events/:event_id/tasks', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId !== office_id){
    res.sendStatus(401)
  } else{
    const newTask = {
      ...req.body,
      event_id: event_id
    }

    await knex('tasks')
      .insert(newTask, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
  }
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    mission: <mandatory>,
    attack: <mandatory>,
    variant: <mandatory>,
    description: <mandatory>,
    goal: <mandatory>,
    assumptions: <mandatory>,
    mission_impact: <mandatory>,
    mission_impact_score: <mandatory>,
    likelihood: <mandatory>,
    likelihood_score: <mandatory>,
    event_id: <mandatory>
  } 
}
*/
router.post(':office_id/events/:event_id/attacks', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId !== office_id){
    res.sendStatus(401)
  } else{

    const newAttack = {
      ...req.body
    }

    await knex('attacks')
      .insert(newAttack, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
  }
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name: <mandatory>,
  } 
}
*/
router.post(':office_id/events/:event_id/teams', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId !== office_id){
    res.sendStatus(401)
  } else{

    const newTeam = {
      ...req.body,
      event_id: event_id
    }

    await knex('teams')
      .insert(newTeam, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id', (req, res) =>{
  const { office_id } = req.params;

  knex.select('*').from('office').where({id: office_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

router.get('/offices/:office_id/users', (req, res) =>{
  const { office_id } = req.params;

  knex.select('*').from('users').where({office_id: office_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

router.get('/offices/:office_id/users/:user_email', (req, res) =>{
  const { office_id, user_email } = req.params;

  knex.select('*').from('users').where({user_email: user_email, office_id: office_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

router.get('/offices/:office_id/events', (req, res) =>{
  const { office_id } = req.params;

  knex.select('*').from('events').where({office_id: office_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

// TODO: CHECK FOR REFACTOR OF START AND END TIMES
router.get('/offices/:office_id/events', (req, res) =>{
  const { office_id } = req.params;
  if(Object.keys(req.query).length !== 0){
    let { start_time, end_time } = req.query

    knex.select('*').from('events').where({office_id: office_id, start_time: start_time, end_time: end_time})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  } else{
    knex.select('*').from('events').where({office_id: office_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/offices/:office_id/events/:event_id', (req, res) =>{
  const { office_id, event_id } = req.params;

  knex.select('*').from('events').where({id: event_id, office_id: office_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

router.get('/offices/:office_id/events/:event_id/tasks', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId !== office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex.select('*').from('tasks').where({event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/offices/:office_id/events/:event_id/teams', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId !== office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex.select('*').from('teams').where({event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/offices/:office_id/events/:event_id/users', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId !== office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex.select('*').from('teams').where({id: event_id})
    .then(teamsData => teamsData.map(team => team.id))
    .then(teamIds => teamIds.map(teamId => knex.select('user_email').from('users_teams').where({team_id: teamId})))
    .then(userEmails => res.status(200).send(userEmails.map(userEmail => knex.select('*').from('users').where({email: userEmail}))))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/offices/:office_id/events/:event_id/attacks', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId !== office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex.select('*').from('attacks').where({event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/offices/:office_id/events/:event_id/attacks/:attack_id', async (req, res) =>{
  const { office_id, event_id, attack_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId !== office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex.select('*').from('attacks').where({id: attack_id, event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

module.exports = router;