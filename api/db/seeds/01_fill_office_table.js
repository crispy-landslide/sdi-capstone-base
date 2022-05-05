const { faker } = require('@faker-js/faker');
const { getRandomBool } = require('../../utils/seedUtils.js');

const generateCompanies = () =>{
  const companyList = [];
  for(let i = 0; i < 50; i++){
    companyList.push({name: faker.company.companyName(), is_deleted: getRandomBool()});
  }

  return companyList;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {

  await knex('offices').select('*')
    .then((rows) => {
      if (rows.length === 0) {
        return knex('offices').insert(generateCompanies());
      }
    })
};