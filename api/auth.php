<?php

declare(strict_types=1);

header(
    'Content-Type: application/json; charset=UTF-8'
);

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header(
        'Access-Control-Allow-Methods: GET, POST, OPTIONS'
    );

    header(
        'Access-Control-Allow-Headers: Content-Type'
    );

    http_response_code(204);
    exit;
}

require_once __DIR__ . '/dbase.php';
require_once __DIR__ . '/helpers.php';

startSecureSession();

$action = $_GET['action'] ?? '';

/*
|--------------------------------------------------------------------------
| Verificar sessão
|--------------------------------------------------------------------------
*/

if (
    $action === 'status' &&
    $_SERVER['REQUEST_METHOD'] === 'GET'
) {
    if (empty($_SESSION['admin'])) {
        jsonResponse([
            'success' => true,
            'authenticated' => false,
        ]);
    }

    jsonResponse([
        'success' => true,
        'authenticated' => true,
        'admin' => $_SESSION['admin'],
    ]);
}

/*
|--------------------------------------------------------------------------
| Fazer login
|--------------------------------------------------------------------------
*/

if (
    $action === 'login' &&
    $_SERVER['REQUEST_METHOD'] === 'POST'
) {
    $data = readJsonBody();

    $email = normalizeEmail(
        (string) ($data['email'] ?? '')
    );

    $password =
        (string) ($data['password'] ?? '');

    if (
        !filter_var($email, FILTER_VALIDATE_EMAIL) ||
        $password === ''
    ) {
        jsonResponse(
            [
                'success' => false,
                'error' =>
                    'Informe um e-mail e uma senha válidos.',
            ],
            422
        );
    }

    try {
        $stmt = $pdo->prepare(
            'SELECT
                id,
                nome,
                email,
                senha,
                ativo
             FROM usuarios
             WHERE email = :email
             LIMIT 1'
        );

        $stmt->execute([
            ':email' => $email,
        ]);

        $admin = $stmt->fetch();

        if (
            !$admin ||
            (int) $admin['ativo'] !== 1 ||
            !password_verify(
                $password,
                $admin['senha']
            )
        ) {
            usleep(350000);

            jsonResponse(
                [
                    'success' => false,
                    'error' =>
                        'E-mail ou senha inválidos.',
                ],
                401
            );
        }

        session_regenerate_id(true);

        $_SESSION['admin'] = [
            'id' => (int) $admin['id'],
            'nome' => $admin['nome'],
            'email' => $admin['email'],
        ];

        $_SESSION['last_activity'] = time();

        $update = $pdo->prepare(
            'UPDATE usuarios
             SET ultimo_login = NOW()
             WHERE id = :id'
        );

        $update->execute([
            ':id' => $admin['id'],
        ]);

        jsonResponse([
            'success' => true,
            'message' =>
                'Login realizado com sucesso.',
            'admin' => $_SESSION['admin'],
        ]);
    } catch (Throwable $error) {
        error_log(
            'Erro no login: ' .
            $error->getMessage()
        );

        jsonResponse(
            [
                'success' => false,
                'error' =>
                    'Erro interno ao realizar login.',
            ],
            500
        );
    }
}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

if (
    $action === 'logout' &&
    $_SERVER['REQUEST_METHOD'] === 'POST'
) {
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $cookie = session_get_cookie_params();

        setcookie(
            session_name(),
            '',
            time() - 42000,
            $cookie['path'],
            $cookie['domain'],
            $cookie['secure'],
            $cookie['httponly']
        );
    }

    session_destroy();

    jsonResponse([
        'success' => true,
        'message' => 'Logout realizado com sucesso.',
    ]);
}

jsonResponse(
    [
        'success' => false,
        'error' => 'Rota não encontrada.',
    ],
    404
);