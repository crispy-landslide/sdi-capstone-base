
const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  const generateMissions = async () =>{
    const missionList = [];
    let events = await knex('events').select('id').catch(err => console.log(err))
    for (let i = 0; i < events.length; i++) {
      for(let j = 1; j <= 6; j++) {
        missionList.push({
          name: faker.lorem.word(),
          number: j,
          is_deleted: Math.floor(Math.random() * (1 + 1)),
          event_id: events[i].id
        })
      }
    }
    return missionList
  }

  await knex('missions').select('*')
  .then(async (rows) => {
    if (rows.length === 0) {
      return knex('missions').insert(await generateMissions());
    }
  })
};
