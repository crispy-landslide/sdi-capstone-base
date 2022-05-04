/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', table => {
    table.increments('id');
    table.text('name');
    table.text('notes').nullable();
    table.boolean('is_complete');
    table.integer('event_id');
    table.foreign('event_id').references('events.id');
  })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('tasks', table =>{
    table.dropForeign('event_id');
  })
  .then(() => knex.schema.dropTableIfExists('tasks'))
};
