<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WelcomeController;

Route::get('/', function () {
    return view('welcome');
});

// Простой маршрут
Route::get('/hello', function () {
    return 'Привет, мир!';
});

// Маршрут с параметром
Route::get('/hello/{name}', function ($name) {
    return 'Привет, ' . $name . '!';
});

// Маршрут для Blade шаблона
Route::get('/greeting', function () {
    return view('greeting', [
        'name' => 'Студент',
        'courses' => ['PHP', 'Laravel', 'Базы данных', 'Веб-разработка']
    ]);
});

// Маршрут с контроллером (дополнительно)
Route::get('/welcome', [WelcomeController::class, 'index']);