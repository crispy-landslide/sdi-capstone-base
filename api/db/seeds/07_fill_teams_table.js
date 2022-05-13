const { faker } = require('@faker-js/faker');
const { getRandomNumber, getRandomBool } = require('../../utils/seedUtils.js');

const generateTeams = () =>{
  const teamsList = [];
  for(let i = 0; i < 300; i++){
    teamsList.push({
      name: faker.lorem.word(),
      event_id: getRandomNumber(1, 25),
      is_deleted: getRandomBool()
    });
  }

  return teamsList;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.seed = async function(knex) {
  await knex('teams').select('*')
  .then((rows) => {
    if (rows.length === 0) {
      return knex('teams').insert(generateTeams());
    }
  })
};
