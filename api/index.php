<?php
// ============================================
// INDEX.PHP - Main API Handler (Universal MySQL)
// ============================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Handle file uploads (multipart/form-data)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $fileInfo = pathinfo($_FILES['file']['name']);
    $extension = strtolower($fileInfo['extension'] ?? '');
    $allowedExtensions = array('pdf', 'ppt', 'pptx', 'jpg', 'jpeg', 'png');
    
    if (!in_array($extension, $allowedExtensions)) {
        echo json_encode(['success' => false, 'message' => 'Format file tidak didukung! Gunakan PDF, PPT, PPTX, JPG, atau PNG.']);
        exit;
    }
    
    // Validate file size (max 5MB)
    if ($_FILES['file']['size'] > 5 * 1024 * 1024) {
        echo json_encode(['success' => false, 'message' => 'Ukuran file terlalu besar! Maksimal 5MB.']);
        exit;
    }
    
    // Sanitize filename and make unique
    $safeName = time() . '_' . preg_replace("/[^a-zA-Z0-9\._-]/", "", $fileInfo['filename'] ?? 'file') . '.' . $extension;
    $targetFilePath = $uploadDir . $safeName;
    
    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)) {
        echo json_encode([
            'success' => true,
            'filePath' => 'api/' . $targetFilePath,
            'fileName' => $_FILES['file']['name']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan file di server.']);
    }
    exit;
}

require_once 'db.php';

$input = file_get_contents('php://input');
$request = json_decode($input, true);

if (!$request || !isset($request['type'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$type = $request['type'];
$payload = $request['payload'] ?? null;

switch ($type) {
    case 'GET_INITIAL_DATA':
        getInitialData();
        break;

    case 'SYNC_ALL_FROM_LOCAL':
        syncAllFromLocal($payload);
        break;

    case 'PENDAFTARAN': // Alias untuk SAVE_USER
    case 'SAVE_USER':
        saveUser($payload);
        break;

    case 'HAPUS_KADER': // Alias untuk DELETE_USER
    case 'DELETE_USER':
        deleteUser($payload);
        break;

    case 'SAVE_COURSE':
        saveCourse($payload);
        break;

    case 'DELETE_COURSE':
        deleteCourse($payload);
        break;

    case 'SAVE_MODULE':
        saveModule($payload);
        break;

    case 'DELETE_MODULE':
        deleteModule($payload);
        break;

    case 'SAVE_QUESTION':
        saveQuestion($payload);
        break;

    case 'DELETE_QUESTION':
        deleteQuestion($payload);
        break;

    case 'NILAI_QUIZ': // Alias untuk SAVE_ENROLLMENT
    case 'SAVE_ENROLLMENT':
        saveEnrollment($payload);
        break;

    case 'SAVE_ANNOUNCEMENT':
        saveAnnouncement($payload);
        break;

    case 'DELETE_ANNOUNCEMENT':
        deleteAnnouncement($payload);
        break;

    case 'SAVE_SETTING':
        saveSetting($payload);
        break;

    case 'SYNC_QUESTION_BANK':
        syncQuestionBank($payload);
        break;

    case 'SYNC_ANNOUNCEMENTS':
        syncAnnouncements($payload);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Unknown request type: ' . $type]);
        break;
}

// --- FUNGSI HANDLER ---

function syncAnnouncements($payload) {
    global $conn;
    $conn->begin_transaction();
    try {
        $conn->query("SET FOREIGN_KEY_CHECKS = 0");
        $conn->query("TRUNCATE TABLE announcements");
        $conn->query("SET FOREIGN_KEY_CHECKS = 1");
        if ($payload && is_array($payload)) {
            $stmt = $conn->prepare("INSERT INTO announcements (id, title, content, author, date_created) VALUES (?, ?, ?, ?, ?)");
            foreach ($payload as $a) {
                $created = isset($a['date']) ? date('Y-m-d H:i:s', strtotime($a['date'])) : date('Y-m-d H:i:s');
                $stmt->bind_param("sssss", $a['id'], $a['title'], $a['content'], $a['author'], $created);
                $stmt->execute();
            }
        }
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Announcements synced successfully']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Failed to sync announcements: ' . $e->getMessage()]);
    }
}

function syncQuestionBank($payload) {
    global $conn;
    $conn->begin_transaction();
    try {
        $conn->query("DELETE FROM questions WHERE is_bank = 1");
        if ($payload && is_array($payload)) {
            $stmt = $conn->prepare("INSERT INTO questions (id, course_id, type, is_bank, question, options, answer) VALUES (?, ?, ?, 1, ?, ?, ?)");
            foreach ($payload as $qb) {
                $courseId = $qb['courseId'];
                if (isset($qb['preTest'])) {
                    $type = 'pre';
                    foreach ($qb['preTest'] as $q) {
                        $qOpts = json_encode($q['options']);
                        $stmt->bind_param("sssssi", $q['id'], $courseId, $type, $q['question'], $qOpts, $q['answer']);
                        $stmt->execute();
                    }
                }
                if (isset($qb['postTest'])) {
                    $type = 'post';
                    foreach ($qb['postTest'] as $q) {
                        $qOpts = json_encode($q['options']);
                        $stmt->bind_param("sssssi", $q['id'], $courseId, $type, $q['question'], $qOpts, $q['answer']);
                        $stmt->execute();
                    }
                }
            }
        }
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Question bank synced successfully']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Failed to sync question bank: ' . $e->getMessage()]);
    }
}

