const { faker } = require('@faker-js/faker');

const generateCompanies = () =>{
  const companyList = [];
  for(let i = 0; i < 50; i++){
    companyList.push({name: faker.company.companyName()});
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