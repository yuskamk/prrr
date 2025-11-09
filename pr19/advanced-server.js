const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Middleware для логирования
function loggingMiddleware(req, res, next) {
    const timestamp = new Date().toLocaleString('ru-RU');
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
}

// Middleware для парсинга JSON
function jsonParserMiddleware(req, res, next) {
    if (req.method === 'POST' || req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                if (body) {
                    req.body = JSON.parse(body);
                }
                next();
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
            }
        });
    } else {
        next();
    }
}

// Middleware для статических файлов
function staticFilesMiddleware(req, res, next) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    if (pathname.startsWith('/static/')) {
        const filePath = path.join(__dirname, pathname);
        
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                next();
                return;
            }
            
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'text/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif'
            };
            
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    res.writeHead(500);
                    res.end('Ошибка сервера');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        });
    } else {
        next();
    }
}

// Middleware для CORS
function corsMiddleware(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    next();
}

// Данные
let tasks = [
    { id: 1, title: 'Изучить Node.js', completed: false, createdAt: new Date().toISOString() },
    { id: 2, title: 'Создать REST API', completed: true, createdAt: new Date().toISOString() },
    { id: 3, title: 'Написать документацию', completed: false, createdAt: new Date().toISOString() }
];

// Обработчик запросов с middleware
function handleRequest(req, res) {
    const middlewares = [corsMiddleware, loggingMiddleware, staticFilesMiddleware, jsonParserMiddleware];
    
    function executeMiddleware(index) {
        if (index < middlewares.length) {
            middlewares[index](req, res, () => executeMiddleware(index + 1));
        } else {
            routeHandler(req, res);
        }
    }
    
    executeMiddleware(0);
}

// Основной обработчик маршрутов
function routeHandler(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    if (pathname === '/api/tasks' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(tasks));
    }
    else if (pathname === '/api/tasks' && method === 'POST') {
        const newTask = {
            id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            title: req.body.title,
            completed: req.body.completed || false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(newTask));
    }
    else if (pathname.startsWith('/api/tasks/') && method === 'PUT') {
        const taskId = parseInt(pathname.split('/')[3]);
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...req.body, updatedAt: new Date().toISOString() };
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(tasks[taskIndex]));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Задача не найдена' }));
        }
    }
    else if (pathname.startsWith('/api/tasks/') && method === 'DELETE') {
        const taskId = parseInt(pathname.split('/')[3]);
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            const deletedTask = tasks.splice(taskIndex, 1)[0];
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'Задача удалена', task: deletedTask }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Задача не найдена' }));
        }
    }
    else if (pathname === '/api/stats' && method === 'GET') {
        const stats = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.completed).length,
            pendingTasks: tasks.filter(t => !t.completed).length,
            serverTime: new Date().toISOString()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(stats));
    }
    else if (pathname === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Продвинутый Node.js Server</title>
                <meta charset="utf-8">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: Arial, sans-serif; 
                        background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
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
                        margin-bottom: 10px;
                        font-size: 2.5em;
                    }
                    .subtitle {
                        text-align: center;
                        color: #666;
                        margin-bottom: 30px;
                        font-size: 1.1em;
                    }
                    .features {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .feature {
                        background: #f8f9fa;
                        padding: 25px;
                        border-radius: 10px;
                        text-align: center;
                        border: 2px solid transparent;
                        transition: all 0.3s ease;
                    }
                    .feature:hover {
                        border-color: #ff6b6b;
                        transform: translateY(-5px);
                    }
                    .feature-icon {
                        font-size: 2em;
                        margin-bottom: 15px;
                    }
                    .endpoints {
                        background: #f8f9fa;
                        padding: 25px;
                        border-radius: 10px;
                        margin-bottom: 30px;
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
                    }
                    .btn {
                        display: inline-block;
                        background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
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
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>⚡ Продвинутый Сервер</h1>
                    <p class="subtitle">Node.js с Middleware и статическими файлами</p>
                    
                    <div class="features">
                        <div class="feature">
                            <div class="feature-icon">📝</div>
                            <h3>Логирование</h3>
                            <p>Все запросы логируются с временными метками</p>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🔄</div>
                            <h3>Парсинг JSON</h3>
                            <p>Автоматический парсинг тела запросов</p>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">📁</div>
                            <h3>Статические файлы</h3>
                            <p>Обслуживание CSS, JS и других файлов</p>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🌐</div>
                            <h3>CORS</h3>
                            <p>Поддержка кросс-доменных запросов</p>
                        </div>
                    </div>
                    
                    <div class="endpoints">
                        <h3 style="margin-bottom: 15px; text-align: center;">📋 Доступные endpoints</h3>
                        <div class="endpoint-item">
                            <span class="method get">GET</span> /api/tasks - Список задач
                        </div>
                        <div class="endpoint-item">
                            <span class="method post">POST</span> /api/tasks - Создать задачу
                        </div>
                        <div class="endpoint-item">
                            <span class="method put">PUT</span> /api/tasks/:id - Обновить задачу
                        </div>
                        <div class="endpoint-item">
                            <span class="method delete">DELETE</span> /api/tasks/:id - Удалить задачу
                        </div>
                        <div class="endpoint-item">
                            <span class="method get">GET</span> /api/stats - Статистика сервера
                        </div>
                    </div>
                    
                    <div class="links">
                        <a href="/client.html" class="btn">📱 Тестовый клиент</a>
                        <a href="http://localhost:3000" class="btn">🏠 Базовый сервер</a>
                    </div>
                </div>
            </body>
            </html>
        `);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Страница не найдена' }));
    }
}

// Создаем статические файлы
function createStaticFiles() {
    const staticDir = path.join(__dirname, 'static');
    
    if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir);
    }
    
    // CSS файл
    const cssContent = `
        .custom-style {
            background: #f0f8ff;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .custom-style h2 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
    `;
    
    fs.writeFileSync(path.join(staticDir, 'style.css'), cssContent);
    
    // JS файл
    const jsContent = `
        console.log('Static files are working!');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Page loaded with static JavaScript');
        });
    `;
    
    fs.writeFileSync(path.join(staticDir, 'script.js'), jsContent);
}

// Запуск сервера
const PORT = 3001;
createStaticFiles();

const server = http.createServer(handleRequest);
server.listen(PORT, () => {
    console.log(`✅ Продвинутый сервер запущен на порту ${PORT}`);
    console.log(`📱 Откройте http://localhost:${PORT} в браузере`);
});