function getInitialData() {
    global $conn;
    
    // 1. Fetch Users
    $resUsers = $conn->query("SELECT * FROM users");
    $users = [];
    while ($r = $resUsers->fetch_assoc()) {
        $users[] = [
            'id' => $r['id'],
            'username' => $r['username'],
            'password' => $r['password'],
            'role' => $r['role'],
            'name' => $r['name'],
            'nik' => $r['nik'],
            'desa' => $r['desa'],
            'kecamatan' => $r['kecamatan'],
            'kabupaten' => $r['kabupaten'],
            'noHp' => $r['no_hp'],
            'avatar' => $r['avatar'],
            'createdAt' => $r['created_at']
        ];
    }

    // 2. Fetch Courses, Modules, Questions
    $resCourses = $conn->query("SELECT * FROM courses");
    $courses = [];
    while ($r = $resCourses->fetch_assoc()) {
        $courseId = $r['id'];
        
        // Fetch modules for this course
        $resModules = $conn->query("SELECT * FROM modules WHERE course_id = '$courseId' ORDER BY order_num ASC");
        $modules = [];
        while ($m = $resModules->fetch_assoc()) {
            $modules[] = [
                'id' => $m['id'],
                'title' => $m['title'],
                'type' => $m['type'],
                'content' => json_decode($m['content'], true),
                'order' => (int)$m['order_num']
            ];
        }

        // Fetch questions for this course (is_bank = 0)
        $resPre = $conn->query("SELECT * FROM questions WHERE course_id = '$courseId' AND type = 'pre' AND is_bank = 0");
        $preTest = [];
        while ($q = $resPre->fetch_assoc()) {
            $preTest[] = [
                'id' => $q['id'],
                'question' => $q['question'],
                'options' => json_decode($q['options'], true),
                'answer' => (int)$q['answer']
            ];
        }

        $resPost = $conn->query("SELECT * FROM questions WHERE course_id = '$courseId' AND type = 'post' AND is_bank = 0");
        $postTest = [];
        while ($q = $resPost->fetch_assoc()) {
            $postTest[] = [
                'id' => $q['id'],
                'question' => $q['question'],
                'options' => json_decode($q['options'], true),
                'answer' => (int)$q['answer']
            ];
        }

        $courses[] = [
            'id' => $r['id'],
            'title' => $r['title'],
            'description' => $r['description'],
            'thumbnail' => '',
            'category' => $r['category'],
            'duration' => $r['duration'],
            'totalModules' => count($modules),
            'passingGrade' => (int)$r['passing_grade'],
            'readTimer' => (int)$r['read_timer'],
            'useQuestionBank' => (int)$r['use_question_bank'] ? true : false,
            'preTestCount' => (int)$r['pre_test_count'],
            'postTestCount' => (int)$r['post_test_count'],
            'status' => $r['status'],
            'createdAt' => $r['created_at'],
            'modules' => $modules,
            'preTest' => $preTest,
            'postTest' => $postTest
        ];
    }

    // 3. Fetch Question Bank (is_bank = 1)
    $resQB = $conn->query("SELECT * FROM questions WHERE is_bank = 1");
    $qbData = [];
    while ($q = $resQB->fetch_assoc()) {
        $cId = $q['course_id'];
        if (!isset($qbData[$cId])) {
            $qbData[$cId] = [
                'courseId' => $cId,
                'preTest' => [],
                'postTest' => []
            ];
        }
        $qObj = [
            'id' => $q['id'],
            'question' => $q['question'],
            'options' => json_decode($q['options'], true),
            'answer' => (int)$q['answer']
        ];
        if ($q['type'] == 'pre') {
            $qbData[$cId]['preTest'][] = $qObj;
        } else {
            $qbData[$cId]['postTest'][] = $qObj;
        }
    }
    $questionBank = array_values($qbData);

    // 4. Fetch Enrollments
    $resEnrolls = $conn->query("SELECT * FROM enrollments");
    $enrollments = [];
    while ($r = $resEnrolls->fetch_assoc()) {
        $enrollments[] = [
            'id' => $r['id'],
            'userId' => $r['user_id'],
            'courseId' => $r['course_id'],
            'progress' => (int)$r['progress'],
            'preTestScore' => $r['pre_test_score'] !== null ? (int)$r['pre_test_score'] : null,
            'postTestScore' => $r['post_test_score'] !== null ? (int)$r['post_test_score'] : null,
            'status' => $r['status'],
            'certNumber' => $r['cert_number'],
            'startedAt' => $r['started_at'],
            'completedAt' => $r['completed_at']
        ];
    }

    // 5. Fetch Announcements
    $resAnns = $conn->query("SELECT * FROM announcements ORDER BY date_created DESC");
    $announcements = [];
    while ($r = $resAnns->fetch_assoc()) {
        $announcements[] = [
            'id' => $r['id'],
            'title' => $r['title'],
            'content' => $r['content'],
            'author' => $r['author'],
            'date' => $r['date_created']
        ];
    }

    // 6. Fetch settings
    $resSettings = $conn->query("SELECT * FROM settings WHERE `key` = 'lms_cert_template'");
    $certTemplate = null;
    if ($r = $resSettings->fetch_assoc()) {
        $certTemplate = json_decode($r['value'], true);
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'users' => $users,
            'courses' => $courses,
            'questionBank' => $questionBank,
            'enrollments' => $enrollments,
            'announcements' => $announcements,
            'certTemplate' => $certTemplate
        ]
    ]);
}

