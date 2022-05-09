const { faker } = require('@faker-js/faker');
const { getRandomNumber, getRandomBool } = require('../../utils/seedUtils.js');
// const fs = require('fs');
// const path = require("path");

const fillTeams = (users) =>{
  const teamList = [];
  for(let i = 0; i < users.length; i++){
    teamList.push({
      user_id: users[i],
      team_id: getRandomNumber(1, 4001),
      role: faker.lorem.word(),
      is_deleted: getRandomBool()
    });
  }

  return teamList;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.seed = async function(knex) {
  await knex('users_teams').select('*')
  .then(async (rows) => {
    if (rows.length === 0) {
      let userIds = await knex('users').select('id')
        .then(users => users.map(user => user.id))
        .catch(err => console.log(err))

        return knex('users_teams').insert(fillTeams(userIds));
    }
  })
};
