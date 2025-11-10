<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Приветствие - Laravel</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .course-list {
            list-style-type: none;
            padding: 0;
        }
        .course-item {
            background: #ecf0f1;
            margin: 5px 0;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }
        .info-box {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Добро пожаловать в Laravel, {{ $name }}!</h1>
        
        <div class="info-box">
            <h3>Информация о системе:</h3>
            <p><strong>PHP версия:</strong> {{ PHP_VERSION }}</p>
            <p><strong>Laravel версия:</strong> {{ app()->version() }}</p>
            <p><strong>Текущее время:</strong> {{ now()->format('d.m.Y H:i:s') }}</p>
        </div>

        <h2>Курсы для изучения:</h2>
        <ul class="course-list">
            @foreach($courses as $course)
                <li class="course-item">{{ $loop->iteration }}. {{ $course }}</li>
            @endforeach
        </ul>

        <h2>Навигация:</h2>
        <p>
            <a href="/">Главная страница</a> | 
            <a href="/hello">Простой маршрут</a> | 
            <a href="/hello/Иван">Маршрут с параметром</a>
        </p>
    </div>
</body>
</html>