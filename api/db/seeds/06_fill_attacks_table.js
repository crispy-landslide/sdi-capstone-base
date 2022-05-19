const { faker } = require('@faker-js/faker');
const { getRandomNumber, getRandomBool } = require('../../utils/seedUtils.js');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.seed = async function(knex) {

  const generateAttacks = async () =>{
    const attackList = [];
    let events = await knex('events').select('id').catch(err => console.log(err))

    for(let i = 0; i < 5000; i++){
      let event = events[Math.floor(Math.random() * events.length)]
      let missions = await knex('missions').select('*').where({event_id: event.id}).catch(err => console.log(err))

      attackList.push({
        mission_id: missions[Math.floor(Math.random() * missions.length)].id,
        attack: i,
        variant: i,
        description: faker.lorem.sentences(),
        goal: faker.lorem.sentences(),
        assumptions: faker.lorem.sentences(),
        mission_impact: faker.lorem.sentences(),
        mission_impact_score: getRandomNumber(1, 6),
        likelihood: faker.lorem.word(),
        likelihood_score: getRandomNumber(1, 6),
        event_id: event.id,
        is_deleted: getRandomBool()
      });
    }

    return attackList;
  }

  await knex('attacks').select('*')
  .then(async (rows) => {
    if (rows.length === 0) {
      return knex('attacks').insert(await generateAttacks());
    }
  })
};
