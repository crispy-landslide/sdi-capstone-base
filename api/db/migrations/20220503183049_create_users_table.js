/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
      table.text('email').primary();
      table.text('first_name').nullable();
      table.text('last_name').nullable();
      table.boolean('is_admin');
      table.boolean('is_editor');
      table.integer('office_id').nullable();
      table.foreign('office_id').references('offices.id');
  })
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.dropForeign('office_id');
  })
   .then(() => knex.schema.dropTableIfExists('users'))
};
