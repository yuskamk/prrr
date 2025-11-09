const db = require('../config/database');

exports.seed = async function(knex) {
  // Очистка таблиц
  await db('books').del();
  await db('authors').del();
  await db('categories').del();

  // Добавление категорий
  const categories = await db('categories').insert([
    { name: 'Фантастика', description: 'Научная фантастика и фэнтези' },
    { name: 'Детектив', description: 'Детективные романы и триллеры' },
    { name: 'Роман', description: 'Художественная литература' },
    { name: 'Программирование', description: 'Техническая литература' }
  ]).returning('*');

  // Добавление авторов
  const authors = await db('authors').insert([
    { name: 'Айзек Азимов', bio: 'Американский писатель-фантаст' },
    { name: 'Агата Кристи', bio: 'Английская писательница детективов' },
    { name: 'Лев Толстой', bio: 'Русский писатель и мыслитель' },
    { name: 'Кайл Симпсон', bio: 'Современный автор книг по программированию' }
  ]).returning('*');

  // Добавление книг
  await db('books').insert([
    {
      title: 'Основание',
      isbn: '9785171503977',
      description: 'Фантастический роман о Галактической Империи',
      publication_year: 1951,
      pages: 320,
      author_id: authors[0].id,
      category_id: categories[0].id
    },
    {
      title: 'Убийство в Восточном экспрессе',
      isbn: '9785171503978',
      description: 'Знаменитый детектив Эркюля Пуаро',
      publication_year: 1934,
      pages: 256,
      author_id: authors[1].id,
      category_id: categories[1].id
    },
    {
      title: 'Война и мир',
      isbn: '9785171503979',
      description: 'Роман-эпопея о русском обществе эпохи войн против Наполеона',
      publication_year: 1869,
      pages: 1225,
      author_id: authors[2].id,
      category_id: categories[2].id
    },
    {
      title: 'You Don\'t Know JS',
      isbn: '9785171503980',
      description: 'Серия книг о глубоком понимании JavaScript',
      publication_year: 2015,
      pages: 450,
      author_id: authors[3].id,
      category_id: categories[3].id
    }
  ]);
};