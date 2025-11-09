const express = require('express');
const cors = require('cors');
let books = require('./books-data');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Вспомогательные функции
const findBookById = (id) => books.find(book => book.id === parseInt(id));
const findBookByISBN = (isbn) => books.find(book => book.isbn === isbn);
const getNextId = () => Math.max(...books.map(book => book.id), 0) + 1;

// Валидация данных книги
const validateBook = (book, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate || book.title !== undefined) {
    if (!book.title || book.title.trim().length === 0) {
      errors.push('Название книги обязательно');
    }
  }
  
  if (!isUpdate || book.author !== undefined) {
    if (!book.author || book.author.trim().length === 0) {
      errors.push('Автор книги обязателен');
    }
  }
  
  if (book.year && (book.year < 1000 || book.year > new Date().getFullYear())) {
    errors.push('Год издания должен быть корректным');
  }
  
  if (book.isbn && !/^[0-9-]+$/.test(book.isbn)) {
    errors.push('ISBN должен содержать только цифры и дефисы');
  }
  
  return errors;
};

// GET /api/books - получение всех книг с фильтрацией и пагинацией
app.get('/api/books', (req, res) => {
  try {
    let filteredBooks = [...books];
    
    // Фильтрация по query-параметрам
    const { author, genre, year, page = 1, limit = 10 } = req.query;
    
    if (author) {
      filteredBooks = filteredBooks.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase())
      );
    }
    
    if (genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }
    
    if (year) {
      filteredBooks = filteredBooks.filter(book => book.year === parseInt(year));
    }
    
    // Пагинация
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const result = {
      total: filteredBooks.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filteredBooks.length / limitNum),
      data: filteredBooks.slice(startIndex, endIndex)
    };
    
    res.json(result);
  } catch (error) {
    console.error('Ошибка при получении книг:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      message: error.message 
    });
  }
});

// GET /api/books/:id - получение книги по ID
app.get('/api/books/:id', (req, res) => {
  try {
    const book = findBookById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ 
        error: 'Книга не найдена',
        message: `Книга с ID ${req.params.id} не существует` 
      });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Ошибка при получении книги:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      message: error.message 
    });
  }
});

// POST /api/books - создание новой книги
app.post('/api/books', (req, res) => {
  try {
    const { title, author, genre, year, isbn } = req.body;
    
    // Валидация обязательных полей
    const validationErrors = validateBook({ title, author, genre, year, isbn });
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Ошибка валидации',
        details: validationErrors 
      });
    }
    
    // Проверка уникальности ISBN
    if (isbn && findBookByISBN(isbn)) {
      return res.status(400).json({ 
        error: 'Ошибка валидации',
        details: ['Книга с таким ISBN уже существует'] 
      });
    }
    
    // Создание новой книги
    const newBook = {
      id: getNextId(),
      title: title.trim(),
      author: author.trim(),
      genre: genre ? genre.trim() : null,
      year: year ? parseInt(year) : null,
      isbn: isbn || null,
      createdAt: new Date().toISOString()
    };
    
    books.push(newBook);
    
    res.status(201).json({
      message: 'Книга успешно создана',
      book: newBook
    });
  } catch (error) {
    console.error('Ошибка при создании книги:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      message: error.message 
    });
  }
});

// PUT /api/books/:id - полное обновление книги
app.put('/api/books/:id', (req, res) => {
  try {
    const bookIndex = books.findIndex(book => book.id === parseInt(req.params.id));
    
    if (bookIndex === -1) {
      return res.status(404).json({ 
        error: 'Книга не найдена',
        message: `Книга с ID ${req.params.id} не существует` 
      });
    }
    
    const { title, author, genre, year, isbn } = req.body;
    
    // Валидация всех полей для полного обновления
    const validationErrors = validateBook({ title, author, genre, year, isbn });
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Ошибка валидации',
        details: validationErrors 
      });
    }
    
    // Проверка уникальности ISBN (исключая текущую книгу)
    if (isbn) {
      const existingBook = findBookByISBN(isbn);
      if (existingBook && existingBook.id !== parseInt(req.params.id)) {
        return res.status(400).json({ 
          error: 'Ошибка валидации',
          details: ['Книга с таким ISBN уже существует'] 
        });
      }
    }
    
    // Полное обновление книги
    const updatedBook = {
      id: parseInt(req.params.id),
      title: title.trim(),
      author: author.trim(),
      genre: genre ? genre.trim() : null,
      year: year ? parseInt(year) : null,
      isbn: isbn || null,
      createdAt: books[bookIndex].createdAt,
      updatedAt: new Date().toISOString()
    };
    
    books[bookIndex] = updatedBook;
    
    res.json({
      message: 'Книга успешно обновлена',
      book: updatedBook
    });
  } catch (error) {
    console.error('Ошибка при обновлении книги:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      message: error.message 
    });
  }
});

// PATCH /api/books/:id - частичное обновление книги
app.patch('/api/books/:id', (req, res) => {
  try {
    const bookIndex = books.findIndex(book => book.id === parseInt(req.params.id));
    
    if (bookIndex === -1) {
      return res.status(404).json({ 
        error: 'Книга не найдена',
        message: `Книга с ID ${req.params.id} не существует` 
      });
    }
    
    const updateData = req.body;
    
    // Валидация только переданных полей
    const validationErrors = validateBook(updateData, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Ошибка валидации',
        details: validationErrors 
      });
    }
    
    // Проверка уникальности ISBN (исключая текущую книгу)
    if (updateData.isbn) {
      const existingBook = findBookByISBN(updateData.isbn);
      if (existingBook && existingBook.id !== parseInt(req.params.id)) {
        return res.status(400).json({ 
          error: 'Ошибка валидации',
          details: ['Книга с таким ISBN уже существует'] 
        });
      }
    }
    
    // Частичное обновление
    const updatedBook = {
      ...books[bookIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Обработка строковых полей
    if (updateData.title) updatedBook.title = updateData.title.trim();
    if (updateData.author) updatedBook.author = updateData.author.trim();
    if (updateData.genre) updatedBook.genre = updateData.genre.trim();
    if (updateData.year) updatedBook.year = parseInt(updateData.year);
    
    books[bookIndex] = updatedBook;
    
    res.json({
      message: 'Книга успешно обновлена',
      book: updatedBook
    });
  } catch (error) {
    console.error('Ошибка при частичном обновлении книги:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      message: error.message 
    });
  }
});

// DELETE /api/books/:id - удаление книги
app.delete('/api/books/:id', (req, res) => {
  try {
    const bookIndex = books.findIndex(book => book.id === parseInt(req.params.id));
    
    if (bookIndex === -1) {
      return res.status(404).json({ 
        error: 'Книга не найдена',
        message: `Книга с ID ${req.params.id} не существует` 
      });
    }
    
    const deletedBook = books[bookIndex];
    books = books.filter(book => book.id !== parseInt(req.params.id));
    
    res.json({
      message: 'Книга успешно удалена',
      book: deletedBook
    });
  } catch (error) {
    console.error('Ошибка при удалении книги:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      message: error.message 
    });
  }
});

// Обработка несуществующих маршрутов
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Маршрут не найден',
    message: `Маршрут ${req.originalUrl} не существует` 
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`API доступно по адресу: http://localhost:${PORT}/api/books`);
});

module.exports = app;