<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/dbase.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'error' => 'Dados inválidos.'
    ]);
    exit();
}

/*
|--------------------------------------------------------------------------
| NEWSLETTER
|--------------------------------------------------------------------------
*/
if (isset($data['newsletter']) && $data['newsletter'] === true) {

    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);

    if (!$email) {
        echo json_encode([
            'success' => false,
            'error' => 'Email inválido.'
        ]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO newsletter (email)
            VALUES (:email)
        ");

        $stmt->execute([
            ':email' => $email
        ]);

    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode([
                'success' => false,
                'error' => 'Este email já está cadastrado.'
            ]);
            exit();
        }

        echo json_encode([
            'success' => false,
            'error' => 'Erro ao salvar email no banco.'
        ]);
        exit();
    }

    $to = 'advjaderwindson@gmail.com';
    $subject = 'Novo cadastro na Newsletter';

    $body = "
Novo email cadastrado na newsletter:

{$email}
";

    $headers  = "From: Baruk Registro <contato@barukregistra.com.br>\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    mail($to, $subject, $body, $headers);

    echo json_encode([
        'success' => true,
        'message' => 'Email cadastrado com sucesso.'
    ]);

    exit();
}

/*
|--------------------------------------------------------------------------
| FORMULÁRIO DE CONTATO
|--------------------------------------------------------------------------
*/

$name     = trim($data['name'] ?? '');
$email    = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$whatsapp = trim($data['whatsapp'] ?? '');
$service  = trim($data['service'] ?? '');
$message  = trim($data['message'] ?? 'Não informado');

if (!$name || !$email || !$whatsapp || !$service) {
    echo json_encode([
        'success' => false,
        'error' => 'Preencha todos os campos obrigatórios.'
    ]);
    exit();
}

$to = 'advjaderwindson@gmail.com';

$subject = "Nova consulta pelo site - {$service}";

$body = "
Nova mensagem recebida pelo site Baruk Registro

Nome:
{$name}

Email do cliente:
{$email}

WhatsApp:
{$whatsapp}

Serviço:
{$service}

Mensagem:
{$message}
";

$headers  = "From: Baruk Registro <contato@barukregistra.com.br>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Mensagem enviada com sucesso.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao enviar mensagem.'
    ]);
}