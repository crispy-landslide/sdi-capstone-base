const { faker } = require('@faker-js/faker');
const { getRandomNumber, getRandomBool } = require('../../utils/seedUtils.js');

const generateEvents = () =>{
  const eventList = [];
  for(let i = 0; i < 1000; i++){
    let startDate;
    let endDate;
    if(i < 334){
      startDate = faker.date.past();
      endDate = faker.date.past();
    } else if(333 < i < 667) {
      startDate = faker.date.past();
      endDate = faker.date.soon();
    } else {
      startDate = faker.date.soon();
      endDate = faker.date.future();
    }

    eventList.push({
      start_date: startDate, 
      end_date: endDate, 
      name: faker.lorem.word(), 
      report_path: null, 
      office_id: getRandomNumber(1, 51), 
      tags: null, 
      is_deleted: getRandomBool(),
      description: faker.lorem.sentences() 
    });
  }

  return eventList;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('events').select('*')
  .then((rows) => {
    if (rows.length === 0) {
      // console.log(generateEvents().length)
      return knex('events').insert(generateEvents());
    }
  })
};
