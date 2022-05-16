const { faker } = require('@faker-js/faker');
const { getRandomBool } = require('../../utils/seedUtils.js');

const fillTeams = (users) =>{
  const teamList = [];
  for (let k = 0; k < 10; k++) {
    for (let i = 0; i < 10; i++) {
      for(let j = 0; j < users.length; j++){
        teamList.push({
          user_email: users[j],
          team_id: i * users.length + j + 1,
          role: faker.lorem.word(),
          is_deleted: getRandomBool()
        });
      }
    }
    users.shift()
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
      let userEmails = await knex('users').select('email')
        .then(users => users.map(user => user.email))
        .catch(err => console.log(err))

        return knex('users_teams').insert(fillTeams(userEmails));
    }
  })
};
