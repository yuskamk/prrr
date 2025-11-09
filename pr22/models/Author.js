const db = require('../config/database');

class Author {
  // Получение списка авторов
  static async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const authors = await db('authors')
        .select('*')
        .limit(limit)
        .offset(offset)
        .orderBy('name', 'asc');

      const total = await db('authors').count('* as count').first();
      
      return {
        authors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total.count),
          pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Ошибка при получении авторов: ${error.message}`);
    }
  }

  // Получение автора с его книгами
  static async findByIdWithBooks(id) {
    try {
      const author = await db('authors')
        .where('id', id)
        .first();

      if (!author) {
        throw new Error('Автор не найден');
      }

      const books = await db('books')
        .select(
          'books.*',
          'categories.name as category_name'
        )
        .leftJoin('categories', 'books.category_id', 'categories.id')
        .where('books.author_id', id)
        .orderBy('books.created_at', 'desc');

      return {
        ...author,
        books
      };
    } catch (error) {
      throw new Error(`Ошибка при получении автора: ${error.message}`);
    }
  }

  // Создание нового автора
  static async create(authorData) {
    try {
      const [author] = await db('authors')
        .insert(authorData)
        .returning('*');
      
      return author;
    } catch (error) {
      throw new Error(`Ошибка при создании автора: ${error.message}`);
    }
  }

  // Обновление автора
  static async update(id, authorData) {
    try {
      const [author] = await db('authors')
        .where('id', id)
        .update(authorData)
        .returning('*');

      if (!author) {
        throw new Error('Автор не найден');
      }

      return author;
    } catch (error) {
      throw new Error(`Ошибка при обновлении автора: ${error.message}`);
    }
  }

  // Удаление автора
  static async delete(id) {
    try {
      const deleted = await db('authors')
        .where('id', id)
        .del();

      if (!deleted) {
        throw new Error('Автор не найден');
      }

      return { message: 'Автор успешно удален' };
    } catch (error) {
      throw new Error(`Ошибка при удалении автора: ${error.message}`);
    }
  }
}

module.exports = Author;