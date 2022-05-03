/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('teams', table => {
    table.increments('id');
    table.text('name');
    table.integer('event_id');
    table.foreign('event_id').references('events.id');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex) {
  return knex.schema.alterTable('teams', table =>{
    table.dropForeign('event_id');
  })
  .then(() => knex.schema.dropTableIfExists('teams'))
};
