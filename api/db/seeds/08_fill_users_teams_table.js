const { faker } = require('@faker-js/faker');
const { getRandomNumber, getRandomBool } = require('../../utils/seedUtils.js');

const fillTeams = (users) =>{
  const teamList = [];
  for(let i = 0; i < users.length; i++){
    teamList.push({
      user_email: users[i],
      team_id: getRandomNumber(1, 300),
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
      let userEmails = await knex('users').select('email')
        .then(users => users.map(user => user.email))
        .catch(err => console.log(err))

        return knex('users_teams').insert(fillTeams(userEmails));
    }
  })
};
