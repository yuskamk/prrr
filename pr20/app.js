const express = require('express');
const usersRouter = require('./users');
const productsRouter = require('./products');

const app = express();
const PORT = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Логирующее middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Подключаем роутеры
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

// Middleware для обработки 404 ошибок
app.use((req, res) => {
    res.status(404).json({
        error: 'Страница не найдена',
        message: `Запрошенный ресурс ${req.url} не существует`
    });
});

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка:', err);
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Доступно по адресу: http://localhost:${PORT}`);
});