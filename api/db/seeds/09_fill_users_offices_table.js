const { getRandomNumber, getRandomBool } = require('../../utils/seedUtils.js');

const fillOffices = (users) =>{
  const officeList = [];
  for(let i = 0; i < users.length; i++){
    officeList.push({
      user_email: users[i],
      office_id: getRandomNumber(1, 51),
      is_admin: getRandomBool(),
      is_editor: getRandomBool(),
      is_deleted: getRandomBool()
    });
  }

  return officeList;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.seed = async function(knex) {
  await knex('users_offices').select('*')
  .then(async (rows) => {
    if (rows.length === 0) {
      let userEmails = await knex('users').select('email')
        .then(users => users.map(user => user.email))
        .catch(err => console.log(err))

        return knex('users_offices').insert(fillOffices(userEmails));
    }
  })
};