function syncAllFromLocal($payload) {
    global $conn;
    $conn->begin_transaction();
    try {
        $conn->query("SET FOREIGN_KEY_CHECKS = 0");
        $conn->query("TRUNCATE TABLE users");
        $conn->query("TRUNCATE TABLE courses");
        $conn->query("TRUNCATE TABLE modules");
        $conn->query("TRUNCATE TABLE questions");
        $conn->query("TRUNCATE TABLE enrollments");
        $conn->query("TRUNCATE TABLE announcements");
        $conn->query("TRUNCATE TABLE settings");
        $conn->query("SET FOREIGN_KEY_CHECKS = 1");

        // Users
        if (isset($payload['users'])) {
            $stmt = $conn->prepare("INSERT INTO users (id, username, password, role, name, nik, desa, kecamatan, kabupaten, no_hp, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($payload['users'] as $u) {
                $created = isset($u['createdAt']) ? date('Y-m-d H:i:s', strtotime($u['createdAt'])) : date('Y-m-d H:i:s');
                $no_hp = $u['noHp'] ?? '';
                $stmt->bind_param("ssssssssssss", $u['id'], $u['username'], $u['password'], $u['role'], $u['name'], $u['nik'], $u['desa'], $u['kecamatan'], $u['kabupaten'], $no_hp, $u['avatar'], $created);
                $stmt->execute();
            }
        }

        // Courses & Modul & Soal
        if (isset($payload['courses'])) {
            $stmtCourse = $conn->prepare("INSERT INTO courses (id, title, description, category, duration, passing_grade, read_timer, use_question_bank, pre_test_count, post_test_count, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmtModule = $conn->prepare("INSERT INTO modules (id, course_id, title, type, content, order_num) VALUES (?, ?, ?, ?, ?, ?)");
            $stmtQuest = $conn->prepare("INSERT INTO questions (id, course_id, type, is_bank, question, options, answer) VALUES (?, ?, ?, ?, ?, ?, ?)");

            foreach ($payload['courses'] as $c) {
                $created = isset($c['createdAt']) ? date('Y-m-d H:i:s', strtotime($c['createdAt'])) : date('Y-m-d H:i:s');
                $use_qb = isset($c['useQuestionBank']) ? ($c['useQuestionBank'] ? 1 : 0) : 1;
                $pre_count = $c['preTestCount'] ?? 5;
                $post_count = $c['postTestCount'] ?? 5;
                $read_timer = $c['readTimer'] ?? 15;
                $stmtCourse->bind_param("sssssiiiiiss", $c['id'], $c['title'], $c['description'], $c['category'], $c['duration'], $c['passingGrade'], $read_timer, $use_qb, $pre_count, $post_count, $c['status'], $created);
                $stmtCourse->execute();

                if (isset($c['modules'])) {
                    foreach ($c['modules'] as $m) {
                        $mContent = json_encode($m['content']);
                        $stmtModule->bind_param("sssssi", $m['id'], $c['id'], $m['title'], $m['type'], $mContent, $m['order']);
                        $stmtModule->execute();
                    }
                }

                if (isset($c['preTest'])) {
                    $is_bank = 0;
                    $type = 'pre';
                    foreach ($c['preTest'] as $q) {
                        $qOpts = json_encode($q['options']);
                        $stmtQuest->bind_param("ssssssi", $q['id'], $c['id'], $type, $is_bank, $q['question'], $qOpts, $q['answer']);
                        $stmtQuest->execute();
                    }
                }

                if (isset($c['postTest'])) {
                    $is_bank = 0;
                    $type = 'post';
                    foreach ($c['postTest'] as $q) {
                        $qOpts = json_encode($q['options']);
                        $stmtQuest->bind_param("ssssssi", $q['id'], $c['id'], $type, $is_bank, $q['question'], $qOpts, $q['answer']);
                        $stmtQuest->execute();
                    }
                }
            }
        }

        // Question Bank
        if (isset($payload['questionBank'])) {
            $stmtQuest = $conn->prepare("INSERT INTO questions (id, course_id, type, is_bank, question, options, answer) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $is_bank = 1;
            foreach ($payload['questionBank'] as $qb) {
                $courseId = $qb['courseId'];
                if (isset($qb['preTest'])) {
                    $type = 'pre';
                    foreach ($qb['preTest'] as $q) {
                        $qOpts = json_encode($q['options']);
                        $stmtQuest->bind_param("ssssssi", $q['id'], $courseId, $type, $is_bank, $q['question'], $qOpts, $q['answer']);
                        $stmtQuest->execute();
                    }
                }
                if (isset($qb['postTest'])) {
                    $type = 'post';
                    foreach ($qb['postTest'] as $q) {
                        $qOpts = json_encode($q['options']);
                        $stmtQuest->bind_param("ssssssi", $q['id'], $courseId, $type, $is_bank, $q['question'], $qOpts, $q['answer']);
                        $stmtQuest->execute();
                    }
                }
            }
        }

        // Enrollments
        if (isset($payload['enrollments'])) {
            $stmtEnroll = $conn->prepare("INSERT INTO enrollments (id, user_id, course_id, progress, pre_test_score, post_test_score, status, cert_number, started_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($payload['enrollments'] as $e) {
                $started = isset($e['startedAt']) ? date('Y-m-d H:i:s', strtotime($e['startedAt'])) : date('Y-m-d H:i:s');
                $completed = isset($e['completedAt']) ? date('Y-m-d H:i:s', strtotime($e['completedAt'])) : null;
                $stmtEnroll->bind_param("sssiisssss", $e['id'], $e['userId'], $e['courseId'], $e['progress'], $e['preTestScore'], $e['postTestScore'], $e['status'], $e['certNumber'], $started, $completed);
                $stmtEnroll->execute();
            }
        }

        // Announcements
        if (isset($payload['announcements'])) {
            $stmtAnn = $conn->prepare("INSERT INTO announcements (id, title, content, author, date_created) VALUES (?, ?, ?, ?, ?)");
            foreach ($payload['announcements'] as $a) {
                $created = isset($a['date']) ? date('Y-m-d H:i:s', strtotime($a['date'])) : date('Y-m-d H:i:s');
                $stmtAnn->bind_param("sssss", $a['id'], $a['title'], $a['content'], $a['author'], $created);
                $stmtAnn->execute();
            }
        }

        // Settings
        if (isset($payload['certTemplate']) && !empty($payload['certTemplate'])) {
            $val = json_encode($payload['certTemplate']);
            $stmtSet = $conn->prepare("INSERT INTO settings (`key`, `value`) VALUES ('lms_cert_template', ?) ON DUPLICATE KEY UPDATE `value` = ?");
            $stmtSet->bind_param("ss", $val, $val);
            $stmtSet->execute();
        }

        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Sync all data successfully']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Sync failed: ' . $e->getMessage()]);
    }
}

