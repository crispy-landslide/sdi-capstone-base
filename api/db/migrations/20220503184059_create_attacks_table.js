/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('attacks', table => {
    table.increments('id');
    table.integer('mission_id');
    table.foreign('mission_id').references('missions.id')
    table.integer('attack');
    table.integer('variant');
    table.text('description');
    table.text('goal');
    table.text('assumptions');
    table.text('mission_impact');
    table.integer('mission_impact_score');
    table.text('likelihood');
    table.integer('likelihood_score');
    table.boolean('is_deleted');
    table.integer('event_id');
    table.foreign('event_id').references('events.id')

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('attacks', table =>{
    table.dropForeign('event_id');
    table.dropForeign('mission_id');
  })
  .then(() => knex.schema.dropTableIfExists('attacks'))
};
