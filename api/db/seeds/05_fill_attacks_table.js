const { faker } = require('@faker-js/faker');
const { getRandomNumber } = require('../../utils/seedUtils.js');

const generateAttacks = () =>{
  const attackList = [];
  for(let i = 0; i < 9000; i++){
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
      event_id: getRandomNumber(1, 3001)
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