function saveUser($p) {
    global $conn;
    $no_hp = $p['noHp'] ?? '';
    $stmt = $conn->prepare("INSERT INTO users (id, username, password, role, name, nik, desa, kecamatan, kabupaten, no_hp, avatar) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                           ON DUPLICATE KEY UPDATE 
                           username = ?, password = ?, role = ?, name = ?, nik = ?, desa = ?, kecamatan = ?, kabupaten = ?, no_hp = ?, avatar = ?");
    $stmt->bind_param("sssssssssssssssssssss", 
        $p['id'], $p['username'], $p['password'], $p['role'], $p['name'], $p['nik'], $p['desa'], $p['kecamatan'], $p['kabupaten'], $no_hp, $p['avatar'],
        $p['username'], $p['password'], $p['role'], $p['name'], $p['nik'], $p['desa'], $p['kecamatan'], $p['kabupaten'], $no_hp, $p['avatar']
    );
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save user: ' . $stmt->error]);
    }
}

function deleteUser($p) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ? OR nik = ?");
    $id = $p['id'] ?? '';
    $nik = $p['nik'] ?? '';
    $stmt->bind_param("ss", $id, $nik);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
    }
}

function saveCourse($p) {
    global $conn;
    $use_qb = isset($p['useQuestionBank']) ? ($p['useQuestionBank'] ? 1 : 0) : 1;
    $pre_count = $p['preTestCount'] ?? 5;
    $post_count = $p['postTestCount'] ?? 5;
    $read_timer = $p['readTimer'] ?? 15;
    
    $stmt = $conn->prepare("INSERT INTO courses (id, title, description, category, duration, passing_grade, read_timer, use_question_bank, pre_test_count, post_test_count, status) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                           ON DUPLICATE KEY UPDATE 
                           title = ?, description = ?, category = ?, duration = ?, passing_grade = ?, read_timer = ?, use_question_bank = ?, pre_test_count = ?, post_test_count = ?, status = ?");
    
    $stmt->bind_param("sssssssssssssssssssss", 
        $p['id'], $p['title'], $p['description'], $p['category'], $p['duration'], $p['passingGrade'], $read_timer, $use_qb, $pre_count, $post_count, $p['status'],
        $p['title'], $p['description'], $p['category'], $p['duration'], $p['passingGrade'], $read_timer, $use_qb, $pre_count, $post_count, $p['status']
    );
    
    if ($stmt->execute()) {
        // Also save preTest and postTest questions inside the payload if they are provided
        if (isset($p['preTest'])) {
            $is_bank = 0; $type = 'pre';
            foreach ($p['preTest'] as $q) {
                $qOpts = json_encode($q['options']);
                $st = $conn->prepare("INSERT INTO questions (id, course_id, type, is_bank, question, options, answer) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE type=?, is_bank=?, question=?, options=?, answer=?");
                $st->bind_param("ssssssssssss", $q['id'], $p['id'], $type, $is_bank, $q['question'], $qOpts, $q['answer'], $type, $is_bank, $q['question'], $qOpts, $q['answer']);
                $st->execute();
            }
        }
        if (isset($p['postTest'])) {
            $is_bank = 0; $type = 'post';
            foreach ($p['postTest'] as $q) {
                $qOpts = json_encode($q['options']);
                $st = $conn->prepare("INSERT INTO questions (id, course_id, type, is_bank, question, options, answer) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE type=?, is_bank=?, question=?, options=?, answer=?");
                $st->bind_param("ssssssssssss", $q['id'], $p['id'], $type, $is_bank, $q['question'], $qOpts, $q['answer'], $type, $is_bank, $q['question'], $qOpts, $q['answer']);
                $st->execute();
            }
        }
        if (isset($p['modules'])) {
            foreach ($p['modules'] as $m) {
                $mContent = json_encode($m['content']);
                $st = $conn->prepare("INSERT INTO modules (id, course_id, title, type, content, order_num) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=?, type=?, content=?, order_num=?");
                $st->bind_param("ssssssssss", $m['id'], $p['id'], $m['title'], $m['type'], $mContent, $m['order'], $m['title'], $m['type'], $mContent, $m['order']);
                $st->execute();
            }
        }

        echo json_encode(['success' => true, 'message' => 'Course saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save course: ' . $stmt->error]);
    }
}

function deleteCourse($p) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM courses WHERE id = ?");
    $stmt->bind_param("s", $p['id']);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Course deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete course']);
    }
}

