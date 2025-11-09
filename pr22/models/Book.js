const db = require('../config/database');

class Book {
  // Поиск всех книг с пагинацией
  static async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const books = await db('books')
        .select(
          'books.*',
          'authors.name as author_name',
          'categories.name as category_name'
        )
        .leftJoin('authors', 'books.author_id', 'authors.id')
        .leftJoin('categories', 'books.category_id', 'categories.id')
        .limit(limit)
        .offset(offset)
        .orderBy('books.created_at', 'desc');

      const total = await db('books').count('* as count').first();
      
      return {
        books,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total.count),
          pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Ошибка при получении книг: ${error.message}`);
    }
  }

  // Поиск книги по ID
  static async findById(id) {
    try {
      const book = await db('books')
        .select(
          'books.*',
          'authors.name as author_name',
          'authors.bio as author_bio',
          'categories.name as category_name',
          'categories.description as category_description'
        )
        .leftJoin('authors', 'books.author_id', 'authors.id')
        .leftJoin('categories', 'books.category_id', 'categories.id')
        .where('books.id', id)
        .first();

      if (!book) {
        throw new Error('Книга не найдена');
      }

      return book;
    } catch (error) {
      throw new Error(`Ошибка при получении книги: ${error.message}`);
    }
  }

  // Создание новой книги
  static async create(bookData) {
    try {
      const [book] = await db('books')
        .insert(bookData)
        .returning('*');
      
      return book;
    } catch (error) {
      throw new Error(`Ошибка при создании книги: ${error.message}`);
    }
  }

  // Обновление книги
  static async update(id, bookData) {
    try {
      const [book] = await db('books')
        .where('id', id)
        .update(bookData)
        .returning('*');

      if (!book) {
        throw new Error('Книга не найдена');
      }

      return book;
    } catch (error) {
      throw new Error(`Ошибка при обновлении книги: ${error.message}`);
    }
  }

  // Удаление книги
  static async delete(id) {
    try {
      const deleted = await db('books')
        .where('id', id)
        .del();

      if (!deleted) {
        throw new Error('Книга не найдена');
      }

      return { message: 'Книга успешно удалена' };
    } catch (error) {
      throw new Error(`Ошибка при удалении книги: ${error.message}`);
    }
  }

  // Поиск книг по автору
  static async findByAuthor(authorId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const books = await db('books')
        .select('books.*', 'categories.name as category_name')
        .leftJoin('categories', 'books.category_id', 'categories.id')
        .where('books.author_id', authorId)
        .limit(limit)
        .offset(offset)
        .orderBy('books.created_at', 'desc');

      const total = await db('books')
        .where('author_id', authorId)
        .count('* as count')
        .first();

      return {
        books,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total.count),
          pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Ошибка при поиске книг по автору: ${error.message}`);
    }
  }
}

module.exports = Book;