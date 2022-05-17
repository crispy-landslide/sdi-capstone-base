/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users_offices', table => {
    table.text('user_email');
    table.foreign('user_email').references('users.email');
    table.integer('office_id');
    table.foreign('office_id').references('offices.id');
    table.boolean('is_admin');
    table.boolean('is_editor');
    table.boolean('is_deleted');
    table.primary(['user_email', 'office_id']);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('users_offices', table => {
    table.dropForeign('user_email');
    table.dropForeign('office_id');
  })
   .then(() => knex.schema.dropTableIfExists('users_offices'))
};
