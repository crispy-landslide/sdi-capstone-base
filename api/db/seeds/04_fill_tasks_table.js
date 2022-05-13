const { faker } = require('@faker-js/faker');
const { getRandomNumber, getRandomBool } = require('../../utils/seedUtils.js');

const generateTasks = () =>{
  const taskList = [];
  for(let i = 0; i < 500; i++){
    taskList.push({
      name: faker.lorem.word(),
      notes: faker.lorem.sentences(),
      is_complete: getRandomBool(),
      is_deleted: getRandomBool(),
      event_id: getRandomNumber(1, 25)
    });
  }

  return taskList;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.seed = async function(knex) {
  await knex('tasks').select('*')
  .then((rows) => {
    if (rows.length === 0) {
      return knex('tasks').insert(generateTasks());
    }
  })
};
