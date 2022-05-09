/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('events', table => {
    table.increments('id');
    table.dateTime('start_date');
    table.dateTime('end_date');
    table.text('name');
    table.text('report_path').nullable();
    table.text('tags').nullable();
    table.text('description').nullable();
    table.boolean('is_deleted');
    table.integer('office_id').nullable();
    table.foreign('office_id').references('offices.id');
  })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('events', table =>{
    table.dropForeign('office_id');
  })
  .then(() => knex.schema.dropTableIfExists('events'))
  
};
