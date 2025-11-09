const express = require('express');
const corsMiddleware = require('./middleware/cors');
const Item = require('./models/Item');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// In-memory storage
let items = [
  new Item('1', 'Изучить React', 'Освоить основы React', false, new Date().toISOString()),
  new Item('2', 'Создать API', 'Разработать бэкенд на Express', true, new Date().toISOString())
];

// GET /api/items - получить все элементы
app.get('/api/items', (req, res) => {
  try {
    const itemsData = items.map(item => item.toObject());
    res.json({
      success: true,
      data: itemsData,
      total: items.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных'
    });
  }
});

// GET /api/items/:id - получить элемент по ID
app.get('/api/items/:id', (req, res) => {
  try {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Элемент не найден'
      });
    }
    res.json({
      success: true,
      data: item.toObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении элемента'
    });
  }
});

// POST /api/items - создать новый элемент
app.post('/api/items', (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Валидация с использованием модели
    const validationErrors = Item.validate({ title, description });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ошибки валидации',
        errors: validationErrors
      });
    }

    const newItem = new Item(
      uuidv4(),
      title.trim(),
      description.trim(),
      false,
      new Date().toISOString()
    );

    items.push(newItem);

    res.status(201).json({
      success: true,
      data: newItem.toObject(),
      message: 'Элемент успешно создан'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании элемента'
    });
  }
});

// PUT /api/items/:id - обновить элемент
app.put('/api/items/:id', (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const itemIndex = items.findIndex(i => i.id === req.params.id);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Элемент не найден'
      });
    }

    // Валидация обновлений
    const validationErrors = Item.validate({ 
      title: title || items[itemIndex].title, 
      description: description || items[itemIndex].description 
    });
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ошибки валидации',
        errors: validationErrors
      });
    }

    // Обновление элемента
    items[itemIndex].update({
      title: title || items[itemIndex].title,
      description: description || items[itemIndex].description,
      completed: completed !== undefined ? completed : items[itemIndex].completed
    });

    res.json({
      success: true,
      data: items[itemIndex].toObject(),
      message: 'Элемент успешно обновлен'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении элемента'
    });
  }
});

// DELETE /api/items/:id - удалить элемент
app.delete('/api/items/:id', (req, res) => {
  try {
    const itemIndex = items.findIndex(i => i.id === req.params.id);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Элемент не найден'
      });
    }

    const deletedItem = items.splice(itemIndex, 1)[0];

    res.json({
      success: true,
      data: deletedItem.toObject(),
      message: 'Элемент успешно удален'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении элемента'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});