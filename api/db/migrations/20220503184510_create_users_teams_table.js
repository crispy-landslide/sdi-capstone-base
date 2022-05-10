/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users_teams', table =>{
    table.text('user_email');
    table.foreign('user_email').references('users.email');
    table.integer('team_id');
    table.foreign('team_id').references('teams.id')
    table.text('role').nullable();
    table.boolean('is_deleted');
    table.primary(['user_email', 'team_id']);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex) {
  return knex.schema.alterTable('users_teams', table => {
    table.dropForeign('user_email');
    table.dropForeign('team_id')
  })
   .then(() => knex.schema.dropTableIfExists('users_teams'))
};