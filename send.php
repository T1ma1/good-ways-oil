<?php
// Приём заявок и заказов с сайта: письмо на почту отдела продаж. Работает на хостинге с PHP (Beget).
// На хостинге проверить один раз: отправить тестовую заявку и убедиться, что письмо пришло.
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$to = 'oils@good-ways.ru';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'fetch') {
    http_response_code(405);
    exit(json_encode(['ok' => false]));
}
$clean = static function ($v, $max) {
    $v = trim(str_replace(["\r", "\0"], '', (string)$v));
    return mb_substr($v, 0, $max);
};
$name    = $clean($_POST['name'] ?? '', 120);
$phone   = $clean($_POST['phone'] ?? '', 40);
$email   = $clean($_POST['email'] ?? '', 120);
$subject = $clean($_POST['subject'] ?? 'Заявка с сайта', 120);
$body    = $clean($_POST['body'] ?? '', 8000);

if ($name === '' || strlen(preg_replace('/\D/', '', $phone)) < 10 || $body === '') {
    http_response_code(422);
    exit(json_encode(['ok' => false]));
}
$subject = str_replace("\n", ' ', $subject);
$host = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'good-ways-oil.ru');
$headers = [
    'From: Сайт Good Ways Oil <no-reply@' . $host . '>',
    'Content-Type: text/plain; charset=utf-8',
];
if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . $email;
}
$ok = mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
echo json_encode(['ok' => (bool)$ok]);
