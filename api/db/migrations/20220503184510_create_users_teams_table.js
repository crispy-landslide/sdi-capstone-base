/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users_teams', table =>{
    table.text('user_id');
    table.foreign('user_id').references('users.id');
    table.integer('team_id');
    table.foreign('team_id').references('teams.id')
    table.text('role')
    table.boolean('is_deleted');
    table.primary(['user_id', 'team_id']);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex) {
  return knex.schema.alterTable('users_teams', table => {
    table.dropForeign('user_id');
    table.dropForeign('team_id')
  })
   .then(() => knex.schema.dropTableIfExists('users_teams'))
};