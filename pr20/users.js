const express = require('express');
const router = express.Router();

// Временное хранилище данных (в реальном приложении использовалась бы БД)
let users = [
    { id: 1, name: 'Иван Иванов', email: 'ivan@mail.ru', age: 25 },
    { id: 2, name: 'Петр Петров', email: 'petr@mail.ru', age: 30 }
];

// Middleware для проверки существования пользователя
router.param('id', (req, res, next, id) => {
    const userId = parseInt(id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ 
            error: 'Пользователь не найден',
            message: `Пользователь с ID ${id} не существует`
        });
    }
    
    req.user = user;
    next();
});

// GET /api/users - получить всех пользователей
router.get('/', (req, res) => {
    res.json({
        message: 'Список пользователей получен успешно',
        data: users
    });
});

// GET /api/users/:id - получить пользователя по ID
router.get('/:id', (req, res) => {
    res.json({
        message: 'Пользователь найден',
        data: req.user
    });
});

// POST /api/users - создать нового пользователя
router.post('/', (req, res) => {
    const { name, email, age } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({
            error: 'Неверные данные',
            message: 'Имя и email обязательны для заполнения'
        });
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        age: age || null
    };
    
    users.push(newUser);
    
    res.status(201).json({
        message: 'Пользователь успешно создан',
        data: newUser
    });
});

// PUT /api/users/:id - обновить пользователя
router.put('/:id', (req, res) => {
    const { name, email, age } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;
    if (age) users[userIndex].age = age;
    
    res.json({
        message: 'Пользователь успешно обновлен',
        data: users[userIndex]
    });
});

// DELETE /api/users/:id - удалить пользователя
router.delete('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.user.id);
    users.splice(userIndex, 1);
    
    res.json({
        message: 'Пользователь успешно удален',
        data: { id: req.user.id }
    });
});

module.exports = router;