const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Данные для примера
let users = [
    { id: 1, name: 'Иван Иванов', email: 'ivan@example.com' },
    { id: 2, name: 'Петр Петров', email: 'petr@example.com' },
    { id: 3, name: 'Мария Сидорова', email: 'maria@example.com' }
];

let products = [
    { id: 1, name: 'Ноутбук', price: 50000, category: 'электроника' },
    { id: 2, name: 'Смартфон', price: 30000, category: 'электроника' },
    { id: 3, name: 'Книга', price: 500, category: 'литература' }
];

// Создание HTTP сервера
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    // CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);
    
    // Маршрутизация
    if (pathname === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Node.js Server - Главная</title>
                <meta charset="utf-8">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: Arial, sans-serif; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        padding: 40px 20px;
                    }
                    .container {
                        max-width: 1000px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 15px;
                        padding: 40px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                        margin-bottom: 30px;
                        font-size: 2.5em;
                    }
                    .subtitle {
                        text-align: center;
                        color: #666;
                        margin-bottom: 40px;
                        font-size: 1.2em;
                    }
                    .endpoints {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .endpoint-group {
                        background: #f8f9fa;
                        padding: 25px;
                        border-radius: 10px;
                        border-left: 4px solid #667eea;
                    }
                    .endpoint-group h3 {
                        color: #333;
                        margin-bottom: 15px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .endpoint-item {
                        background: white;
                        margin: 10px 0;
                        padding: 12px 15px;
                        border-radius: 8px;
                        border: 1px solid #e9ecef;
                    }
                    .method {
                        display: inline-block;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-weight: bold;
                        font-size: 12px;
                        margin-right: 10px;
                    }
                    .get { background: #d4edda; color: #155724; }
                    .post { background: #d1ecf1; color: #0c5460; }
                    .put { background: #fff3cd; color: #856404; }
                    .delete { background: #f8d7da; color: #721c24; }
                    .links {
                        text-align: center;
                        margin-top: 30px;
                    }
                    .btn {
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 12px 30px;
                        border-radius: 8px;
                        text-decoration: none;
                        margin: 0 10px;
                        font-weight: bold;
                        transition: transform 0.2s;
                    }
                    .btn:hover {
                        transform: translateY(-2px);
                    }
                    @media (max-width: 768px) {
                        .endpoints { grid-template-columns: 1fr; }
                        .container { padding: 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 Node.js Сервер</h1>
                    <p class="subtitle">Практическая работа №19 - Создание простого сервера</p>
                    
                    <div class="endpoints">
                        <div class="endpoint-group">
                            <h3>👥 Пользователи</h3>
                            <div class="endpoint-item">
                                <span class="method get">GET</span> /api/users
                            </div>
                            <div class="endpoint-item">
                                <span class="method get">GET</span> /api/users/:id
                            </div>
                            <div class="endpoint-item">
                                <span class="method post">POST</span> /api/users
                            </div>
                            <div class="endpoint-item">
                                <span class="method put">PUT</span> /api/users/:id
                            </div>
                            <div class="endpoint-item">
                                <span class="method delete">DELETE</span> /api/users/:id
                            </div>
                        </div>
                        
                        <div class="endpoint-group">
                            <h3>🛍️ Товары</h3>
                            <div class="endpoint-item">
                                <span class="method get">GET</span> /api/products
                            </div>
                            <div class="endpoint-item">
                                <span class="method get">GET</span> /api/products/:id
                            </div>
                            <div class="endpoint-item">
                                <span class="method get">GET</span> /api/search?q=...
                            </div>
                            <div class="endpoint-item">
                                <span class="method get">GET</span> /api/info
                            </div>
                        </div>
                    </div>
                    
                    <div class="links">
                        <a href="/client.html" class="btn">📱 Тестовый клиент</a>
                        <a href="http://localhost:3001" class="btn">⚡ Продвинутый сервер</a>
                    </div>
                </div>
            </body>
            </html>
        `);
    }
    else if (pathname === '/api/users' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(users));
    }
    else if (pathname.startsWith('/api/users/') && method === 'GET') {
        const userId = parseInt(pathname.split('/')[3]);
        const user = users.find(u => u.id === userId);
        
        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Пользователь не найден' }));
        }
    }
    else if (pathname === '/api/users' && method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const newUser = JSON.parse(body);
                if (!newUser.name || !newUser.email) {
                    throw new Error('Неверные данные');
                }
                newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
                users.push(newUser);
                
                res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(newUser));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
            }
        });
    }
    else if (pathname.startsWith('/api/users/') && method === 'PUT') {
        const userId = parseInt(pathname.split('/')[3]);
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const updatedData = JSON.parse(body);
                const userIndex = users.findIndex(u => u.id === userId);
                
                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...updatedData };
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(users[userIndex]));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Пользователь не найден' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
            }
        });
    }
    else if (pathname.startsWith('/api/users/') && method === 'DELETE') {
        const userId = parseInt(pathname.split('/')[3]);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            const deletedUser = users.splice(userIndex, 1)[0];
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'Пользователь удален', user: deletedUser }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Пользователь не найден' }));
        }
    }
    else if (pathname === '/api/products' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(products));
    }
    else if (pathname.startsWith('/api/products/') && method === 'GET') {
        const productId = parseInt(pathname.split('/')[3]);
        const product = products.find(p => p.id === productId);
        
        if (product) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(product));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Товар не найден' }));
        }
    }
    else if (pathname === '/api/search' && method === 'GET') {
        const query = parsedUrl.query.q?.toLowerCase() || '';
        
        if (!query) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Не указан поисковый запрос' }));
            return;
        }
        
        const userResults = users.filter(u => 
            u.name.toLowerCase().includes(query) || 
            u.email.toLowerCase().includes(query)
        );
        
        const productResults = products.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            query,
            users: userResults,
            products: productResults
        }));
    }
    else if (pathname === '/api/info' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            server: 'Node.js HTTP Server',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            endpoints: {
                users: users.length,
                products: products.length
            }
        }));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Страница не найдена' }));
    }
});

// Запуск сервера
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ Базовый сервер запущен на порту ${PORT}`);
    console.log(`📱 Откройте http://localhost:${PORT} в браузере`);
});