-- ============================================
-- DATABASE SCHEMA FOR LMS KADER BKKBN (UPDATED)
-- ============================================

CREATE DATABASE IF NOT EXISTS lms_kader;
USE lms_kader;

-- 1. Tabel Users (Admin & Kader)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'kader') DEFAULT 'kader',
    name VARCHAR(100) NOT NULL,
    nik VARCHAR(20) UNIQUE,
    desa VARCHAR(100),
    kecamatan VARCHAR(100),
    kabupaten VARCHAR(100),
    no_hp VARCHAR(20),
    avatar LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Courses (Materi Pelatihan)
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    duration VARCHAR(50),
    passing_grade INT DEFAULT 70,
    read_timer INT DEFAULT 15,
    use_question_bank TINYINT(1) DEFAULT 1,
    pre_test_count INT DEFAULT 5,
    post_test_count INT DEFAULT 5,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Modules (Modul Pembelajaran)
CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content LONGTEXT, -- Menyimpan slide/video/iframe data dalam format JSON
    order_num INT DEFAULT 1,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Questions (Bank Soal / Soal Kursus)
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    type ENUM('pre', 'post') NOT NULL,
    is_bank TINYINT(1) DEFAULT 0, -- 0 untuk soal statis kursus, 1 untuk bank soal acak
    question TEXT NOT NULL,
    options LONGTEXT NOT NULL, -- Menyimpan pilihan jawaban dalam format JSON
    answer INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Enrollments (Nilai & Progres)
CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    progress INT DEFAULT 0,
    pre_test_score INT DEFAULT NULL,
    post_test_score INT DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'active',
    cert_number VARCHAR(50) DEFAULT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabel Announcements (Pengumuman)
CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabel Settings (Konfigurasi Global, e.g., Template Sertifikat)
CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(50) PRIMARY KEY,
    `value` LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Awal (Seed) untuk Administrator
INSERT IGNORE INTO users (id, username, password, role, name, nik) VALUES 
('admin1', 'Adminsulbar', 'BKKBN666803', 'admin', 'Administrator Sulawesi Barat', '0000000000000000');
