<?php
// Подключение к базе данных с использованием PDO
function getDBConnection() {
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=test', 'username', 'password');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die("Ошибка подключения: " . $e->getMessage());
    }
}

// Безопасное получение данных пользователя
function getUserInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Отделение логики от представления
function displayUsers($users) {
    echo "<!DOCTYPE html>
    <html>
    <head>
        <title>Список пользователей</title>
    </head>
    <body>
        <h1>Пользователи</h1>
        <table border='1'>
            <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Email</th>
            </tr>";
    
    foreach ($users as $user) {
        echo "<tr>
                <td>" . getUserInput($user['id']) . "</td>
                <td>" . getUserInput($user['name']) . "</td>
                <td>" . getUserInput($user['email']) . "</td>
              </tr>";
    }
    
    echo "</table>
    </body>
    </html>";
}

// Основная логика
try {
    $pdo = getDBConnection();
    
    // Безопасный SQL запрос с подготовленными выражениями
    $stmt = $pdo->prepare("SELECT id, name, email FROM users");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::ASSOC);
    
    displayUsers($users);
    
} catch (PDOException $e) {
    echo "Ошибка выполнения запроса: " . $e->getMessage();
}
?>