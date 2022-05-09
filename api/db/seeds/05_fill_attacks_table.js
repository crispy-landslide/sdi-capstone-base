const { faker } = require('@faker-js/faker');
const { getRandomNumber, getRandomBool } = require('../../utils/seedUtils.js');

// TODO: FIX SEEDING
// TODO: TEST EXISTING ROUTES, CREATE THE OTHER ONES
const generateAttacks = () =>{
  const attackList = [];
  for(let i = 0; i < 5000; i++){
    attackList.push({
      mission: getRandomNumber(1, 11), 
      attack: getRandomNumber(1, 11), 
      variant: getRandomNumber(1, 11), 
      description: faker.lorem.sentences(), 
      goal: faker.lorem.sentences(), 
      assumptions: faker.lorem.sentences(), 
      mission_impact: faker.lorem.sentences(), 
      mission_impact_score: getRandomNumber(1, 11), 
      likelihood: faker.lorem.word(), 
      likelihood_score: getRandomNumber(1, 11), 
      event_id: getRandomNumber(1, 1001),
      is_deleted: getRandomBool()
    });
  }

  return attackList;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
  await knex('attacks').select('*')
  .then((rows) => {
    if (rows.length === 0) {
      return knex('attacks').insert(generateAttacks());
    }
  })
};