function saveModule($p) {
    global $conn;
    $content = json_encode($p['content']);
    $stmt = $conn->prepare("INSERT INTO modules (id, course_id, title, type, content, order_num) 
                           VALUES (?, ?, ?, ?, ?, ?) 
                           ON DUPLICATE KEY UPDATE 
                           title = ?, type = ?, content = ?, order_num = ?");
    $stmt->bind_param("ssssssssss", 
        $p['id'], $p['courseId'], $p['title'], $p['type'], $content, $p['order'],
        $p['title'], $p['type'], $content, $p['order']
    );
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Module saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save module: ' . $stmt->error]);
    }
}

function deleteModule($p) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM modules WHERE id = ?");
    $stmt->bind_param("s", $p['id']);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Module deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete module']);
    }
}

function saveQuestion($p) {
    global $conn;
    $opts = json_encode($p['options']);
    $is_bank = isset($p['isBank']) ? (int)$p['isBank'] : 0;
    
    $stmt = $conn->prepare("INSERT INTO questions (id, course_id, type, is_bank, question, options, answer) 
                           VALUES (?, ?, ?, ?, ?, ?, ?) 
                           ON DUPLICATE KEY UPDATE 
                           type = ?, is_bank = ?, question = ?, options = ?, answer = ?");
    
    $stmt->bind_param("ssssssssssss", 
        $p['id'], $p['courseId'], $p['type'], $is_bank, $p['question'], $opts, $p['answer'],
        $p['type'], $is_bank, $p['question'], $opts, $p['answer']
    );
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Question saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save question: ' . $stmt->error]);
    }
}

