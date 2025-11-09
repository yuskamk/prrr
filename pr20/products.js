const express = require('express');
const router = express.Router();

// Временное хранилище товаров
let products = [
    { id: 1, name: 'Ноутбук', price: 50000, category: 'Электроника' },
    { id: 2, name: 'Смартфон', price: 30000, category: 'Электроника' },
    { id: 3, name: 'Книга', price: 500, category: 'Литература' }
];

// GET /api/products - получить все товары
router.get('/', (req, res) => {
    const { category, minPrice, maxPrice } = req.query;
    
    let filteredProducts = [...products];
    
    // Фильтрация по категории
    if (category) {
        filteredProducts = filteredProducts.filter(p => 
            p.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Фильтрация по цене
    if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
    }
    
    res.json({
        message: 'Список товаров получен успешно',
        data: filteredProducts
    });
});

// GET /api/products/:id - получить товар по ID
router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({
            error: 'Товар не найден',
            message: `Товар с ID ${productId} не существует`
        });
    }
    
    res.json({
        message: 'Товар найден',
        data: product
    });
});

// POST /api/products - создать новый товар
router.post('/', (req, res) => {
    const { name, price, category } = req.body;
    
    if (!name || !price || !category) {
        return res.status(400).json({
            error: 'Неверные данные',
            message: 'Название, цена и категория обязательны для заполнения'
        });
    }
    
    const newProduct = {
        id: products.length + 1,
        name,
        price: parseInt(price),
        category
    };
    
    products.push(newProduct);
    
    res.status(201).json({
        message: 'Товар успешно создан',
        data: newProduct
    });
});

// PUT /api/products/:id - обновить товар
router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price, category } = req.body;
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({
            error: 'Товар не найден',
            message: `Товар с ID ${productId} не существует`
        });
    }
    
    if (name) products[productIndex].name = name;
    if (price) products[productIndex].price = parseInt(price);
    if (category) products[productIndex].category = category;
    
    res.json({
        message: 'Товар успешно обновлен',
        data: products[productIndex]
    });
});

// DELETE /api/products/:id - удалить товар
router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({
            error: 'Товар не найден',
            message: `Товар с ID ${productId} не существует`
        });
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    
    res.json({
        message: 'Товар успешно удален',
        data: deletedProduct
    });
});

module.exports = router;