// ============================================
// BACKEND.JS - Google Sheets Integration
// ============================================

const Backend = {
  // GANTI URL INI DENGAN URL WEB APP ANDA
  URL: 'https://script.google.com/macros/s/AKfycbxWpWW3Gog9kHpYnMuEl7fwIiz2Xm8Jsm1nITTj7wYM8g86W43msoxAepP1Jzfw4D2M/exec',

  async send(type, payload) {
    console.log(`Sending ${type} to backend...`, payload);
    try {
      // Kita gunakan mode 'no-cors' agar tidak terhambat kebijakan CORS browser 
      // saat mengirim ke Google Script (ini batasan umum Google Apps Script)
      await fetch(this.URL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, payload })
      });
      console.log('Data sent successfully');
      return true;
    } catch (error) {
      console.error('Backend sync failed:', error);
      return false;
    }
  },

  syncUser(userData) {
    const payload = {
      timestamp: new Date().toLocaleString('id-ID'),
      id: userData.id,
      nama: userData.name,
      nik: userData.nik,
      username: userData.username,
      noHp: userData.noHp,
      desa: userData.desa,
      kecamatan: userData.kecamatan,
      kabupaten: userData.kabupaten
    };
    return this.send('PENDAFTARAN', payload);
  },

  syncResult(user, course, enrollment) {
    const payload = {
      timestamp: new Date().toLocaleString('id-ID'),
      nama_kader: user.name,
      nik: user.nik,
      kursus: course.title,
      pre_test: enrollment.preTestScore,
      post_test: enrollment.postTestScore,
      status: enrollment.status,
      no_sertifikat: enrollment.certNumber || '-'
    };
    return this.send('NILAI_QUIZ', payload);
  }
};
