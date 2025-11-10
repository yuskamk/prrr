<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WelcomeController extends Controller
{
    public function index()
    {
        $data = [
            'title' => 'Добро пожаловать!',
            'message' => 'Это страница создана с использованием контроллера в Laravel',
            'features' => [
                'MVC архитектура',
                'Маршрутизация',
                'Blade шаблоны',
                'Миграции базы данных',
                'Аутентификация'
            ]
        ];
        
        return view('welcome-page', $data);
    }
}