const { faker } = require('@faker-js/faker');
const { getRandomNumber } = require('../../utils/seedUtils.js');

const fillTeams = () =>{
  const attackList = [];
  for(let i = 0; i < 10000; i++){
    attackList.push({
      user_email: , 
      team_id: getRandomNumber(1, 10001), 
      role: faker.lorem.word()
    });
  }

  return attackList;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
  await knex('users_teams').select('*')
  .then((rows) => {
    if (rows.length === 0) {
      return knex('users_teams').insert(fillTeams());
    }
  })
};
