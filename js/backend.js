// ============================================
// BACKEND.JS - MySQL Backend API Client
// ============================================

const Backend = {
  URL: 'api/index.php',

  async send(type, payload) {
    console.log(`[Backend] Mengirim ${type} ke MySQL...`, payload);
    try {
      const response = await fetch(this.URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, payload })
      });
      const result = await response.json();
      console.log(`[Backend] Respon MySQL [${type}]:`, result);
      return result;
    } catch (error) {
      console.error(`[Backend] Gagal mengirim ${type}:`, error);
      return { success: false, message: error.message };
    }
  },

  async uploadFile(file) {
    console.log('[Backend] Mengunggah file ke MySQL...', file.name);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(this.URL, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      console.log('[Backend] Respon unggah file:', result);
      return result;
    } catch (error) {
      console.error('[Backend] Gagal mengunggah file:', error);
      return { success: false, message: error.message };
    }
  },

  // 1. Ambil Semua Data saat Startup
  async getInitialData() {
    console.log('[Backend] Mengambil data inisial dari MySQL...');
    return this.send('GET_INITIAL_DATA');
  },

  // 2. Sinkronisasi Semua Data Lokal ke MySQL (Seeding Awal jika database kosong)
  async syncAllFromLocal(payload) {
    console.log('[Backend] Sinkronisasi seluruh data lokal ke MySQL...');
    return this.send('SYNC_ALL_FROM_LOCAL', payload);
  },

  // 3. Sinkronisasi User (Registrasi / Edit)
  async saveUser(user) {
    return this.send('SAVE_USER', user);
  },

  // 4. Hapus User
  async deleteUser(user) {
    if (!user || (!user.id && !user.nik)) {
      console.error('[Backend] Gagal hapus user: ID atau NIK tidak ditemukan.');
      return { success: false };
    }
    return this.send('DELETE_USER', { id: user.id, nik: user.nik });
  },

  // 5. Simpan Kursus
  async saveCourse(course) {
    return this.send('SAVE_COURSE', course);
  },

  // 6. Hapus Kursus
  async deleteCourse(course) {
    return this.send('DELETE_COURSE', { id: course.id });
  },

  // 7. Simpan Modul
  async saveModule(module) {
    return this.send('SAVE_MODULE', module);
  },

  // 8. Hapus Modul
  async deleteModule(module) {
    return this.send('DELETE_MODULE', { id: module.id });
  },

  // 9. Simpan Soal
  async saveQuestion(question) {
    return this.send('SAVE_QUESTION', question);
  },

  // 10. Hapus Soal
  async deleteQuestion(question) {
    return this.send('DELETE_QUESTION', { id: question.id });
  },

  // 11. Simpan Enrollment (Progress / Nilai Quiz)
  async saveEnrollment(enrollment) {
    return this.send('SAVE_ENROLLMENT', enrollment);
  },

  // 12. Simpan Pengumuman
  async saveAnnouncement(announcement) {
    return this.send('SAVE_ANNOUNCEMENT', announcement);
  },

  // 13. Hapus Pengumuman
  async deleteAnnouncement(announcement) {
    return this.send('DELETE_ANNOUNCEMENT', { id: announcement.id });
  },

  // 14. Simpan Setting (e.g. Sertifikat Template)
  async saveSetting(key, value) {
    return this.send('SAVE_SETTING', { key, value });
  },

  // 15. Sinkronisasi Bank Soal
  async syncQuestionBank(questionBank) {
    return this.send('SYNC_QUESTION_BANK', questionBank);
  },

  // 16. Sinkronisasi Pengumuman Secara Massal
  async syncAnnouncements(announcements) {
    return this.send('SYNC_ANNOUNCEMENTS', announcements);
  },

  // --- Fungsi Deprecate / Compatibility Layer ---
  async syncUser(userData) {
    return this.saveUser(userData);
  },

  async syncResult(user, course, enrollment) {
    return this.saveEnrollment(enrollment);
  },

  async getUsers() {
    const res = await this.send('GET_ALL_USERS');
    return res.success ? res.data : [];
  },

  async getEnrollments() {
    const res = await this.send('GET_ALL_ENROLLMENTS');
    return res.success ? res.data : [];
  }
};
