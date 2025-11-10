<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p>{{ $message }}</p>
    
    <h2>Возможности Laravel:</h2>
    <ul>
        @foreach($features as $feature)
            <li>{{ $feature }}</li>
        @endforeach
    </ul>
</body>
</html>