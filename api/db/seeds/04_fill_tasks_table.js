/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tasks').del()
  await knex('tasks').insert([
    {name: 'Mock Task', notes: 'I am pretending to write something important', is_complete: true, event_id: 1}
  ]);
};
