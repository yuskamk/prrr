// Middleware для проверки ролей
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Недостаточно прав для выполнения операции' 
      });
    }

    next();
  };
};

// Конкретные middleware для ролей
const requireAdmin = requireRole(['admin']);
const requireUser = requireRole(['user', 'admin']);

module.exports = {
  requireRole,
  requireAdmin,
  requireUser
};