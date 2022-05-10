const { faker } = require('@faker-js/faker');
const { getRandomNumber, getRandomBool } = require('../../utils/seedUtils.js');
// const fs = require('fs');
// const path = require("path");

const generateUsers = () =>{
  const userList = [];
  for(let i = 0; i < 1000; i++){
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let email = faker.internet.email(firstName + i, lastName);

    userList.push({
      email: email,
      id: i,
      first_name: firstName,
      last_name: lastName,
      is_admin: getRandomBool(),
      is_editor: getRandomBool(),
      is_deleted: getRandomBool(),
      office_id: getRandomNumber(1, 51)
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
