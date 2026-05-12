// ============================================
// DATA.JS - Data Manager & Sample Data
// LMS Kader Rumah Data Kependudukan
// Kementerian KPK Prov. Sulawesi Barat
// ============================================

const DB = {
  KEYS: {
    USERS: 'lms_users',
    COURSES: 'lms_courses',
    ENROLLMENTS: 'lms_enrollments',
    ANNOUNCEMENTS: 'lms_announcements',
    DISCUSSIONS: 'lms_discussions',
    CERT_TEMPLATE: 'lms_cert_template',
    QUESTION_BANK: 'lms_question_bank',
    SESSION: 'lms_session'
  },

  get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } 
    catch { return null; }
  },

  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },

  getAll(key) { return this.get(key) || []; },

  add(key, item) {
    const arr = this.getAll(key);
    arr.push(item);
    this.set(key, arr);
    return item;
  },

  update(key, id, updates) {
    const arr = this.getAll(key);
    const idx = arr.findIndex(i => i.id === id);
    if (idx !== -1) { arr[idx] = { ...arr[idx], ...updates }; this.set(key, arr); }
    return idx !== -1;
  },

  remove(key, id) {
    const arr = this.getAll(key).filter(i => i.id !== id);
    this.set(key, arr);
  },

  find(key, id) {
    return this.getAll(key).find(i => i.id === id) || null;
  },

  genId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
};

