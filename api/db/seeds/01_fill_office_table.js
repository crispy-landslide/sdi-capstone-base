/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // await knex.schema.raw('TRUNCATE offices CASCADE')
  await knex('offices').del()
  await knex('offices').insert([
    {name: '612 AOC'},
    {name: '608 ACOMS'}
  ])
  
};