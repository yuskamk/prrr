const db = require('../config/database');

class Category {
  static async findAll() {
    try {
      return await db('categories')
        .select('*')
        .orderBy('name', 'asc');
    } catch (error) {
      throw new Error(`Ошибка при получении категорий: ${error.message}`);
    }
  }

  static async create(categoryData) {
    try {
      const [category] = await db('categories')
        .insert(categoryData)
        .returning('*');
      
      return category;
    } catch (error) {
      throw new Error(`Ошибка при создании категории: ${error.message}`);
    }
  }
}

module.exports = Category;