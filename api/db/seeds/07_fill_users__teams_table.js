/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users_teams').del()
  await knex('users_teams').insert([
    {user_email: 'mcLovin@fakeEmail.com', team_id: 1, role: 'fake role'},
  ]);
};
