/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {email: 'mcLovin@fakeEmail.com', first_name: 'Fogell', last_name: 'McLovin', is_admin: true, is_editor: false, office_id: 1}
  ]);
};
