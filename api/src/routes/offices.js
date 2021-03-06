const express = require('express');

const env = process.env.NODE_ENV || 'development'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)

const router = express.Router();

const checkIfAuthorized = async (req, res, next) => {
  const token = req.kauth.grant.access_token.content;
  let reqUser = await knex('users_offices').select('*').where({user_email: token.email}).then(data => data).catch(err => console.log(err))
  reqUser = reqUser.filter(user => user.office_id == req.params.office_id)
  if (!reqUser.length > 0 || !reqUser[0].is_admin) {
    return res.sendStatus(401)
  } else {
    next()
  }
}

const checkIfEditor = async (req, res, next) => {
  const token = req.kauth.grant.access_token.content;
  let reqUser = await knex('users_offices').select('*').where({user_email: token.email}).then(data => data).catch(err => console.log(err))
  reqUser = reqUser.filter(user => user.office_id == req.params.office_id)
  if (!reqUser.length > 0 || (!reqUser[0].is_editor && !reqUser[0].is_admin)) {
    return res.sendStatus(401)
  } else {
    next()
  }
}

const checkIfBelongsToOffice = async (req, res, next) => {
  const token = req.kauth.grant.access_token.content;
  let reqUser = await knex('users_offices').select('*').where({user_email: token.email}).then(data => data).catch(err => console.log(err))
  reqUser = reqUser.filter(user => user.office_id == req.params.office_id)
  if (!reqUser.length > 0) {
    return res.sendStatus(401)
  } else {
    next()
  }
}

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name: <mandatory>
  }
}
*/
router.post('/', async (req, res) => {
  const { name } = req.body;
  const token = req.kauth.grant.access_token.content;

  if(name != undefined){
    const newOffice = {
      name: name,
      is_deleted: false
    }

    const createdOffice = await knex('offices')
      .insert(newOffice, ['*'])
      .then(data => data)
      .catch(() => res.sendStatus(500))

    if(createdOffice) {
      await knex('users_offices')
        .insert({user_email: token.email, office_id: createdOffice[0].id, is_admin: true, is_editor: false, is_deleted: false}, ['*'])
        .then(() => res.status(201).json(createdOffice[0]))
        .catch(() => res.sendStatus(500))
    } else {
      res.sendStatus(500)
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
    email,
    is_admin,
    is_editor
  }
}
*/
router.post('/:office_id/add-user', checkIfAuthorized, async (req, res) =>{

  const { office_id } = req.params;
  const { email, is_admin, is_editor } = req.body;

  if(email != undefined){
    let existingUser = await knex('users').select('*').where({email: email})
    existingUser = existingUser[0]

    const newJoinRecord = {
      user_email: existingUser.email,
      office_id: office_id,
      is_admin: is_admin,
      is_editor: is_editor,
      is_deleted: false
    }

    await knex('user_offices')
    .insert(newJoinRecord, ['*'])
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
    start_date: <date time of start>
    end_date: <date time of end>
    name: <name>
    tags: <tags - optional>
    description: <description - optional>
  }
}
*/
router.post('/:office_id/events', checkIfAuthorized, async (req, res) =>{

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

    await knex('events')
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
router.post('/:office_id/events/:event_id/tasks', checkIfEditor, async (req, res) =>{


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
    name: <mandatory>,
    notes: <null if none provided>
  }
}
*/
router.post('/:office_id/events/:event_id/missions', checkIfEditor, async (req, res) =>{


  const { office_id, event_id } = req.params;
  const { name, number } = req.body;

  if (name != undefined && number != undefined ){

    const officeId = await knex.select('office_id').from('events').where({id: event_id})
      .then(data => data[0].office_id)
      .catch(err => console.log(err))

    if(officeId != office_id){
      return res.sendStatus(400).send('Provided office ID not found in event')
    } else{
      const newMission = {
        name,
        number,
        event_id: event_id,
        is_deleted: false
      }

      let dbResult = await knex('missions')
        .insert(newMission, ['*'])
        .then(data => data)
        .catch(err => {
          console.log(err)
          return "Error"
        })
      if (dbResult === "Error") {
        res.sendStatus(500)
      } else {
        res.status(201).json(dbResult)
      }
    }
  } else{
    res.status(400).send('Request body not complete. Request body should look like: \
    { \
      "name": <text - not nullable>, \
      "number": <integer - not nullable> \
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
router.post('/:office_id/events/:event_id/attacks', checkIfEditor, async (req, res) =>{

  const { office_id, event_id } = req.params;
  const { mission_id, attack, variant, description, goal, assumptions, mission_impact, mission_impact_score, likelihood, likelihood_score } = req.body;

  if(mission_id != undefined && attack != undefined && variant != undefined && description != undefined &&
    goal != undefined && assumptions != undefined && mission_impact != undefined && mission_impact_score != undefined &&
    likelihood != undefined && likelihood_score != undefined){

    const officeId = await knex.select('office_id').from('events').where({id: event_id})
    .then(data => data[0].office_id)

    if(officeId != office_id){
      res.sendStatus(400).send('Provided office ID not found in event')
    } else{

      const newAttack = {
        mission_id,
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
router.post('/:office_id/events/:event_id/teams', checkIfAuthorized, async (req, res) =>{
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
    first_name,
    last_name,
    email: <mandatory>,
    role: <mandatory>,
    is_admin,
    is_editor
  }
}
*/
router.post('/:office_id/events/:event_id/teams/:team_id/add-user', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;
  const { email, role, is_admin, is_editor, first_name, last_name } = req.body;

  if(email != undefined || role != undefined || is_admin != undefined || is_editor != undefined){

    const officeId = await knex.select('office_id').from('events').where({id: event_id})
      .then(data => data[0].office_id)
      .catch(err => console.log(err))

    if (officeId != office_id) {
      return res.sendStatus(400).send('Office ID not found in event')
    } else {
      let existingUser = await knex('users').select('*').where({email: email}).catch(err => console.log(err))
      if (existingUser.length === 0 ) {
        const newUser = {
          id: null,
          email: email,
          first_name: first_name,
          last_name: last_name,
          is_deleted: false
        }
        const joinUser = {
          user_email: email,
          office_id: office_id,
          is_admin: Boolean(is_admin),
          is_editor: Boolean(is_editor),
          is_deleted: false
        }
        let dbResult = await knex('users')
          .insert(newUser, ['*'])
          .catch((err) => {
            console.log(err)
            return "Error"
          })

        if (dbResult === 'Error') return res.sendStatus(500);

        dbResult = await knex('users_offices')
          .insert(joinUser, ['*'])
          .catch((err) => {
            console.log(err)
            return "Error"
          })

        if (dbResult === 'Error') return res.sendStatus(500);
      }

      let existingKey = await knex('users_teams').select('*').where({user_email: email, team_id: team_id}).catch(err => console.log(err))
      if (existingKey.length !== 0) {
        let dbResult = await knex('users_teams')
          .where({user_email: email, team_id: team_id})
          .update({is_deleted: false}, ['*'])
          .catch((err) => {
            console.log(err)
            return "Error"
          })

        if (dbResult === "Error") return res.sendStatus(500);

        dbResult = await knex('users_offices')
          .where({user_email: email, office_id: office_id})
          .update({role: role, is_admin: is_admin, is_editor: is_editor, is_deleted: false}, ['*'])
          .then(data => data)
          .catch((err) => {
            console.log(err)
            return "Error"
          })

        if (dbResult === "Error") {
          return res.sendStatus(500)
        } else {
          res.status(201).json(dbResult)
        }

      } else{
        const newMember = {
          user_email: email,
          role: role,
          is_deleted: false,
          team_id: team_id
        }

        let dbResult = await knex('users_teams')
          .insert(newMember, ['*'])
          .then(data => data)
          .catch((err) => {
            console.log(err)
            return "Error"
          })

        if (dbResult === "Error") return res.sendStatus(500)

        dbResult = await knex('users_offices')
          .update({role: role, is_admin: is_admin, is_editor: is_editor, is_deleted: false}, ['*'])
          .then(data => data)
          .catch((err) => {
            console.log(err)
            return "Error"
          })

        if (dbResult === "Error") {
          return res.sendStatus(500)
        } else {
          res.status(201).json(dbResult)
        }
      }
    }
  } else{
    return res.status(400).send('Request body not complete. Request body should look like: \
    { \
      "email": <text - not nullable>, \
      "role": <text - not nullable> \
      "is_admin": <boolean - not nullable> \
      "is_editor": <boolean - not nullable> \
    }')
  }
})

router.get('/:office_id', checkIfBelongsToOffice, (req, res) =>{
  const { office_id } = req.params;

  knex.select('*').from('offices').where({id: office_id})
  .then(data => res.status(200).send(data))
  .catch(() => res.sendStatus(500))
})

router.get('/:office_id/events', checkIfBelongsToOffice, (req, res) =>{
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

router.get('/:office_id/events/:event_id', checkIfBelongsToOffice, async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Provided office ID not found in event')
  } else{
    await knex.select('*').from('events').where({id: event_id, office_id: office_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/tasks', checkIfBelongsToOffice, async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Provided office ID not found in event')
  } else{
    await knex.select('*').from('tasks').where({event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/missions', checkIfBelongsToOffice, async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Provided office ID not found in event')
  } else{
    await knex.select('*').from('missions').where({event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/teams', checkIfBelongsToOffice, async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Provided office ID not found in event')
  } else{
    await knex.select('*').from('teams').where({event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/teams/:team_id', checkIfBelongsToOffice, async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  const eventId = await knex.select('event_id').from('teams').where({id: team_id})
  .then(data => data[0].event_id)

  if(officeId != office_id){
    res.status(400).send('Provided office ID not found in event')
  } else if(eventId != event_id){
    res.status(400).send('Provided event ID not found in team')
  } else{
    await knex.select('*').from('teams').where({team_id: team_id, event_id: event_id})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/teams/:team_id/users', checkIfBelongsToOffice, async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  const eventId = await knex.select('event_id').from('teams').where({id: team_id})
  .then(data => data[0].event_id)

  if(officeId != office_id) {
    res.status(400).send('Office ID not found in event')
  } else if(eventId != event_id){
    res.status(400).send('Event ID not found in team')
  } else{
    let usersInfo = await knex.from('users').innerJoin('users_offices', 'users.email', 'users_offices.user_email').where({office_id: office_id})
      .catch(err => {
        console.log(err)
        res.sendStatus(500)
      })
    let usersTeams = await knex.from('users_teams').select('*').where({team_id: team_id})
      .catch(err => {
        console.log(err)
        res.sendStatus(500)
      })

    usersTeams = usersTeams.map(user => {
      let matchingUserInfo = usersInfo.filter(info => info.email === user.user_email)[0]
      return {...matchingUserInfo, is_deleted: user.is_deleted, role: user.role, team_id: user.team_id}
    })

    if (usersTeams) {
      res.status(200).send(usersTeams)
    }
  }
})

router.get('/:office_id/events/:event_id/attacks', checkIfBelongsToOffice, async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    await knex.select('*').from('attacks').where({event_id: event_id, is_deleted: false})
    .then(data => res.status(200).send(data))
    .catch(() => res.sendStatus(500))
  }
})

router.get('/:office_id/events/:event_id/attacks/:attack_id', checkIfBelongsToOffice, async (req, res) =>{
  const { office_id, event_id, attack_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  const eventId = await knex.select('event_id').from('attacks').where({id: attack_id})
  .then(data => data[0].event_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else if(eventId != event_id){
    res.status(400).send('Event ID not found in attack')
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
router.patch('/:office_id', checkIfAuthorized, (req, res) =>{
  const { office_id } = req.params;

  if(Object.keys(req.body).length !== 0){
    knex('office').where({id: office_id}).update({...req.body}, ['*'])
    .then(data => res.status(201).json(data))
    .catch(() => res.sendStatus(500))
  } else{
    res.status(400).send('Request body not complete. Request body should include one or more of the following: \
    { \
      "name": <text - not nullable>, \
      "is_deleted": <boolean - not nullable> \
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
router.patch('/:office_id/events/:event_id', checkIfEditor, async (req, res) =>{
  const { office_id, event_id } = req.params;
  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    if(Object.keys(req.body).length !== 0){
      await knex('events').where({id: event_id}).update({...req.body}, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
    } else{
      res.status(400).send('Request body not complete. Request body should include one or more of the following: \
      { \
        "start_date": <dateTime - not nullable>, \
        "end_date": <dateTime - not nullable>, \
        "name": <text - not nullable>, \
        "tags": <text - nullable>, \
        "description": <text - nullable>, \
        "is_deleted": <boolean - not nullable> \
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
router.patch('/:office_id/events/:event_id/tasks/:task_id', checkIfEditor, async (req, res) =>{
  const { office_id, event_id, task_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    if(Object.keys(req.body).length !== 0){
      await knex('tasks').where({id: task_id, event_id: event_id}).update({...req.body}, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
    } else{
      res.status(400).send('Request body not complete. Request body should include one or more of the following: \
      { \
        "name": <text - not nullable>, \
        "notes": <text - not nullable>, \
        "is_complete": <boolean - not nullable>, \
        "is_deleted": <boolean - not nullable> \
      }')
    }
  }
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    name,
    number,
    is_deleted
  }
}
*/
router.patch('/:office_id/events/:event_id/missions/:mission_id', checkIfEditor, async (req, res) =>{
  const { office_id, event_id, mission_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
    .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    if(Object.keys(req.body).length !== 0){
      await knex('missions').where({id: mission_id, event_id: event_id}).update({...req.body}, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
    } else{
      res.status(400).send('Request body not complete. Request body should include one or more of the following: \
      { \
        "name": <text - not nullable>, \
        "notes": <text - not nullable>, \
        "is_complete": <boolean - not nullable>, \
        "is_deleted": <boolean - not nullable> \
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
router.patch('/:office_id/events/:event_id/attacks/:attack_id', checkIfEditor, async (req, res) =>{
  const { office_id, event_id, attack_id } = req.params;
  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    if(Object.keys(req.body).length !== 0){
      await knex('attacks').where({id: attack_id, event_id: event_id}).update({...req.body}, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
    } else{
      res.status(400).send('Request body not complete. Request body should include one or more of the following: \
      { \
        "mission_id": <integer - not nullable>, \
        "attack": <integer - not nullable>, \
        "variant": <integer - not nullable>, \
        "description": <text - not nullable>, \
        "goal": <text - not nullable>, \
        "assumptions": <text - not nullable>, \
        "mission_impact": <text - not nullable>, \
        "mission_impact_score": <integer - not nullable>, \
        "likelihood": <text - not nullable>, \
        "likelihood_score": <integer - not nullable>, \
        "is_deleted": <boolean - not nullable> \
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
router.patch('/:office_id/events/:event_id/teams/:team_id', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    if(Object.keys(req.body).length !== 0){
      await knex('teams').where({id: team_id, event_id: event_id}).update({...req.body}, ['*'])
      .then(data => res.status(201).json(data))
      .catch(() => res.sendStatus(500))
    } else{
      res.status(400).send('Request body not complete. Request body should include one or more of the following: \
      { \
        "name": <text - not nullable>, \
        "is_deleted": <boolean - not nullable> \
      }')
    }
  }
})

/*
{
  Headers: Token -- only when using authentication
  Body:{
    email,
    role: <mandatory>,
    is_admin,
    is_editor
  }
}
*/
router.patch('/:office_id/events/:event_id/teams/:team_id/edit-user', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;
  const { email, role, is_admin, is_editor } = req.body;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    if(Object.keys(req.body).length !== 0){
      await knex('users_offices').where({user_email: email, office_id: office_id}).update({is_admin: is_admin, is_editor: is_editor})
        .catch(() => res.sendStatus(500))
      await knex('users_teams').where({user_email: email, team_id: team_id}).update({role: role}, ['*'])
        .then(data => res.status(201).json(data))
        .catch(() => res.sendStatus(500))
    } else{
      res.status(400).send('Request body not complete. Request body should include one or more of the following: \
      { \
        email: <text - not nullable>, \
        role: <text - not nullable>, \
        is_admin: <boolean - not nullable>, \
        is_editor <boolean - not nullable>\
      }')
    }
  }
})

router.delete('/:office_id', checkIfAuthorized, (req, res) =>{
  const { office_id } = req.params;

  knex('offices').where({id: office_id}).update({is_deleted: true}, ['*'])
    .then(async data => {
      await knex('users_offices').where({office_id: office_id, is_deleted: false}).update({is_deleted: true})
      .catch(() => res.sendStatus(500))

      const eventIds = await knex('events').where({office_id: office_id, is_deleted: false}).update({is_deleted: true}, ['id'])
      .catch(() => res.sendStatus(500))

      const teamIds = await eventIds.forEach(async eventId => {
        await knex('tasks').where({event_id: eventId, is_deleted: false}).update({is_deleted: true})
        await knex('attacks').where({event_id: eventId, is_deleted: false}).update({is_deleted: true})
        await knex('missions').where({event_id: eventId, is_deleted: false}).update({is_deleted: true})
        return await knex('teams').where({event_id: eventId, is_deleted: false}).update({is_deleted: true}, ['id'])
      })

      await teamIds.forEach(async teamId => {
        await knex('users_teams').where({team_id: teamId, is_deleted: false}).update({is_deleted: true})
      })

      return data
    })
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500))
})

router.delete('/:office_id/events/:event_id', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)


  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    knex('events').where({id: event_id, office_id: office_id}).update({is_deleted: true}, ['*'])
      .then(async data => {
        await knex('tasks').where({event_id: event_id, is_deleted: false}).update({is_deleted: true})
        .catch(() => res.sendStatus(500))

        const teamIds = await knex('teams').where({event_id: event_id, is_deleted: false}).update({is_deleted: true}, ['id'])
        .catch(() => res.sendStatus(500))

        await teamIds.forEach(async teamId => {
          await knex('users_teams').where({team_id: teamId.id, is_deleted: false}).update({is_deleted: true})
        })

        await knex('attacks').where({event_id: event_id, is_deleted: false}).update({is_deleted: true})
        .catch(() => res.sendStatus(500))

        return data
      })
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})

router.delete('/:office_id/events/:event_id/teams', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    knex('teams').where({event_id: event_id}).update({is_deleted: true}, ['*'])
      .then(async data => {

        await data.forEach(async team =>{
          await knex('users_teams').where({team_id: team.id, is_deleted: false}).update({is_deleted: true})
          .catch(() => res.sendStatus(500))
        })

        return data
      })
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})

router.delete('/:office_id/events/:event_id/teams/:team_id', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
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

router.delete('/:office_id/events/:event_id/tasks', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    knex('tasks').where({event_id: event_id, is_deleted: false}).update({is_deleted: true}, ['*'])
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})

router.delete('/:office_id/events/:event_id/tasks/:task_id', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id, task_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    knex('tasks').where({id: task_id, event_id: event_id, is_deleted: false}).update({is_deleted: true}, ['*'])
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})

router.delete('/:office_id/events/:event_id/missions/', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    knex('missions').where({event_id: event_id, is_deleted: false}).update({is_deleted: true}, ['*'])
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})

router.delete('/:office_id/events/:event_id/missions/:mission_id', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id, mission_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    knex('missions').where({id: mission_id, event_id: event_id}).update({is_deleted: true}, ['*'])
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})


router.delete('/:office_id/events/:event_id/attacks/', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
  } else{
    knex('attacks').where({event_id: event_id, is_deleted: false}).update({is_deleted: true}, ['*'])
      .then(data => res.status(200).json(data))
      .catch(() => res.sendStatus(500))
  }
})

router.delete('/:office_id/events/:event_id/attacks/:attacks_id', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id, attacks_id } = req.params;

  const officeId = await knex.select('office_id').from('events').where({id: event_id})
  .then(data => data[0].office_id)

  if(officeId != office_id){
    res.status(400).send('Office ID not found in event')
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
router.delete('/:office_id/events/:event_id/teams/:team_id/remove-user', checkIfAuthorized, async (req, res) =>{
  const { office_id, event_id, team_id } = req.params;
  const { email } = req.body;

  if(email != undefined){
    const officeId = await knex.select('office_id').from('events').where({id: event_id})
    .then(data => data[0].office_id)

    if(officeId != office_id){
      res.status(400).send('Office ID not found in event')
    } else{
      knex('users_teams').where({user_email: email, team_id: team_id, is_deleted: false}).update({is_deleted: true}, ['*'])
        .then(data => res.status(200).json(data))
        .catch(() => res.sendStatus(500))
    }
  } else{
    res.status(400).send('Request body not complete. Request body should look like: \
    { \
      "email": <text - not nullable> \
    }')
  }
})

module.exports = router;