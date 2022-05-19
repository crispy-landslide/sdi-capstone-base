const { faker } = require('@faker-js/faker');
const { getRandomBool } = require('../../utils/seedUtils.js');

const generateUsers = () =>{
  const userList = [];
  for(let i = 0; i < 100; i++){
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let email = faker.internet.email(firstName + i, lastName);

    userList.push({
      email: email,
      id: i,
      first_name: firstName,
      last_name: lastName,
      is_deleted: getRandomBool()
    });
  }

  return userList;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.seed = async function(knex) {
  await knex('users').select('*')
    .then((rows) => {
      if (rows.length === 0) {
        return knex('users').insert(generateUsers());
      }
    })
};
