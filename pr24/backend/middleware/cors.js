const cors = require('cors');

// Настройка CORS для различных окружений
const corsOptions = {
  origin: function (origin, callback) {
    // Разрешаем запросы из всех источников в разработке
    // В production нужно указать конкретные домены
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // В production разрешаем только определенные домены
      const allowedOrigins = [
        'https://yourdomain.com',
        'https://www.yourdomain.com'
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = cors(corsOptions);