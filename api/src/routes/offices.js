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
  const { name } = req.body;

  if(name != undefined){
    const newOffice = {
      name: name,
      is_deleted: false
    }

    knex('offices')
    .insert(newOffice, ['*'])
    .then(data => res.status(201).json(data))
    .catch(() => res.sendStatus(500))
  } else{
    res.status(400).send('Request body not complete. Request body should look like: \
    { \
      "name": <text - not nullable> \
    }')
  }
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
  const { start_date, end_date, name, tags, description } = req.body;

  if(start_date != undefined && end_date != undefined && name != undefined && tags != undefined && description != undefined){
    const newEvent = {
      start_date,
      end_date,
      name,
      tags,
      description,
      office_id: office_id,
      report_path: null,
      is_deleted: false
    }

    knex('events')
    .insert(newEvent, ['*'])
    .then(data => res.status(201).json(data))
    .catch(() => res.sendStatus(500))
  } else{
    res.status(400).send('Request body not complete. Request body should look like: \
    { \
      "start_date": <dateTime of start - not nullable>, \
      "end_date": <dateTime of end - not nullable>, \
      "name": <text - not nullable>, \
      "tags": <text - nullable>, \
      "description": <text - nullable> \
    }')
  }
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name: <mandatory>,
    notes: <null if none provided>
  } 
}
*/
router.post('/:office_id/events/:event_id/tasks', async (req, res) =>{
  const { office_id, event_id } = req.params;
  const { name, notes } = req.body;

  if(name != undefined && notes != undefined ){

    const officeId = await knex.select('office_id').from('events').where({id: event_id})
    .then(data => data[0].office_id)
    
    if(officeId != office_id){
      res.sendStatus(400).send('Provided office ID not found in event')
    } else{
      const newTask = {
        name,
        notes,
        is_complete: false,
        is_deleted: false,
        event_id: event_id
      }

      await knex('tasks')
        .insert(newTask, ['*'])
        .then(data => res.status(201).json(data))
        .catch(() => res.sendStatus(500))
    }
  } else{
    res.status(400).send('Request body not complete. Request body should look like: \
    { \
      "name": <text - not nullable>, \
      "notes": <text - nullable> \
    }')
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
  const { mission, attack, variant, description, goal, assumptions, mission_impact, mission_impact_score, likelihood, likelihood_score } = req.body;

  if(mission != undefined && attack != undefined && variant != undefined && description != undefined && 
    goal != undefined && assumptions != undefined && mission_impact != undefined && mission_impact_score != undefined && 
    likelihood != undefined && likelihood_score != undefined){

    const officeId = await knex.select('office_id').from('events').where({id: event_id})
    .then(data => data[0].office_id)
    
    if(officeId != office_id){
      res.sendStatus(400).send('Provided office ID not found in event')
    } else{

      const newAttack = {
        mission,
        attack,
        variant,
        description,
        goal,
        assumptions,
        mission_impact,
        mission_impact_score,
        likelihood,
        likelihood_score, 
        is_deleted: false,
        event_id: event_id
      }

      await knex('attacks')
        .insert(newAttack, ['*'])
        .then(data => res.status(201).json(data))
        .catch(() => res.sendStatus(500))
    }
  } else{
    res.status(400).send('Request body not complete. Request body should look like: \
    { \
      "mission": <integer - not nullable>, \
      "attack": <integer - not nullable>, \
      "variant": <integer - not nullable>, \
      "description": <text - not nullable>, \
      "goal": <text - not nullable>, \
      "assumptions": <text - not nullable>, \
      "mission_impact": <text - not nullable>, \
      "mission_impact_score": <integer - not nullable>, \
      "likelihood": <text - not nullable>, \
      "likelihood_score": <integer - not nullable> \
    }')
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
  const { name } = req.body;

  if(name != undefined){

    const officeId = await knex.select('office_id').from('events').where({id: event_id})
    .then(data => data[0].office_id)
    
    if(officeId != office_id){
      res.sendStatus(400).send('Provided office ID not found in event')
    } else{

      const newTeam = {
        name,
        is_deleted: false,
        event_id: event_id
      }

      await knex('teams')
        .insert(newTeam, ['*'])
        .then(data => res.status(201).json(data))
        .catch(() => res.sendStatus(500))
    }
  } else{
    res.status(400).send('Request body not complete. Request body should look like: \
    { \
      "name": <text - not nullable> \
    }')
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
  const { email, role } = req.body;

  if(email != undefined && role != undefined){

    const officeId = await knex.select('office_id').from('events').where({id: event_id})
    .then(data => data[0].office_id)
    
    if(officeId != office_id){
      res.sendStatus(400).send('Event ID not found in Office')
    } else{

      const newMember = {
        email,
        role,
        is_deleted: false,
        team_id: event_id
      }

      await knex('users_teams')
        .insert(newMember, ['*'])
        .then(data => res.status(201).json(data))
        .catch(() => res.sendStatus(500))
    }
  } else{
    res.status(400).send('Request body not complete. Request body should look like: \
    { \
      "email": <text - not nullable>, \
      "role": <text - not nullable> \
    }')
  }
})

// TODO: CHECK IF USER IS PART OF THE REQUESTED OFFICE -- AFTER AUTH IMPLEMENTED
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

//TODO: POSSIBLY DELETE DUE TO USERS SUBROUTE
// router.get('/:office_id/users/:user_email', (req, res) =>{
//   const { office_id, user_email } = req.params;

//   knex.select('*').from('users').where({email: user_email, office_id: office_id})
//   .then(data => res.status(200).send(data))
//   .catch(() => res.sendStatus(500))
// })

// TODO: CHECK FOR REFACTOR OF START AND END TIMES -- DOES IT NEED TO BE A RANGE RATHER THAN SPECIFIC TIMES? -- SHOULD IT BE DATE OR DATETIME?
router.get('/:office_id/events', (req, res) =>{
  const { office_id } = req.params;

  if(Object.keys(req.query).length !== 0){
    let { start, end } = req.query

    if(start !== undefined && end === undefined){
      knex.select('*').from('events').where({office_id: office_id, start_date: start})
      .then(data => res.status(200).send(data))
      .catch(() => res.sendStatus(500))
    } else if(start === undefined && end !== undefined){
      knex.select('*').from('events').where({office_id: office_id, end_date: end})
      .then(data => res.status(200).send(data))
      .catch(() => res.sendStatus(500))
    } else{
      knex.select('*').from('events').where({office_id: office_id, start_date: start, end_date: end})
      .then(data => res.status(200).send(data))
      .catch(() => res.sendStatus(500))
    }
  } else{
    knex.select('*').from('events').where({office_id: office_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

// TODO: CHECK IF USER IS PART OF THE REQUESTED OFFICE -- AFTER AUTH IMPLEMENTED
router.get('/:office_id/events/:event_id', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(401).send('Provided office ID not found in event')
  } else{
    await knex.select('*').from('events').where({id: event_id, office_id: office_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/tasks', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Provided office ID not found in event')
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
    res.status(401).send('Provided office ID not found in event')
  } else{
    await knex.select('*').from('teams').where({event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/teams/:team_id', async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  const eventId = await knex.select('event_id').from('teams').where({id: team_id})
  .then(data => data[0].event_id)
  
  if(officeId != office_id){
    res.status(401).send('Provided office ID not found in event')
  } else if(eventId != event_id){
    res.status(401).send('Provided event ID not found in team')
  } else{
    await knex.select('*').from('teams').where({team_id: team_id, event_id: event_id})
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
  } else{
    await knex.from('users').innerJoin('users_teams', 'users.email', 'users_teams.user_email').where({team_id: team_id, is_deleted: false})
    .then(users => res.status(200).send(users))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/attacks', async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)
  
  if(officeId != office_id){
    res.status(401).send('Office ID not found in event')
  } else{
    await knex.select('*').from('attacks').where({event_id: event_id, is_deleted: false})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/attacks/:attack_id', async (req, res) =>{
  const { office_id, event_id, attack_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  const eventId = await knex.select('event_id').from('attacks').where({id: attack_id})
  .then(data => data[0].event_id)
  
  if(officeId != office_id){
    res.status(401).send('Office ID not found in event')
  } else if(eventId != event_id){
    res.status(401).send('Event ID not found in attack')
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
    is_deleted
  }
}
*/
router.patch('/:office_id', (req, res) =>{
  const { office_id } = req.params;

  if(Object.keys(req.body).length !== 0){
    knex('office').where({id: office_id}).update({...req.body}, ['*'])
    .then(data => res.status(201).json(data))
    .catch(() => res.sendStatus(500))
  } else{
    res.status(400).send('Request body not complete. Request body should include one or more of the following: \
    { \
      "name": <text>, \
      "is_deleted": <boolean> \
    }')
  }
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
    is_deleted
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
    if(Object.keys(req.body).length !== 0){
      await knex('events').where({id: event_id}).update({...req.body}, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
    } else{
      res.status(400).send('Request body not complete. Request body should include one or more of the following: \
      { \
        "start_date": <dateTime>, \
        "end_date": <dateTime>, \
        "name": <text>, \
        "tags": <text>, \
        "description": <text>, \
        "is_deleted": <boolean> \
      }')
    }
  }
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name,
    notes,
    is_complete,
    is_deleted
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
    if(Object.keys(req.body).length !== 0){
      await knex('tasks').where({task_id: task_id, event_id: event_id}).update({...req.body}, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
    } else{
      res.status(400).send('Request body not complete. Request body should include one or more of the following: \
      { \
        "name": <text>, \
        "notes": <text>, \
        "is_complete": <boolean>, \
        "is_deleted": <boolean> \
      }')
    }
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
    is_deleted
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
    if(Object.keys(req.body).length !== 0){
      await knex('attacks').where({id: attack_id, event_id: event_id}).update({...req.body}, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
    } else{
      res.status(400).send('Request body not complete. Request body should include one or more of the following: \
      { \
        "mission": <integer>, \
        "attack": <integer>, \
        "variant": <integer>, \
        "description": <text>, \
        "goal": <text>, \
        "assumptions": <text>, \
        "mission_impact": <text>, \
        "mission_impact_score": <integer>, \
        "likelihood": <text>, \
        "likelihood_score": <integer>, \
        "is_deleted": <boolean> \
      }')
    }
  }
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name: <mandatory>,
    is_deleted
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
    if(Object.keys(req.body).length !== 0){
      await knex('teams').where({id: team_id, event_id: event_id}).update({...req.body}, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
    } else{
      res.status(400).send('Request body not complete. Request body should include one or more of the following: \
      { \
        "name": <text>, \
        "is_deleted": <boolean> \
      }')
    }
  }
})

router.delete('/:office_id', (req, res) =>{
  const { office_id } = req.params;

  knex('offices').where({id: office_id}).update({is_deleted: true}, ['*'])
    .then(async data => {
      await knex('users').where({office_id: office_id, is_deleted: false}).update({office_id: null})
      .catch(() => res.sendStatus(500))

      const eventIds = await knex('events').where({office_id: office_id, is_deleted: false}).update({is_deleted: true}, ['id'])
      .catch(() => res.sendStatus(500))

      const teamIds = await eventIds.forEach(async eventId => {
        await knex('tasks').where({event_id: eventId, is_deleted: false}).update({is_deleted: true})
        return await knex('teams').where({event_id: eventId, is_deleted: false}).update({is_deleted: true}, ['*'])
      })

      await teamIds.forEach(async teamId => {
        await knex('users_teams').where({team_id: teamId, is_deleted: false}).update({is_deleted: true})
      })

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