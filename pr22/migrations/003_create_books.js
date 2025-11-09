exports.up = function(knex) {
  return knex.schema.createTable('books', function(table) {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.string('isbn', 13).unique();
    table.text('description');
    table.integer('publication_year');
    table.integer('pages');
    table.integer('author_id').unsigned().notNullable();
    table.integer('category_id').unsigned().notNullable();
    table.timestamps(true, true);

    // Внешние ключи
    table.foreign('author_id').references('id').inTable('authors').onDelete('CASCADE');
    table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE');

    // Индексы для оптимизации
    table.index(['author_id']);
    table.index(['category_id']);
    table.index(['publication_year']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('books');
};