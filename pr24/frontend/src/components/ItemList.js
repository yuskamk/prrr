import React from 'react';

const ItemList = ({ items, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!items || items.length === 0) {
    return <div className="empty">Нет элементов для отображения</div>;
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <div key={item.id} className="item-card">
          <div className="item-header">
            <h3 className={item.completed ? 'completed' : ''}>
              {item.title}
            </h3>
            <div className="item-actions">
              <button 
                onClick={() => onEdit(item)}
                className="btn-edit"
              >
                Редактировать
              </button>
              <button 
                onClick={() => onDelete(item.id)}
                className="btn-delete"
              >
                Удалить
              </button>
            </div>
          </div>
          <p className="item-description">{item.description}</p>
          <div className="item-meta">
            <span className={`status ${item.completed ? 'completed' : 'pending'}`}>
              {item.completed ? 'Выполнено' : 'В процессе'}
            </span>
            <span className="date">
              Создано: {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;