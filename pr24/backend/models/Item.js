class Item {
  constructor(id, title, description, completed = false, createdAt = new Date().toISOString()) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.createdAt = createdAt;
  }

  // Валидация данных элемента
  static validate(itemData) {
    const errors = [];

    if (!itemData.title || itemData.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!itemData.description || itemData.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (itemData.title && itemData.title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }

    if (itemData.description && itemData.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }

    return errors;
  }

  // Создание элемента из данных
  static createFromData(itemData) {
    const { id, title, description, completed, createdAt } = itemData;
    return new Item(id, title, description, completed, createdAt);
  }

  // Обновление элемента
  update(updates) {
    if (updates.title !== undefined) {
      this.title = updates.title;
    }
    if (updates.description !== undefined) {
      this.description = updates.description;
    }
    if (updates.completed !== undefined) {
      this.completed = updates.completed;
    }
    return this;
  }

  // Преобразование в объект
  toObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt
    };
  }

  // Преобразование в JSON
  toJSON() {
    return this.toObject();
  }
}

module.exports = Item;