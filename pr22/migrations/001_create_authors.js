exports.up = function(knex) {
  return knex.schema.createTable('authors', function(table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('bio', 1000);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('authors');
};