function deleteQuestion($p) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM questions WHERE id = ?");
    $stmt->bind_param("s", $p['id']);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Question deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete question']);
    }
}

function saveEnrollment($p) {
    global $conn;
    $pre = isset($p['preTestScore']) ? $p['preTestScore'] : null;
    $post = isset($p['postTestScore']) ? $p['postTestScore'] : null;
    $started = isset($p['startedAt']) ? date('Y-m-d H:i:s', strtotime($p['startedAt'])) : date('Y-m-d H:i:s');
    $completed = isset($p['completedAt']) ? date('Y-m-d H:i:s', strtotime($p['completedAt'])) : null;
    $cert = $p['certNumber'] ?? null;
    
    $stmt = $conn->prepare("INSERT INTO enrollments (id, user_id, course_id, progress, pre_test_score, post_test_score, status, cert_number, started_at, completed_at) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                           ON DUPLICATE KEY UPDATE 
                           progress = ?, pre_test_score = ?, post_test_score = ?, status = ?, cert_number = ?, started_at = ?, completed_at = ?");
    
    $stmt->bind_param("sssssssssssssssss", 
        $p['id'], $p['userId'], $p['courseId'], $p['progress'], $pre, $post, $p['status'], $cert, $started, $completed,
        $p['progress'], $pre, $post, $p['status'], $cert, $started, $completed
    );
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Enrollment saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save enrollment: ' . $stmt->error]);
    }
}

function saveAnnouncement($p) {
    global $conn;
    $created = isset($p['date']) ? date('Y-m-d H:i:s', strtotime($p['date'])) : date('Y-m-d H:i:s');
    $stmt = $conn->prepare("INSERT INTO announcements (id, title, content, author, date_created) 
                           VALUES (?, ?, ?, ?, ?) 
                           ON DUPLICATE KEY UPDATE 
                           title = ?, content = ?, author = ?, date_created = ?");
    $stmt->bind_param("sssssssss", 
        $p['id'], $p['title'], $p['content'], $p['author'], $created,
        $p['title'], $p['content'], $p['author'], $created
    );
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Announcement saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save announcement: ' . $stmt->error]);
    }
}

function deleteAnnouncement($p) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM announcements WHERE id = ?");
    $stmt->bind_param("s", $p['id']);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Announcement deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete announcement']);
    }
}

function saveSetting($p) {
    global $conn;
    $key = $p['key'];
    $val = json_encode($p['value']);
    $stmt = $conn->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?");
    $stmt->bind_param("sss", $key, $val, $val);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Setting saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save setting: ' . $stmt->error]);
    }
}
?>
