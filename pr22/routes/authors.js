const express = require('express');
const router = express.Router();
const Author = require('../models/Author');

// GET /authors - Получить всех авторов
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await Author.findAll(page, limit);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /authors/:id - Получить автора по ID с его книгами
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findByIdWithBooks(req.params.id);
    
    res.json({
      success: true,
      data: author
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// POST /authors - Создать нового автора
router.post('/', async (req, res) => {
  try {
    const author = await Author.create(req.body);
    
    res.status(201).json({
      success: true,
      data: author
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /authors/:id - Обновить автора
router.put('/:id', async (req, res) => {
  try {
    const author = await Author.update(req.params.id, req.body);
    
    res.json({
      success: true,
      data: author
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /authors/:id - Удалить автора
router.delete('/:id', async (req, res) => {
  try {
    const result = await Author.delete(req.params.id);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;