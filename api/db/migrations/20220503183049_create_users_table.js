/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.text('email').primary();
    table.text('id').nullable();
    table.text('first_name').nullable();
    table.text('last_name').nullable();
    table.boolean('is_deleted');
  })
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
};
