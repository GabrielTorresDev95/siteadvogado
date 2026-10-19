<?php

declare(strict_types=1);

function jsonResponse(
    array $data,
    int $statusCode = 200
): never {
    http_response_code($statusCode);

    header(
        'Content-Type: application/json; charset=UTF-8'
    );

    echo json_encode(
        $data,
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES
    );

    exit;
}

function readJsonBody(): array
{
    $body = file_get_contents('php://input');

    if ($body === false || trim($body) === '') {
        return [];
    }

    $data = json_decode($body, true);

    if (!is_array($data)) {
        jsonResponse(
            [
                'success' => false,
                'error' => 'Dados JSON inválidos.',
            ],
            400
        );
    }

    return $data;
}

function startSecureSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isHttps =
        !empty($_SERVER['HTTPS']) &&
        $_SERVER['HTTPS'] !== 'off';

    session_name('baruk_admin_session');

    session_set_cookie_params([
        'lifetime' => 7200,
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();

    if (
        isset($_SESSION['last_activity']) &&
        time() - $_SESSION['last_activity'] > 7200
    ) {
        $_SESSION = [];

        session_destroy();

        session_start();
    }

    $_SESSION['last_activity'] = time();
}

function normalizeEmail(string $email): string
{
    return mb_strtolower(trim($email));
}