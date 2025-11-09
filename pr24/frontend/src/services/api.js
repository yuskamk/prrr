import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Сервер ответил с статусом ошибки
      const message = error.response.data?.message || 'Произошла ошибка сервера';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      return Promise.reject(new Error('Нет соединения с сервером'));
    } else {
      // Что-то пошло не так при настройке запроса
      return Promise.reject(new Error('Ошибка при настройке запроса'));
    }
  }
);

// CRUD операции
export const itemService = {
  // Получить все элементы
  getAll: async () => {
    const response = await api.get('/items');
    return response.data;
  },

  // Получить элемент по ID
  getById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // Создать новый элемент
  create: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  // Обновить элемент
  update: async (id, itemData) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  // Удалить элемент
  delete: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};

export default api;