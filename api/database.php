<?php

$host = 'localhost';
$dbname = 'u557098152_newsletter_db';
$user = 'u557098152_u557098152_';
$pass = 'Passwordzx090@';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    throw new Exception('Falha na conexão MySQL: ' . $e->getMessage());
}