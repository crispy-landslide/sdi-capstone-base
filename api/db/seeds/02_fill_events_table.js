/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  // await knex.schema.raw('TRUNCATE events CASCADE')
  await knex('events').del()
  await knex('events').insert([
    {start_date: (new Date()), end_date: (new Date()), name: 'Mock Event', report_path: '/1/1', office_id: 2, tags: null, description: 'This is a test event.' }
  ]);
};
