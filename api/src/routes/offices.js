const express = require('express');

const env = process.env.NODE_ENV || 'development'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)

const router = express.Router();

//TODO: REVIEW AND REFACTOR ALL ROUTES

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name: <mandatory>
  } 
}
*/
router.post('/', (req, res) => {
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
router.post('/:office_id/events', async (req, res) =>{
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
router.post('/:office_id/events/:event_id/tasks', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  console.log(typeof(officeId))
  console.log(typeof(office_id))
  
  if(officeId != office_id){
    res.sendStatus(401).send('Event ID not found in Office')
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
    likelihood_score: <mandatory>
  } 
}
*/
router.post('/:office_id/events/:event_id/attacks', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.sendStatus(401).send('Event ID not found in Office')
  } else{

    const newAttack = {
      ...req.body,
      event_id: event_id
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
router.post('/:office_id/events/:event_id/teams', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.sendStatus(401).send('Event ID not found in Office')
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

/*
{
  Headers: Token -- only when using authentication
  Body:{
    email: <mandatory>,
    role: <mandatory>
  } 
}
*/
router.post('/:office_id/events/:event_id/teams/:team_id/add-user', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.sendStatus(401).send('Event ID not found in Office')
  } else{

    const newMember = {
      ...req.body,
      team_id: event_id
    }

    await knex('users_teams')
      .insert(newMember, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id', (req, res) =>{
  const { office_id } = req.params;

  knex.select('*').from('offices').where({id: office_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

router.get('/:office_id/users', (req, res) =>{
  const { office_id } = req.params;

  knex.select('*').from('users').where({office_id: office_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

router.get('/:office_id/users/:user_email', (req, res) =>{
  const { office_id, user_email } = req.params;

  knex.select('*').from('users').where({email: user_email, office_id: office_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

// TODO: CHECK FOR REFACTOR OF START AND END TIMES -- DOES IT NEED TO BE A RANGE RATHER THAN SPECIFIC TIMES? -- SHOULD IT BE DATE OR DATETIME?
router.get('/:office_id/events', (req, res) =>{
  const { office_id } = req.params;
  if(Object.keys(req.query).length !== 0){
    let { start, end } = req.query

    knex.select('*').from('events').where({office_id: office_id, start_date: start, end_date: end})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  } else{
    knex.select('*').from('events').where({office_id: office_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id', (req, res) =>{
  const { office_id, event_id } = req.params;

  knex.select('*').from('events').where({id: event_id, office_id: office_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

router.get('/:office_id/events/:event_id/tasks', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex.select('*').from('tasks').where({event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/teams', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex.select('*').from('teams').where({event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/teams/:team_id/users', async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  const eventId = await knex.select('event_id').from('teams').where({id: team_id})
  .then(data => data[0].event_id)
  
  if(officeId != office_id) {
    res.status(401).send('Office ID not found in event')
  } else if(eventId != event_id){
    res.status(401).send('Event ID not found in team')
  }else{
    knex.from('users').innerJoin('users_teams', 'users.email', 'users_teams.user_email').where({team_id: team_id})
    .then(users => res.status(200).send(users))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/attacks', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex.select('*').from('attacks').where({event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/attacks/:attack_id', async (req, res) =>{
  const { office_id, event_id, attack_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex.select('*').from('attacks').where({id: attack_id, event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name
  }
}
*/
router.patch('/:office_id', (req, res) =>{
  const { office_id } = req.params;

  knex('office').where({id: office_id}).update({...req.body}, ['*'])
  .then(data => res.status(201).json(data))
  .catch(() => res.sendStatus(500))
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    start_date,
    end_date,
    name,
    tags,
    description
  }
}
*/
router.patch('/:office_id/events/:event_id', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex('events').where({id: event_id}).update({...req.body}, ['*'])
    .then(data => res.status(201).json(data))
    .catch(() => res.sendStatus(500))
  }
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name,
    notes,
    is_complete
  }
}
*/
router.patch('/:office_id/events/:event_id/tasks/:task_id', async (req, res) =>{
  const { office_id, event_id, task_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex('tasks').where({task_id: task_id, event_id: event_id}).update({...req.body}, ['*'])
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
    likelihood_score: <mandatory>
  } 
}
*/
router.patch('/:office_id/events/:event_id/attacks/:attack_id', async (req, res) =>{
  const { office_id, event_id, attack_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex('attacks').where({id: attack_id, event_id: event_id}).update({...req.body}, ['*'])
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
router.patch('/:office_id/events/:event_id/teams/:team_id', async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex('teams').where({id: team_id, event_id: event_id}).update({...req.body}, ['*'])
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
router.patch('/:office_id/events/:event_id/teams/:team_id', async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    await knex('teams').where({id: team_id, event_id: event_id}).update({...req.body}, ['*'])
    .then(data => res.status(201).json(data))
    .catch(() => res.sendStatus(500))
  }
})

router.delete('/:office_id', (req, res) =>{
  const { office_id } = req.params;

  knex('offices').where({id: office_id}).update({is_deleted: true}, ['*'])
    .then(async data => {
      await knex('users').where({office_id: office_id, is_deleted: false}).update({office_id: null})
      .catch(() => res.sendStatus(500))

      return data
    })
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500))
})

router.delete('/:office_id/events/:event_id', (req, res) =>{
  const { office_id, event_id } = req.params;

  knex('events').where({id: event_id, office_id: office_id}).update({is_deleted: true}, ['*'])
    .then(async data => {
      await knex('tasks').where({event_id: event_id, is_deleted: false}).update({is_deleted: true})
      .catch(() => res.sendStatus(500))

      await knex('teams').where({event_id: event_id, is_deleted: false}).update({is_deleted: true})
      .catch(() => res.sendStatus(500))

      await knex('attacks').where({event_id: event_id, is_deleted: false}).update({is_deleted: true})
      .catch(() => res.sendStatus(500))

      return data
    })
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500))
})

router.delete('/:office_id/events/:event_id/teams/:team_id', async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    knex('teams').where({id: team_id, event_id: event_id}).update({is_deleted: true}, ['*'])
      .then(async data => {
        await knex('users_teams').where({team_id: team_id, is_deleted: false}).update({is_deleted: true})
        .catch(() => res.sendStatus(500))

        return data
      })
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})

router.delete('/:office_id/events/:event_id/tasks/:task_id', async (req, res) =>{
  const { office_id, event_id, task_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    knex('tasks').where({id: task_id, event_id: event_id}).update({is_deleted: true}, ['*'])
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})

router.delete('/:office_id/events/:event_id/attacks/:attacks_id', async (req, res) =>{
  const { office_id, event_id, attacks_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    knex('attacks').where({id: attacks_id, event_id: event_id}).update({is_deleted: true}, ['*'])
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    email: <mandatory>
  } 
}
*/
router.delete('/:office_id/events/:event_id/teams/:teams_id/remove-user', async (req, res) =>{
  const { office_id, event_id, teams_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Event ID not found in Office')
  } else{
    knex('user_teams').where({teams_id: teams_id, is_deleted: false}).update({is_deleted: true}, ['*'])
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})

module.exports = router;