import React, { useState, useEffect } from 'react';
import { itemService } from './services/api';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Загрузка элементов при монтировании
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await itemService.getAll();
      setItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    setFormLoading(true);
    setError('');
    try {
      await itemService.create(formData);
      setSuccess('Элемент успешно создан');
      setShowForm(false);
      await loadItems(); // Перезагружаем список
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setFormLoading(true);
    setError('');
    try {
      await itemService.update(editingItem.id, formData);
      setSuccess('Элемент успешно обновлен');
      setEditingItem(null);
      setShowForm(false);
      await loadItems(); // Перезагружаем список
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
      return;
    }

    setError('');
    try {
      // Оптимистичное обновление
      const itemToDelete = items.find(item => item.id === id);
      setItems(prev => prev.filter(item => item.id !== id));

      await itemService.delete(id);
      setSuccess('Элемент успешно удален');
    } catch (err) {
      // Откат при ошибке
      await loadItems();
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      handleUpdate(formData);
    } else {
      handleCreate(formData);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // Очистка сообщений через 5 секунд
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Управление задачами</h1>
        <p>Интеграция React фронтенда с Express бэкендом</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="alert error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert success">
            {success}
          </div>
        )}

        <div className="toolbar">
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary"
            disabled={showForm}
          >
            Создать новую задачу
          </button>
          
          <button 
            onClick={loadItems}
            className="btn-secondary"
            disabled={loading}
          >
            {loading ? 'Обновление...' : 'Обновить список'}
          </button>
        </div>

        {showForm && (
          <div className="form-section">
            <h2>{editingItem ? 'Редактирование задачи' : 'Создание новой задачи'}</h2>
            <ItemForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              initialData={editingItem}
              loading={formLoading}
            />
          </div>
        )}

        <div className="list-section">
          <h2>Список задач ({items.length})</h2>
          <ItemList
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}

export default App;