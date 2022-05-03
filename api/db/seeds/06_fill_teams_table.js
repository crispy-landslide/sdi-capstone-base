/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('teams').del()
  await knex('teams').insert([
    {name: 'Red', event_id: 1},
    {name: 'Blue', event_id: 1},
    {name: 'Control', event_id: 1}
  ]);
};
