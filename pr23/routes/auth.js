const express = require('express');
const User = require('../models/User');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');

const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;

    // Проверка обязательных полей
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email и пароль обязательны' 
      });
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Некорректный формат email' 
      });
    }

    // Проверка существования пользователя
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Пользователь с таким email уже существует' 
      });
    }

    // Создание пользователя
    const userId = await User.create({ email, password, role });
    
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      userId: userId
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Вход в систему
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка обязательных полей
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email и пароль обязательны' 
      });
    }

    // Поиск пользователя
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Неверный email или пароль' 
      });
    }

    // Проверка пароля
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Неверный email или пароль' 
      });
    }

    // Генерация токена
    const token = generateToken(user);

    res.json({
      message: 'Успешный вход в систему',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Получение профиля пользователя
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});

// Защищенный маршрут для администраторов
router.get('/admin', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    message: 'Добро пожаловать в панель администратора',
    user: req.user
  });
});

// Защищенный маршрут для всех аутентифицированных пользователей
router.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'Это защищенный маршрут',
    user: req.user
  });
});

module.exports = router;