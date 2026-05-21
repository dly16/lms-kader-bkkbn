<?php
// ============================================
// DB.PHP - MySQL Connection Configuration
// ============================================

$host = 'localhost';
$user = 'root';
$pass = ''; // Kosongkan jika menggunakan XAMPP default
$db   = 'lms_kader';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Koneksi database gagal: ' . $conn->connect_error
    ]));
}

// Set charset ke utf8mb4 agar mendukung karakter khusus
$conn->set_charset("utf8mb4");
?>
