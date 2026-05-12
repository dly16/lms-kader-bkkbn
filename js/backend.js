// ============================================
// BACKEND.JS - Google Sheets Integration
// ============================================

const Backend = {
  // URL Web App Google Apps Script
  URL: 'https://script.google.com/macros/s/AKfycbxkXazl_ZfRu8jaQDe6rt2a_4aemp1u1KRACaPrv5_mJ-r-rrH24LJ41uW2fCU7CIDx/exec',

  async send(type, payload) {
    console.log(`[Backend] Mencoba mengirim data ${type}...`, payload);
    try {
      // Menggunakan mode no-cors adalah cara paling stabil untuk mengirim data 
      // dari GitHub Pages ke Google Apps Script tanpa masalah keamanan browser.
      // Catatan: Dalam mode ini, kita tidak bisa membaca respon dari server,
      // tapi data tetap akan sampai ke Google Sheets.
      await fetch(this.URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify({ type, payload })
      });
      console.log(`[Backend] Sinyal pengiriman ${type} terkirim.`);
      return true;
    } catch (error) {
      console.error(`[Backend] Gagal mengirim data ${type}:`, error);
      return false;
    }
  },

  syncUser(userData) {
    const payload = {
      timestamp: new Date().toLocaleString('id-ID'),
      id_user: userData.id,
      nama: userData.name,
      nik: userData.nik,
      username: userData.username,
      no_hp: userData.noHp,
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
  },

  deleteUser(userData) {
    if (!userData || !userData.nik) {
      console.error('[Backend] Gagal hapus: Data NIK tidak ditemukan.');
      return;
    }
    const payload = {
      nik: userData.nik.toString(),
      username: userData.username,
      nama: userData.name
    };
    console.log('[Backend] Mengirim permintaan HAPUS_KADER untuk NIK:', payload.nik);
    return this.send('HAPUS_KADER', payload);
  }
};