// ============================================
// SEED DATA
// ============================================
function seedData() {
  if (DB.get('lms_seeded')) return;

  // Admin user
  const users = [
    {
      id: 'admin1',
      username: 'Adminsulbar',
      password: 'BKKBN666803',
      role: 'admin',
      name: 'Administrator Sulawesi Barat',
      email: 'admin@bkkbn-sulbar.go.id',
      avatar: '',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kader1',
      username: 'kader',
      password: 'kader123',
      role: 'kader',
      name: 'Siti Nurhaliza',
      nik: '7604012345678901',
      desa: 'Desa Bakka',
      kecamatan: 'Wonomulyo',
      kabupaten: 'Polewali Mandar',
      noHp: '081234567890',
      avatar: '',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kader2',
      username: 'ahmad',
      password: 'kader123',
      role: 'kader',
      name: 'Ahmad Fauzi',
      nik: '7604019876543210',
      desa: 'Desa Sidodadi',
      kecamatan: 'Campalagian',
      kabupaten: 'Polewali Mandar',
      noHp: '082345678901',
      avatar: '',
      createdAt: new Date().toISOString()
    }
  ];

  // Sample Courses
  const courses = [
    {
      id: 'course1',
      title: 'Dasar-Dasar Rumah Data Kependudukan',
      description: 'Memahami konsep dasar Rumah Data Kependudukan, fungsi, tujuan, dan peran kader dalam pengelolaan data kependudukan di tingkat desa/kelurahan.',
      thumbnail: '',
      category: 'Dasar',
      duration: '4 Jam',
      totalModules: 4,
      passingGrade: 70,
      useQuestionBank: true,
      preTestCount: 5,
      postTestCount: 5,
      status: 'published',
      createdAt: new Date().toISOString(),
      modules: [
        {
          id: 'mod1',
          title: 'Pengenalan Rumah DataKU',
          type: 'slide',
          content: {
            slides: [
              { title: 'Apa itu Rumah Data Kependudukan?', body: 'Rumah Data Kependudukan (Rumah DataKU) adalah pusat data kependudukan di tingkat desa/kelurahan yang dikelola oleh kader terlatih untuk mendukung program pembangunan berbasis data.' },
              { title: 'Tujuan Rumah DataKU', body: '1. Menyediakan data kependudukan yang akurat\n2. Mendukung perencanaan pembangunan desa\n3. Memantau program kependudukan\n4. Memperkuat ketahanan keluarga' },
              { title: 'Landasan Hukum', body: '• UU No. 52 Tahun 2009 tentang Perkembangan Kependudukan\n• Peraturan Presiden tentang BKKBN\n• Peraturan Kepala BKKBN tentang Pendataan Keluarga' },
              { title: 'Struktur Rumah DataKU', body: 'Rumah DataKU berada di bawah koordinasi Pemerintah Desa/Kelurahan dan didampingi oleh PKB/PLKB serta Kader IMP (IMP = Institusi Masyarakat Pedesaan).' }
            ]
          },
          order: 1
        },
        {
          id: 'mod2',
          title: 'Tugas dan Fungsi Kader',
          type: 'slide',
          content: {
            slides: [
              { title: 'Peran Kader Rumah DataKU', body: 'Kader adalah ujung tombak dalam pengumpulan, pengolahan, dan pemanfaatan data kependudukan di tingkat desa/kelurahan.' },
              { title: 'Tugas Utama Kader', body: '1. Melakukan pendataan keluarga\n2. Memverifikasi dan memvalidasi data\n3. Menginput data ke dalam sistem\n4. Membuat laporan berkala\n5. Menyampaikan hasil analisis data kepada pemangku kepentingan' },
              { title: 'Kompetensi yang Dibutuhkan', body: '• Kemampuan komunikasi yang baik\n• Mampu mengoperasikan komputer/gadget\n• Teliti dan jujur dalam pendataan\n• Memahami indikator kependudukan dasar' }
            ]
          },
          order: 2
        },
        {
          id: 'mod3',
          title: 'Pengumpulan Data Keluarga',
          type: 'video',
          content: {
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            videoTitle: 'Tutorial Pengumpulan Data Keluarga',
            description: 'Video panduan lengkap tentang teknik pengumpulan data keluarga menggunakan instrumen Pendataan Keluarga (PK).'
          },
          order: 3
        },
        {
          id: 'mod4',
          title: 'Pengolahan dan Pelaporan Data',
          type: 'slide',
          content: {
            slides: [
              { title: 'Tahapan Pengolahan Data', body: '1. Pengumpulan formulir PK\n2. Editing & Coding\n3. Entry Data ke Aplikasi\n4. Cleaning & Validasi\n5. Tabulasi & Analisis' },
              { title: 'Format Pelaporan', body: 'Laporan disusun secara berkala:\n• Bulanan: Progress pendataan\n• Triwulanan: Rekapitulasi data\n• Tahunan: Laporan lengkap analisis data kependudukan' },
              { title: 'Pemanfaatan Data', body: 'Data yang telah diolah digunakan untuk:\n1. Musrenbang Desa\n2. Program intervensi keluarga\n3. Pemetaan wilayah\n4. Evaluasi program kependudukan' }
            ]
          },
          order: 4
        }
      ],
      preTest: [
        { id: 'q1', question: 'Apa kepanjangan dari Rumah DataKU?', options: ['Rumah Data Kependudukan', 'Rumah Data Kesehatan Umum', 'Rumah Data Keluarga Utama', 'Rumah Data Komunitas'], answer: 0 },
        { id: 'q2', question: 'Siapa yang mengelola Rumah DataKU di tingkat desa?', options: ['Camat', 'Kader terlatih', 'Bupati', 'Gubernur'], answer: 1 },
        { id: 'q3', question: 'UU yang menjadi landasan perkembangan kependudukan adalah?', options: ['UU No. 23/2014', 'UU No. 6/2014', 'UU No. 52/2009', 'UU No. 25/2004'], answer: 2 },
        { id: 'q4', question: 'Apa tugas utama kader Rumah DataKU?', options: ['Mengajar di sekolah', 'Pendataan keluarga', 'Membangun jalan', 'Mengelola keuangan desa'], answer: 1 },
        { id: 'q5', question: 'Berapa kali laporan tahunan disusun?', options: ['2 kali', '1 kali', '4 kali', '6 kali'], answer: 1 }
      ],
      postTest: [
        { id: 'pq1', question: 'Rumah DataKU berada di bawah koordinasi?', options: ['Kecamatan', 'Pemerintah Desa/Kelurahan', 'Provinsi', 'Pusat'], answer: 1 },
        { id: 'pq2', question: 'Tahapan pertama pengolahan data adalah?', options: ['Entry Data', 'Tabulasi', 'Pengumpulan Formulir PK', 'Analisis'], answer: 2 },
        { id: 'pq3', question: 'Data kependudukan dimanfaatkan untuk?', options: ['Musrenbang Desa', 'Hiburan', 'Pariwisata', 'Olahraga'], answer: 0 },
        { id: 'pq4', question: 'PKB/PLKB bertugas sebagai?', options: ['Kepala Desa', 'Pendamping kader', 'Guru', 'Dokter'], answer: 1 },
        { id: 'pq5', question: 'Kompetensi kader yang TIDAK diperlukan adalah?', options: ['Komunikasi baik', 'Teliti', 'Mampu mengemudi truk', 'Jujur'], answer: 2 },
        { id: 'pq6', question: 'Laporan triwulanan berisi?', options: ['Progress pendataan', 'Rekapitulasi data', 'Laporan keuangan', 'Absensi kader'], answer: 1 },
        { id: 'pq7', question: 'IMP singkatan dari?', options: ['Institusi Masyarakat Pedesaan', 'Ikatan Masyarakat Perkotaan', 'Integrasi Monitoring Program', 'Indeks Mutu Pendidikan'], answer: 0 },
        { id: 'pq8', question: 'Instrumen pendataan keluarga disebut?', options: ['Formulir A', 'Formulir PK', 'Formulir KK', 'Formulir RT'], answer: 1 },
        { id: 'pq9', question: 'Cleaning data bertujuan untuk?', options: ['Menghapus semua data', 'Membersihkan data dari kesalahan', 'Mencetak data', 'Menyimpan data'], answer: 1 },
        { id: 'pq10', question: 'Passing grade kelulusan pelatihan ini adalah?', options: ['50%', '60%', '70%', '80%'], answer: 2 }
      ]
    },
    {
      id: 'course2',
      title: 'Teknik Pendataan Keluarga',
      description: 'Mempelajari teknik-teknik pendataan keluarga yang efektif, instrumen yang digunakan, serta cara verifikasi dan validasi data.',
      thumbnail: '',
      category: 'Teknis',
      duration: '3 Jam',
      totalModules: 3,
      passingGrade: 70,
      useQuestionBank: true,
      preTestCount: 5,
      postTestCount: 5,
      status: 'published',
      createdAt: new Date().toISOString(),
      modules: [
        {
          id: 'mod5',
          title: 'Instrumen Pendataan Keluarga',
          type: 'slide',
          content: {
            slides: [
              { title: 'Formulir Pendataan Keluarga (PK)', body: 'Formulir PK adalah instrumen utama yang digunakan untuk mengumpulkan data keluarga. Terdiri dari beberapa bagian:\n• Identitas Keluarga\n• Anggota Keluarga\n• Perumahan dan Ekonomi\n• Program Pemerintah' },
              { title: 'Cara Pengisian Formulir', body: '1. Isi dengan huruf KAPITAL\n2. Gunakan tinta hitam\n3. Beri tanda silang (X) pada pilihan\n4. Jangan mencoret atau menghapus\n5. Gunakan formulir baru jika ada kesalahan' }
            ]
          },
          order: 1
        },
        {
          id: 'mod6',
          title: 'Teknik Wawancara Pendataan',
          type: 'video',
          content: {
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            videoTitle: 'Teknik Wawancara untuk Pendataan Keluarga',
            description: 'Panduan wawancara yang baik dan benar saat melakukan pendataan keluarga.'
          },
          order: 2
        },
        {
          id: 'mod7',
          title: 'Verifikasi dan Validasi Data',
          type: 'slide',
          content: {
            slides: [
              { title: 'Pentingnya Verifikasi', body: 'Verifikasi data memastikan bahwa data yang dikumpulkan akurat, lengkap, dan konsisten. Tanpa verifikasi, data tidak dapat diandalkan untuk pengambilan keputusan.' },
              { title: 'Langkah Verifikasi', body: '1. Cek kelengkapan formulir\n2. Periksa konsistensi data\n3. Cross-check dengan data administrasi\n4. Konfirmasi ke responden jika ada keraguan' }
            ]
          },
          order: 3
        }
      ],
      preTest: [
        { id: 'q6', question: 'Instrumen utama pendataan keluarga adalah?', options: ['Formulir RT', 'Formulir PK', 'Formulir KTP', 'Formulir KK'], answer: 1 },
        { id: 'q7', question: 'Pengisian formulir harus menggunakan?', options: ['Tinta merah', 'Pensil', 'Tinta hitam', 'Spidol'], answer: 2 },
        { id: 'q8', question: 'Tujuan verifikasi data adalah?', options: ['Menghapus data', 'Memastikan akurasi', 'Mencetak data', 'Mengirim data'], answer: 1 },
        { id: 'q9', question: 'Huruf yang digunakan saat mengisi formulir?', options: ['Huruf kecil', 'KAPITAL', 'Campuran', 'Kursif'], answer: 1 },
        { id: 'q10', question: 'Jika terjadi kesalahan pengisian, yang dilakukan adalah?', options: ['Mencoret', 'Menghapus', 'Gunakan formulir baru', 'Menimpa tulisan'], answer: 2 }
      ],
      postTest: [
        { id: 'pq11', question: 'Formulir PK terdiri dari bagian, KECUALI?', options: ['Identitas Keluarga', 'Anggota Keluarga', 'Riwayat Pendidikan Guru', 'Program Pemerintah'], answer: 2 },
        { id: 'pq12', question: 'Teknik wawancara yang baik memerlukan?', options: ['Memaksa responden', 'Komunikasi sopan', 'Berteriak', 'Mengancam'], answer: 1 },
        { id: 'pq13', question: 'Cross-check data dilakukan dengan?', options: ['Data administrasi', 'Data internet', 'Data sosial media', 'Data random'], answer: 0 },
        { id: 'pq14', question: 'Validasi data bertujuan?', options: ['Menghapus data salah', 'Memastikan konsistensi data', 'Memperbanyak data', 'Mengurangi data'], answer: 1 },
        { id: 'pq15', question: 'Tanda yang digunakan pada pilihan formulir?', options: ['Centang', 'Lingkaran', 'Silang (X)', 'Garis'], answer: 2 }
      ]
    },
    {
      id: 'course3',
      title: 'Analisis & Pemanfaatan Data Kependudukan',
      description: 'Mempelajari cara menganalisis data kependudukan, membuat visualisasi data, serta memanfaatkan data untuk perencanaan pembangunan desa.',
      thumbnail: '',
      category: 'Lanjutan',
      duration: '3 Jam',
      totalModules: 3,
      passingGrade: 70,
      useQuestionBank: true,
      preTestCount: 5,
      postTestCount: 5,
      status: 'published',
      createdAt: new Date().toISOString(),
      modules: [
        {
          id: 'mod8',
          title: 'Indikator Kependudukan',
          type: 'slide',
          content: {
            slides: [
              { title: 'Indikator Utama', body: '• Jumlah Penduduk\n• Laju Pertumbuhan Penduduk\n• Kepadatan Penduduk\n• Rasio Jenis Kelamin\n• Dependency Ratio\n• TFR (Total Fertility Rate)' },
              { title: 'Indikator Keluarga', body: '• Tahapan KS (Keluarga Sejahtera)\n• Jumlah PUS (Pasangan Usia Subur)\n• Peserta KB Aktif\n• Unmeet Need\n• Jumlah Balita & Lansia' }
            ]
          },
          order: 1
        },
        {
          id: 'mod9',
          title: 'Visualisasi Data',
          type: 'slide',
          content: {
            slides: [
              { title: 'Jenis Visualisasi', body: '1. Grafik Batang - perbandingan antar wilayah\n2. Grafik Garis - tren data per periode\n3. Grafik Pie - komposisi/proporsi\n4. Peta Tematik - sebaran geografis\n5. Infografis - ringkasan visual' },
              { title: 'Tools Visualisasi', body: '• Microsoft Excel / Google Sheets\n• Aplikasi SIGA\n• Dashboard online\n• Canva untuk infografis' }
            ]
          },
          order: 2
        },
        {
          id: 'mod10',
          title: 'Pemanfaatan Data untuk Perencanaan',
          type: 'slide',
          content: {
            slides: [
              { title: 'Data untuk Musrenbang', body: 'Data kependudukan menjadi dasar utama dalam Musyawarah Perencanaan Pembangunan (Musrenbang) desa. Data yang akurat membantu:\n1. Identifikasi masalah\n2. Penentuan prioritas program\n3. Alokasi anggaran tepat sasaran' },
              { title: 'Intervensi Program', body: 'Berdasarkan analisis data, dapat dirancang program intervensi:\n• Stunting → Program gizi keluarga\n• Kemiskinan → Program pemberdayaan\n• KB → Konseling PUS\n• Pendidikan → Beasiswa' }
            ]
          },
          order: 3
        }
      ],
      preTest: [
        { id: 'q11', question: 'TFR singkatan dari?', options: ['Total Family Rate', 'Total Fertility Rate', 'Total Fund Rate', 'Total Field Rate'], answer: 1 },
        { id: 'q12', question: 'PUS singkatan dari?', options: ['Pasangan Usia Subur', 'Program Umum Sosial', 'Pendataan Umum Statistik', 'Pusat Urusan Sosial'], answer: 0 },
        { id: 'q13', question: 'Grafik batang digunakan untuk?', options: ['Tren waktu', 'Perbandingan wilayah', 'Komposisi', 'Peta'], answer: 1 },
        { id: 'q14', question: 'Musrenbang adalah?', options: ['Musyawarah Perencanaan Pembangunan', 'Museum Rencana Bangsa', 'Musyawarah Rencana Bangsa', 'Museum Perencanaan'], answer: 0 },
        { id: 'q15', question: 'Dependency ratio mengukur?', options: ['Kekayaan', 'Rasio tanggungan', 'Luas wilayah', 'Jumlah sekolah'], answer: 1 }
      ],
      postTest: [
        { id: 'pq16', question: 'Indikator KS mengukur?', options: ['Tahapan Keluarga Sejahtera', 'Keamanan Sosial', 'Kesehatan Sekolah', 'Keuangan Swasta'], answer: 0 },
        { id: 'pq17', question: 'Grafik pie cocok untuk menampilkan?', options: ['Tren', 'Komposisi/proporsi', 'Perbandingan waktu', 'Peta'], answer: 1 },
        { id: 'pq18', question: 'Program intervensi stunting adalah?', options: ['Beasiswa', 'Program gizi keluarga', 'Pembangunan jalan', 'Pemberdayaan ekonomi'], answer: 1 },
        { id: 'pq19', question: 'Unmeet need berkaitan dengan?', options: ['Kebutuhan KB yang tidak terpenuhi', 'Kebutuhan air bersih', 'Kebutuhan listrik', 'Kebutuhan internet'], answer: 0 },
        { id: 'pq20', question: 'Visualisasi data menggunakan peta disebut?', options: ['Grafik batang', 'Peta tematik', 'Diagram venn', 'Histogram'], answer: 1 }
      ]
    }
  ];

  const announcements = [
    {
      id: 'ann1',
      title: 'Selamat Datang di LMS Kader Rumah DataKU',
      content: 'Selamat datang para kader! Platform pembelajaran ini dirancang khusus untuk meningkatkan kompetensi kader Rumah Data Kependudukan di Sulawesi Barat. Selamat belajar!',
      date: new Date().toISOString(),
      author: 'Administrator'
    },
    {
      id: 'ann2',
      title: 'Jadwal Pelatihan Gelombang I - 2026',
      content: 'Pelatihan Gelombang I tahun 2026 akan dilaksanakan mulai tanggal 15 Mei 2026. Pastikan seluruh kader telah menyelesaikan registrasi dan pre-test sebelum tanggal tersebut.',
      date: new Date().toISOString(),
      author: 'Administrator'
    }
  ];

  // Question Bank - Pool soal besar untuk pengacakan
  const questionBank = [
    {
      courseId: 'course1',
      preTest: [
        { id: 'bq1', question: 'Apa kepanjangan dari Rumah DataKU?', options: ['Rumah Data Kependudukan', 'Rumah Data Kesehatan Umum', 'Rumah Data Keluarga Utama', 'Rumah Data Komunitas'], answer: 0 },
        { id: 'bq2', question: 'Siapa yang mengelola Rumah DataKU di tingkat desa?', options: ['Camat', 'Kader terlatih', 'Bupati', 'Gubernur'], answer: 1 },
        { id: 'bq3', question: 'UU yang menjadi landasan perkembangan kependudukan adalah?', options: ['UU No. 23/2014', 'UU No. 6/2014', 'UU No. 52/2009', 'UU No. 25/2004'], answer: 2 },
        { id: 'bq4', question: 'Apa tugas utama kader Rumah DataKU?', options: ['Mengajar di sekolah', 'Pendataan keluarga', 'Membangun jalan', 'Mengelola keuangan desa'], answer: 1 },
        { id: 'bq5', question: 'Berapa kali laporan tahunan disusun?', options: ['2 kali', '1 kali', '4 kali', '6 kali'], answer: 1 },
        { id: 'bq6', question: 'Rumah DataKU pertama kali diinisiasi oleh lembaga?', options: ['Kemenkes', 'BKKBN', 'BPS', 'Kemendagri'], answer: 1 },
        { id: 'bq7', question: 'IMP singkatan dari?', options: ['Institusi Masyarakat Pedesaan', 'Ikatan Masyarakat Perkotaan', 'Integrasi Monitoring Program', 'Indeks Mutu Pendidikan'], answer: 0 },
        { id: 'bq8', question: 'Pendataan keluarga dilakukan berapa tahun sekali?', options: ['1 tahun', '2 tahun', '3 tahun', '5 tahun'], answer: 0 },
        { id: 'bq9', question: 'Siapa yang mendampingi kader di lapangan?', options: ['Guru', 'PKB/PLKB', 'Polisi', 'TNI'], answer: 1 },
        { id: 'bq10', question: 'Data kependudukan tingkat desa berguna untuk?', options: ['Hiburan', 'Musrenbang Desa', 'Pariwisata', 'Olahraga'], answer: 1 },
        { id: 'bq11', question: 'Fungsi utama Rumah DataKU adalah?', options: ['Pusat hiburan', 'Pusat data kependudukan', 'Pusat kesehatan', 'Pusat pendidikan'], answer: 1 },
        { id: 'bq12', question: 'KS singkatan dari?', options: ['Keluarga Sejahtera', 'Komunitas Sosial', 'Keamanan Sipil', 'Kesejahteraan Sosial'], answer: 0 },
        { id: 'bq13', question: 'Laporan bulanan berisi?', options: ['Progress pendataan', 'Laporan keuangan', 'Absensi pegawai', 'Jadwal rapat'], answer: 0 },
        { id: 'bq14', question: 'Data yang dikumpulkan kader meliputi?', options: ['Data keluarga', 'Data cuaca', 'Data lalu lintas', 'Data pariwisata'], answer: 0 },
        { id: 'bq15', question: 'Verifikasi data bertujuan untuk?', options: ['Menghapus data', 'Memastikan akurasi', 'Mencetak data', 'Mengirim data'], answer: 1 }
      ],
      postTest: [
        { id: 'bpq1', question: 'Rumah DataKU berada di bawah koordinasi?', options: ['Kecamatan', 'Pemerintah Desa/Kelurahan', 'Provinsi', 'Pusat'], answer: 1 },
        { id: 'bpq2', question: 'Tahapan pertama pengolahan data adalah?', options: ['Entry Data', 'Tabulasi', 'Pengumpulan Formulir PK', 'Analisis'], answer: 2 },
        { id: 'bpq3', question: 'Data kependudukan dimanfaatkan untuk?', options: ['Musrenbang Desa', 'Hiburan', 'Pariwisata', 'Olahraga'], answer: 0 },
        { id: 'bpq4', question: 'PKB/PLKB bertugas sebagai?', options: ['Kepala Desa', 'Pendamping kader', 'Guru', 'Dokter'], answer: 1 },
        { id: 'bpq5', question: 'Kompetensi kader yang TIDAK diperlukan adalah?', options: ['Komunikasi baik', 'Teliti', 'Mampu mengemudi truk', 'Jujur'], answer: 2 },
        { id: 'bpq6', question: 'Laporan triwulanan berisi?', options: ['Progress pendataan', 'Rekapitulasi data', 'Laporan keuangan', 'Absensi kader'], answer: 1 },
        { id: 'bpq7', question: 'Instrumen pendataan keluarga disebut?', options: ['Formulir A', 'Formulir PK', 'Formulir KK', 'Formulir RT'], answer: 1 },
        { id: 'bpq8', question: 'Cleaning data bertujuan untuk?', options: ['Menghapus semua data', 'Membersihkan data dari kesalahan', 'Mencetak data', 'Menyimpan data'], answer: 1 },
        { id: 'bpq9', question: 'Passing grade kelulusan pelatihan ini adalah?', options: ['50%', '60%', '70%', '80%'], answer: 2 },
        { id: 'bpq10', question: 'Peta tematik digunakan untuk?', options: ['Sebaran geografis', 'Hiburan', 'Olahraga', 'Pariwisata'], answer: 0 },
        { id: 'bpq11', question: 'Editing data dilakukan setelah?', options: ['Analisis', 'Pengumpulan formulir', 'Tabulasi', 'Pelaporan'], answer: 1 },
        { id: 'bpq12', question: 'Grafik garis cocok untuk menampilkan?', options: ['Komposisi', 'Tren data per periode', 'Peta', 'Organisasi'], answer: 1 },
        { id: 'bpq13', question: 'Tahapan KS paling rendah adalah?', options: ['KS I', 'Pra KS', 'KS II', 'KS III'], answer: 1 },
        { id: 'bpq14', question: 'Entry data dilakukan menggunakan?', options: ['Formulir kertas', 'Aplikasi digital', 'Surat resmi', 'Email'], answer: 1 },
        { id: 'bpq15', question: 'Dependency ratio mengukur?', options: ['Kekayaan', 'Rasio tanggungan', 'Luas wilayah', 'Jumlah sekolah'], answer: 1 },
        { id: 'bpq16', question: 'TFR singkatan dari?', options: ['Total Family Rate', 'Total Fertility Rate', 'Total Fund Rate', 'Total Field Rate'], answer: 1 },
        { id: 'bpq17', question: 'Program intervensi stunting adalah?', options: ['Beasiswa', 'Program gizi keluarga', 'Pembangunan jalan', 'Pelatihan IT'], answer: 1 },
        { id: 'bpq18', question: 'Unmeet need berkaitan dengan?', options: ['Kebutuhan KB yang tidak terpenuhi', 'Kebutuhan air', 'Kebutuhan listrik', 'Kebutuhan internet'], answer: 0 },
        { id: 'bpq19', question: 'Infografis berguna untuk?', options: ['Ringkasan visual', 'Perhitungan', 'Pengiriman surat', 'Absensi'], answer: 0 },
        { id: 'bpq20', question: 'Indikator PUS mengukur?', options: ['Pasangan Usia Subur', 'Program Umum Sosial', 'Pendataan Umum', 'Pusat Urusan'], answer: 0 }
      ]
    },
    {
      courseId: 'course2',
      preTest: [
        { id: 'b2q1', question: 'Instrumen utama pendataan keluarga adalah?', options: ['Formulir RT', 'Formulir PK', 'Formulir KTP', 'Formulir KK'], answer: 1 },
        { id: 'b2q2', question: 'Pengisian formulir harus menggunakan?', options: ['Tinta merah', 'Pensil', 'Tinta hitam', 'Spidol'], answer: 2 },
        { id: 'b2q3', question: 'Tujuan verifikasi data adalah?', options: ['Menghapus data', 'Memastikan akurasi', 'Mencetak data', 'Mengirim data'], answer: 1 },
        { id: 'b2q4', question: 'Huruf yang digunakan saat mengisi formulir?', options: ['Huruf kecil', 'KAPITAL', 'Campuran', 'Kursif'], answer: 1 },
        { id: 'b2q5', question: 'Jika terjadi kesalahan pengisian, yang dilakukan adalah?', options: ['Mencoret', 'Menghapus', 'Gunakan formulir baru', 'Menimpa tulisan'], answer: 2 },
        { id: 'b2q6', question: 'Wawancara pendataan sebaiknya dilakukan di?', options: ['Kantor kecamatan', 'Rumah responden', 'Pasar', 'Sekolah'], answer: 1 },
        { id: 'b2q7', question: 'Sikap kader saat wawancara harus?', options: ['Memaksa', 'Sopan dan ramah', 'Terburu-buru', 'Acuh tak acuh'], answer: 1 },
        { id: 'b2q8', question: 'Tanda pada pilihan formulir menggunakan?', options: ['Centang', 'Lingkaran', 'Silang (X)', 'Garis'], answer: 2 },
        { id: 'b2q9', question: 'Data keluarga meliputi informasi tentang?', options: ['Hewan peliharaan', 'Anggota keluarga', 'Kendaraan', 'Hobi'], answer: 1 },
        { id: 'b2q10', question: 'Cross-check data dilakukan dengan?', options: ['Data administrasi', 'Data internet', 'Data sosial media', 'Data random'], answer: 0 },
        { id: 'b2q11', question: 'Formulir PK harus diisi oleh?', options: ['Kader', 'Kepala desa', 'Camat', 'Responden sendiri'], answer: 0 },
        { id: 'b2q12', question: 'Waktu terbaik untuk pendataan adalah?', options: ['Malam hari', 'Siang hari saat keluarga di rumah', 'Subuh', 'Tengah malam'], answer: 1 }
      ],
      postTest: [
        { id: 'b2pq1', question: 'Formulir PK terdiri dari bagian, KECUALI?', options: ['Identitas Keluarga', 'Anggota Keluarga', 'Riwayat Pendidikan Guru', 'Program Pemerintah'], answer: 2 },
        { id: 'b2pq2', question: 'Teknik wawancara yang baik memerlukan?', options: ['Memaksa responden', 'Komunikasi sopan', 'Berteriak', 'Mengancam'], answer: 1 },
        { id: 'b2pq3', question: 'Cross-check data dilakukan dengan?', options: ['Data administrasi', 'Data internet', 'Data sosial media', 'Data random'], answer: 0 },
        { id: 'b2pq4', question: 'Validasi data bertujuan?', options: ['Menghapus data salah', 'Memastikan konsistensi data', 'Memperbanyak data', 'Mengurangi data'], answer: 1 },
        { id: 'b2pq5', question: 'Tanda yang digunakan pada pilihan formulir?', options: ['Centang', 'Lingkaran', 'Silang (X)', 'Garis'], answer: 2 },
        { id: 'b2pq6', question: 'Jika responden tidak di rumah, kader sebaiknya?', options: ['Membatalkan', 'Datang lagi di waktu lain', 'Mengisi sendiri', 'Meminta tetangga mengisi'], answer: 1 },
        { id: 'b2pq7', question: 'Data PUS mencakup informasi tentang?', options: ['Pasangan Usia Subur', 'Pendidikan Umum', 'Pertanian', 'Perikanan'], answer: 0 },
        { id: 'b2pq8', question: 'Editing formulir dilakukan untuk?', options: ['Menambah data baru', 'Memeriksa kelengkapan', 'Menghapus formulir', 'Menggandakan formulir'], answer: 1 },
        { id: 'b2pq9', question: 'Identitas keluarga dalam formulir PK meliputi?', options: ['Nama KK dan alamat', 'Nama hewan', 'Nama kendaraan', 'Nama sekolah'], answer: 0 },
        { id: 'b2pq10', question: 'Pendataan keluarga bertujuan utama untuk?', options: ['Sensus', 'Perencanaan program kependudukan', 'Perpajakan', 'Perizinan'], answer: 1 },
        { id: 'b2pq11', question: 'Coding data adalah proses?', options: ['Pemberian kode pada data', 'Penghapusan data', 'Pencetakan data', 'Pengiriman data'], answer: 0 },
        { id: 'b2pq12', question: 'Konfirmasi ke responden dilakukan jika?', options: ['Data sudah lengkap', 'Ada keraguan pada data', 'Data sudah dikirim', 'Data sudah dicetak'], answer: 1 }
      ]
    },
    {
      courseId: 'course3',
      preTest: [
        { id: 'b3q1', question: 'TFR singkatan dari?', options: ['Total Family Rate', 'Total Fertility Rate', 'Total Fund Rate', 'Total Field Rate'], answer: 1 },
        { id: 'b3q2', question: 'PUS singkatan dari?', options: ['Pasangan Usia Subur', 'Program Umum Sosial', 'Pendataan Umum Statistik', 'Pusat Urusan Sosial'], answer: 0 },
        { id: 'b3q3', question: 'Grafik batang digunakan untuk?', options: ['Tren waktu', 'Perbandingan wilayah', 'Komposisi', 'Peta'], answer: 1 },
        { id: 'b3q4', question: 'Musrenbang adalah?', options: ['Musyawarah Perencanaan Pembangunan', 'Museum Rencana Bangsa', 'Musyawarah Rencana Bangsa', 'Museum Perencanaan'], answer: 0 },
        { id: 'b3q5', question: 'Dependency ratio mengukur?', options: ['Kekayaan', 'Rasio tanggungan', 'Luas wilayah', 'Jumlah sekolah'], answer: 1 },
        { id: 'b3q6', question: 'Grafik pie cocok untuk?', options: ['Tren', 'Komposisi/proporsi', 'Perbandingan waktu', 'Peta'], answer: 1 },
        { id: 'b3q7', question: 'Kepadatan penduduk dihitung dari?', options: ['Jumlah penduduk per luas wilayah', 'Jumlah rumah', 'Jumlah sekolah', 'Jumlah jalan'], answer: 0 },
        { id: 'b3q8', question: 'Rasio jenis kelamin membandingkan?', options: ['Laki-laki dan perempuan', 'Dewasa dan anak', 'Tua dan muda', 'Kaya dan miskin'], answer: 0 },
        { id: 'b3q9', question: 'Tools visualisasi data yang umum digunakan?', options: ['Microsoft Excel', 'Photoshop', 'AutoCAD', 'Blender'], answer: 0 },
        { id: 'b3q10', question: 'SIGA adalah?', options: ['Sistem Informasi Geografis dan Analisis', 'Aplikasi BKKBN', 'Sistem Internal Guru', 'Aplikasi Keuangan'], answer: 1 },
        { id: 'b3q11', question: 'Laju pertumbuhan penduduk menunjukkan?', options: ['Perubahan jumlah penduduk per periode', 'Jumlah sekolah', 'Luas desa', 'Jumlah jalan'], answer: 0 },
        { id: 'b3q12', question: 'Data tren sebaiknya ditampilkan dengan?', options: ['Grafik batang', 'Grafik garis', 'Tabel', 'Peta'], answer: 1 }
      ],
      postTest: [
        { id: 'b3pq1', question: 'Indikator KS mengukur?', options: ['Tahapan Keluarga Sejahtera', 'Keamanan Sosial', 'Kesehatan Sekolah', 'Keuangan Swasta'], answer: 0 },
        { id: 'b3pq2', question: 'Grafik pie cocok untuk menampilkan?', options: ['Tren', 'Komposisi/proporsi', 'Perbandingan waktu', 'Peta'], answer: 1 },
        { id: 'b3pq3', question: 'Program intervensi stunting adalah?', options: ['Beasiswa', 'Program gizi keluarga', 'Pembangunan jalan', 'Pemberdayaan ekonomi'], answer: 1 },
        { id: 'b3pq4', question: 'Unmeet need berkaitan dengan?', options: ['Kebutuhan KB yang tidak terpenuhi', 'Kebutuhan air bersih', 'Kebutuhan listrik', 'Kebutuhan internet'], answer: 0 },
        { id: 'b3pq5', question: 'Visualisasi data menggunakan peta disebut?', options: ['Grafik batang', 'Peta tematik', 'Diagram venn', 'Histogram'], answer: 1 },
        { id: 'b3pq6', question: 'Canva digunakan untuk membuat?', options: ['Database', 'Infografis', 'Spreadsheet', 'Video'], answer: 1 },
        { id: 'b3pq7', question: 'Alokasi anggaran tepat sasaran membutuhkan?', options: ['Data akurat', 'Dugaan', 'Keberuntungan', 'Voting'], answer: 0 },
        { id: 'b3pq8', question: 'Peserta KB aktif termasuk indikator?', options: ['Ekonomi', 'Kependudukan', 'Pendidikan', 'Kesehatan'], answer: 1 },
        { id: 'b3pq9', question: 'Pemetaan wilayah menggunakan data untuk?', options: ['Identifikasi sebaran', 'Hiburan', 'Olahraga', 'Pariwisata'], answer: 0 },
        { id: 'b3pq10', question: 'Evaluasi program kependudukan dilakukan?', options: ['Tahunan', 'Tidak pernah', 'Hanya sekali', '10 tahun sekali'], answer: 0 },
        { id: 'b3pq11', question: 'Dashboard online berguna untuk?', options: ['Memantau data real-time', 'Bermain game', 'Menonton film', 'Belanja online'], answer: 0 },
        { id: 'b3pq12', question: 'Intervensi kemiskinan melalui program?', options: ['Pemberdayaan', 'Pariwisata', 'Olahraga', 'Hiburan'], answer: 0 }
      ]
    }
  ];

  DB.set(DB.KEYS.USERS, users);
  DB.set(DB.KEYS.COURSES, courses);
  DB.set(DB.KEYS.ENROLLMENTS, []);
  DB.set(DB.KEYS.ANNOUNCEMENTS, announcements);
  DB.set(DB.KEYS.DISCUSSIONS, []);
  DB.set(DB.KEYS.QUESTION_BANK, questionBank);
  DB.set('lms_seeded', true);
}

seedData();
