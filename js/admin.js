// ============================================
// ADMIN.JS - Admin Features & Dashboard
// ============================================

const Admin = {
  init() {
    this.renderDashboard();
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('nav-admin-dashboard')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderDashboard();
      App.setActiveNav('nav-admin-dashboard');
    });

    document.getElementById('nav-admin-courses')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderCourses();
      App.setActiveNav('nav-admin-courses');
    });

    document.getElementById('nav-admin-questionbank')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderQuestionBank();
      App.setActiveNav('nav-admin-questionbank');
    });

    document.getElementById('nav-admin-kader')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderKader();
      App.setActiveNav('nav-admin-kader');
    });

    document.getElementById('nav-admin-settings')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderSettings();
      App.setActiveNav('nav-admin-settings');
    });
  },

  renderDashboard() {
    const users = DB.getAll(DB.KEYS.USERS).filter(u => u.role === 'kader');
    const courses = DB.getAll(DB.KEYS.COURSES);
    const enrollments = DB.getAll(DB.KEYS.ENROLLMENTS);

    const completed = enrollments.filter(e => e.status === 'completed').length;
    const inProgress = enrollments.filter(e => e.status !== 'completed').length;

    let html = `
      <div class="header-section" style="margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 2.4rem; background: linear-gradient(135deg, var(--accent-blue), #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px;">Dashboard Admin</h2>
            <p style="color: var(--text-muted); font-size: 1.05rem;">Ringkasan performa LMS Kader Rumah Data Kependudukan</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: rgba(59,130,246,0.08); border-radius: 12px; border: 1px solid rgba(59,130,246,0.15);">
            <span style="font-size: 1.2rem;">📅</span>
            <span style="font-size: 0.9rem; font-weight: 600; color: var(--accent-blue);">${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 36px;">
        <div class="stat-card" style="background: linear-gradient(135deg, #3B82F6, #6366f1); border: none; color: white; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.15); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -30px; right: 10px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          <div style="z-index: 2; position: relative;">
            <div style="font-size: 2rem; margin-bottom: 8px;">👥</div>
            <div style="font-size: 2.8rem; font-weight: 800; line-height: 1;">${users.length}</div>
            <div style="font-size: 0.85rem; margin-top: 6px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Total Kader</div>
          </div>
        </div>

        <div class="stat-card" style="background: linear-gradient(135deg, #14b8a6, #06b6d4); border: none; color: white; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.15); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -30px; right: 10px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          <div style="z-index: 2; position: relative;">
            <div style="font-size: 2rem; margin-bottom: 8px;">📚</div>
            <div style="font-size: 2.8rem; font-weight: 800; line-height: 1;">${courses.length}</div>
            <div style="font-size: 0.85rem; margin-top: 6px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Total Kursus</div>
          </div>
        </div>

        <div class="stat-card" style="background: linear-gradient(135deg, #f59e0b, #ef4444); border: none; color: white; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.15); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -30px; right: 10px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          <div style="z-index: 2; position: relative;">
            <div style="font-size: 2rem; margin-bottom: 8px;">🎓</div>
            <div style="font-size: 2.8rem; font-weight: 800; line-height: 1;">${completed}</div>
            <div style="font-size: 0.85rem; margin-top: 6px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Sertifikat Terbit</div>
          </div>
        </div>

        <div class="stat-card" style="background: linear-gradient(135deg, #8b5cf6, #ec4899); border: none; color: white; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.15); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -30px; right: 10px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          <div style="z-index: 2; position: relative;">
            <div style="font-size: 2rem; margin-bottom: 8px;">📊</div>
            <div style="font-size: 2.8rem; font-weight: 800; line-height: 1;">${inProgress}</div>
            <div style="font-size: 0.85rem; margin-top: 6px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Sedang Belajar</div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        <!-- Announcements -->
        <div style="background: rgba(255,255,255,0.6); backdrop-filter: blur(16px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.8); padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #3B82F6, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: white;">📢</div>
            <div>
              <h3 style="font-size: 1.2rem; color: var(--text-main); margin: 0;">Pengumuman Terbaru</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Informasi penting untuk kader</p>
            </div>
          </div>
          <div class="announcement-list" style="display: flex; flex-direction: column; gap: 16px;">
            ${DB.getAll(DB.KEYS.ANNOUNCEMENTS).map((a, i) => `
              <div style="padding: 20px; background: ${i === 0 ? 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))' : 'rgba(0,0,0,0.02)'}; border-radius: 16px; border-left: 4px solid ${i === 0 ? 'var(--accent-blue)' : 'var(--accent-teal)'}; transition: all 0.3s ease;">
                <h4 style="font-size: 1rem; color: var(--text-main); margin-bottom: 8px; font-weight: 700;">${a.title}</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 10px;">${a.content}</p>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="width: 24px; height: 24px; border-radius: 8px; background: linear-gradient(135deg, var(--accent-blue), #8b5cf6); display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; color: white;">👤</span>
                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${a.author} · ${new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Quick Info Panel -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div style="background: rgba(255,255,255,0.6); backdrop-filter: blur(16px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.8); padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
              <div style="width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #14b8a6, #06b6d4); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: white;">⚡</div>
              <h3 style="font-size: 1.1rem; color: var(--text-main); margin: 0;">Aktivitas Cepat</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <a href="#" onclick="document.getElementById('nav-admin-courses').click(); return false;" style="display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(59,130,246,0.06); border-radius: 12px; text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.9rem; transition: all 0.3s ease; border: 1px solid transparent;" onmouseover="this.style.borderColor='rgba(59,130,246,0.3)'" onmouseout="this.style.borderColor='transparent'">
                <span style="font-size: 1.3rem;">📚</span> Kelola Kursus
              </a>
              <a href="#" onclick="Admin.renderAnnouncements(); return false;" style="display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(59,130,246,0.06); border-radius: 12px; text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.9rem; transition: all 0.3s ease; border: 1px solid transparent;" onmouseover="this.style.borderColor='rgba(59,130,246,0.3)'" onmouseout="this.style.borderColor='transparent'">
                <span style="font-size: 1.3rem;">📢</span> Kelola Pengumuman
              </a>
              <a href="#" onclick="document.getElementById('nav-admin-kader').click(); return false;" style="display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(20,184,166,0.06); border-radius: 12px; text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.9rem; transition: all 0.3s ease; border: 1px solid transparent;" onmouseover="this.style.borderColor='rgba(20,184,166,0.3)'" onmouseout="this.style.borderColor='transparent'">
                <span style="font-size: 1.3rem;">👥</span> Lihat Data Kader
              </a>
              <a href="#" onclick="document.getElementById('nav-admin-settings').click(); return false;" style="display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(139,92,246,0.06); border-radius: 12px; text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.9rem; transition: all 0.3s ease; border: 1px solid transparent;" onmouseover="this.style.borderColor='rgba(139,92,246,0.3)'" onmouseout="this.style.borderColor='transparent'">
                <span style="font-size: 1.3rem;">🎓</span> Atur Sertifikat
              </a>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #0A192F, #233554); border-radius: 24px; padding: 28px; color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.15); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: rgba(59,130,246,0.2); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -20px; left: -20px; width: 70px; height: 70px; background: rgba(20,184,166,0.15); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 2;">
              <div style="font-size: 1.5rem; margin-bottom: 8px;">💡</div>
              <h4 style="font-size: 1rem; margin-bottom: 8px; font-weight: 700;">Tips Hari Ini</h4>
              <p style="font-size: 0.85rem; opacity: 0.8; line-height: 1.6;">Pastikan semua kader telah menyelesaikan Pre-Test sebelum mengakses materi pembelajaran.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    App.setContent(html);
  },

  renderCourses() {
    const courses = DB.getAll(DB.KEYS.COURSES);
    let html = `
      <div class="header-section">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2>Manajemen Kursus</h2>
            <p>Kelola materi pelatihan kader</p>
          </div>
          <button class="btn btn-primary" id="addCourseBtn">+ Tambah Kursus</button>
        </div>
      </div>

      <div id="addCourseFormContainer" style="display:none; margin-bottom:20px;">
        <h3 style="margin-bottom:20px; color:var(--text-main);">Tambah Kursus / Materi Baru</h3>
        <form id="adminAddCourseForm">
          <div style="display:flex; gap:15px;">
            <div class="form-group" style="flex:2;">
              <label>Judul Kursus</label>
              <input type="text" name="title" class="form-control" required placeholder="Contoh: Pengenalan Stunting">
            </div>
            <div class="form-group" style="flex:1;">
              <label>Kategori</label>
              <select name="category" class="form-control" required>
                <option value="Dasar">Dasar</option>
                <option value="Teknis">Teknis</option>
                <option value="Lanjutan">Lanjutan</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
            <div class="form-group" style="flex:1;">
              <label>Durasi</label>
              <input type="text" name="duration" class="form-control" required placeholder="Contoh: 2 Jam">
            </div>
          </div>
          <div class="form-group">
            <label>Deskripsi Singkat</label>
            <textarea name="description" class="form-control" rows="2" required placeholder="Deskripsi materi..."></textarea>
          </div>
          <div style="display:flex; gap:15px;">
            <div class="form-group" style="flex:1;">
              <label>Batas Nilai Kelulusan (Passing Grade)</label>
              <input type="number" name="passingGrade" class="form-control" value="70" required min="1" max="100">
            </div>
            <div class="form-group" style="flex:2;">
              <label>Link Video YouTube Materi (Opsional)</label>
              <input type="url" name="videoUrl" class="form-control" placeholder="https://www.youtube.com/embed/...">
            </div>
          </div>
          <div style="display:flex; gap:15px; margin-top: -5px; margin-bottom: 15px;">
            <div class="form-group" style="flex:1;">
              <label>Link PPT / Google Slides Embed</label>
              <input type="url" name="docUrl" class="form-control" placeholder="https://docs.google.com/presentation/d/.../embed">
            </div>
            <div class="form-group" style="flex:1;">
              <label>ATAU Unggah File (Maks 2MB)</label>
              <input type="file" id="pptUpload" accept=".pdf,.ppt,.pptx" class="form-control">
            </div>
            <div class="form-group" style="flex:1;">
              <label>Waktu Minimal Baca (Detik)</label>
              <input type="number" name="readTimer" class="form-control" value="15" min="0">
            </div>
          </div>
          
          <div style="background: rgba(0,0,0,0.02); padding: 20px; border-radius: 12px; margin-bottom: 15px; border: 1px solid var(--glass-border);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
              <h4 style="color:var(--text-main); margin:0;">📝 Soal Pre-Test</h4>
              <button type="button" class="btn btn-sm btn-outline" onclick="Admin.addQuestionField('pre')">+ Tambah Soal Pre-Test</button>
            </div>
            <div id="preTestContainer"></div>
          </div>

          <div style="background: rgba(0,0,0,0.02); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--glass-border);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
              <h4 style="color:var(--text-main); margin:0;">📝 Soal Post-Test</h4>
              <button type="button" class="btn btn-sm btn-outline" onclick="Admin.addQuestionField('post')">+ Tambah Soal Post-Test</button>
            </div>
            <div id="postTestContainer"></div>
          </div>

          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-outline" id="cancelAddCourseBtn">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Materi</button>
          </div>
        </form>
      </div>

      <!-- EDIT COURSE FORM -->
      <div id="editCourseFormContainer" style="display:none; margin-bottom:20px;">
        <h3 style="margin-bottom:20px; color:var(--text-main);">Edit Kursus</h3>
        <form id="adminEditCourseForm">
          <input type="hidden" name="courseId" id="editCourseId">
          <div style="display:flex; gap:15px;">
            <div class="form-group" style="flex:2;">
              <label>Judul Kursus</label>
              <input type="text" name="title" id="editCourseTitle" class="form-control" required>
            </div>
            <div class="form-group" style="flex:1;">
              <label>Kategori</label>
              <select name="category" id="editCourseCategory" class="form-control" required>
                <option value="Dasar">Dasar</option>
                <option value="Teknis">Teknis</option>
                <option value="Lanjutan">Lanjutan</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
            <div class="form-group" style="flex:1;">
              <label>Durasi</label>
              <input type="text" name="duration" id="editCourseDuration" class="form-control" required>
            </div>
          </div>
          <div class="form-group">
            <label>Deskripsi Singkat</label>
            <textarea name="description" id="editCourseDescription" class="form-control" rows="2" required></textarea>
          </div>
          <div class="form-group" style="width: 30%;">
            <label>Batas Nilai Kelulusan (Passing Grade)</label>
            <input type="number" name="passingGrade" id="editCoursePassingGrade" class="form-control" required min="1" max="100">
          </div>
          <p style="font-size:0.85rem; color:var(--accent-amber); margin-bottom:15px;">*Catatan: Saat ini edit hanya untuk mengubah informasi dasar kursus. Untuk mengganti file materi/video secara keseluruhan, silakan hapus kursus ini dan buat yang baru.</p>
          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-outline" id="cancelEditCourseBtn">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Kursus</th>
              <th>Kategori</th>
              <th>Modul</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${courses.map(c => `
              <tr>
                <td><strong>${c.title}</strong></td>
                <td>${c.category}</td>
                <td>${c.totalModules} Modul</td>
                <td><span class="badge ${c.status === 'published' ? 'badge-success' : 'badge-warning'}">${c.status}</span></td>
                <td>
                  <button class="btn btn-sm btn-primary" onclick="Admin.renderCourseModules('${c.id}')">Kelola Modul</button>
                  <button class="btn btn-sm btn-outline" onclick="Admin.openEditCourse('${c.id}')">Edit Info</button>
                  <button class="btn btn-sm" style="background:#e74c3c; color:white; border:none;" onclick="Admin.deleteCourse('${c.id}')">Hapus</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    App.setContent(html);

    document.getElementById('addCourseBtn')?.addEventListener('click', () => {
      document.getElementById('addCourseFormContainer').style.display = 'block';
      document.getElementById('addCourseBtn').style.display = 'none';
      
      // Initialize with 1 question each if empty
      if (document.getElementById('preTestContainer').children.length === 0) {
        this.addQuestionField('pre');
      }
      if (document.getElementById('postTestContainer').children.length === 0) {
        this.addQuestionField('post');
      }
    });

    document.getElementById('cancelAddCourseBtn')?.addEventListener('click', () => {
      document.getElementById('addCourseFormContainer').style.display = 'none';
      document.getElementById('addCourseBtn').style.display = 'block';
    });

    document.getElementById('adminAddCourseForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      // Extract Dynamic Questions
      const getQuestions = (type) => {
        const container = document.getElementById(type + 'TestContainer');
        const blocks = container.querySelectorAll('.question-block');
        return Array.from(blocks).map(block => {
          const qText = block.querySelector('.q-text').value;
          const opts = Array.from(block.querySelectorAll('.q-opt')).map(inp => inp.value);
          const ans = parseInt(block.querySelector('.q-ans').value);
          return { id: DB.genId(), question: qText, options: opts, answer: ans };
        });
      };

      const preTestQuestions = getQuestions('pre');
      const postTestQuestions = getQuestions('post');

      if (preTestQuestions.length === 0 || postTestQuestions.length === 0) {
        alert('Minimal harus ada 1 soal Pre-Test dan 1 soal Post-Test!');
        return;
      }

      const newCourse = {
        id: DB.genId(),
        title: data.title,
        description: data.description,
        thumbnail: '',
        category: data.category,
        duration: data.duration,
        totalModules: 1,
        passingGrade: parseInt(data.passingGrade),
        readTimer: parseInt(data.readTimer) || 15,
        status: 'published',
        createdAt: new Date().toISOString(),
        modules: [],
        preTest: preTestQuestions,
        postTest: postTestQuestions
      };

      const fileInput = document.getElementById('pptUpload');
      let fileDataURL = null;
      let fileName = null;
      
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 2.5 * 1024 * 1024) {
          alert('Ukuran file terlalu besar! Maksimal 2MB untuk simulasi ini.');
          return;
        }
        fileName = file.name;
        fileDataURL = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      }

      if (data.videoUrl && data.videoUrl.trim() !== '') {
        // Create video module
        let embedUrl = data.videoUrl;
        if(embedUrl.includes('watch?v=')) {
           embedUrl = embedUrl.replace('watch?v=', 'embed/');
        }
        newCourse.modules.push({
          id: DB.genId(),
          title: 'Materi Video: ' + data.title,
          type: 'video',
          content: {
            videoUrl: embedUrl,
            videoTitle: data.title,
            description: data.description
          },
          order: 1
        });
      } else if (fileDataURL) {
        // Create File module
        newCourse.modules.push({
          id: DB.genId(),
          title: 'File Materi: ' + data.title,
          type: 'file',
          content: {
            fileName: fileName,
            fileData: fileDataURL,
            description: data.description
          },
          order: 1
        });
      } else if (data.docUrl && data.docUrl.trim() !== '') {
        // Create Iframe module
        newCourse.modules.push({
          id: DB.genId(),
          title: 'Dokumen Presentasi: ' + data.title,
          type: 'iframe',
          content: {
            url: data.docUrl,
            description: data.description
          },
          order: 1
        });
      } else {
        // Create slide module
        newCourse.modules.push({
          id: DB.genId(),
          title: 'Materi Dasar: ' + data.title,
          type: 'slide',
          content: {
            slides: [
              { title: data.title, body: data.description + '\n\nSilakan simak materi ini dengan seksama. Modul ini sedang dalam tahap pengembangan konten lebih lanjut oleh Admin.' }
            ]
          },
          order: 1
        });
      }

      DB.add(DB.KEYS.COURSES, newCourse);
      alert('Kursus/Materi berhasil ditambahkan!');
      this.renderCourses();
    });

    document.getElementById('cancelEditCourseBtn')?.addEventListener('click', () => {
      document.getElementById('editCourseFormContainer').style.display = 'none';
      document.getElementById('addCourseBtn').style.display = 'block';
    });

    document.getElementById('adminEditCourseForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      const courseId = data.courseId;

      const success = DB.update(DB.KEYS.COURSES, courseId, {
        title: data.title,
        description: data.description,
        category: data.category,
        duration: data.duration,
        passingGrade: parseInt(data.passingGrade)
      });

      if (success) {
        alert('Informasi kursus berhasil diperbarui!');
        this.renderCourses();
      } else {
        alert('Gagal memperbarui kursus.');
      }
    });
  },

  openEditCourse(courseId) {
    const course = DB.find(DB.KEYS.COURSES, courseId);
    if (!course) return;

    document.getElementById('addCourseFormContainer').style.display = 'none';
    document.getElementById('addCourseBtn').style.display = 'none';
    document.getElementById('editCourseFormContainer').style.display = 'block';

    document.getElementById('editCourseId').value = course.id;
    document.getElementById('editCourseTitle').value = course.title;
    document.getElementById('editCourseCategory').value = course.category;
    document.getElementById('editCourseDuration').value = course.duration;
    document.getElementById('editCourseDescription').value = course.description;
    document.getElementById('editCoursePassingGrade').value = course.passingGrade;
    
    // Scroll to top to see form
    document.querySelector('.main-content-wrapper').scrollTo(0,0);
  },

  addQuestionField(type) {
    const container = document.getElementById(type + 'TestContainer');
    const div = document.createElement('div');
    div.className = 'question-block';
    div.style.cssText = 'background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; position: relative; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);';
    div.innerHTML = `
      <button type="button" class="btn btn-sm btn-outline" onclick="this.parentElement.remove()" style="position:absolute; top:15px; right:15px; border-color:#e74c3c; color:#e74c3c; padding: 4px 8px; font-size: 0.8rem;">Hapus</button>
      <div class="form-group" style="margin-right: 70px;">
        <input type="text" class="form-control q-text" placeholder="Masukkan pertanyaan..." required>
      </div>
      <div style="display:flex; gap:10px;">
        <input type="text" class="form-control q-opt" placeholder="Opsi A" required>
        <input type="text" class="form-control q-opt" placeholder="Opsi B" required>
        <input type="text" class="form-control q-opt" placeholder="Opsi C" required>
        <input type="text" class="form-control q-opt" placeholder="Opsi D" required>
        <select class="form-control q-ans" required style="width: 150px;">
          <option value="0">Jawaban: A</option>
          <option value="1">Jawaban: B</option>
          <option value="2">Jawaban: C</option>
          <option value="3">Jawaban: D</option>
        </select>
      </div>
    `;
    container.appendChild(div);
  },

  deleteCourse(courseId) {
    if(confirm('Anda yakin ingin menghapus kursus ini? Semua data terkait (termasuk progress kader) yang berkaitan dengan kursus ini mungkin akan terdampak.')) {
      DB.remove(DB.KEYS.COURSES, courseId);
      this.renderCourses();
    }
  },

  renderKader() {
    const users = DB.getAll(DB.KEYS.USERS).filter(u => u.role === 'kader');
    let html = `
      <div class="header-section">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2>Data Kader</h2>
            <p>Daftar kader terdaftar di LMS</p>
          </div>
          <button class="btn btn-primary" id="addKaderBtn">+ Tambah Kader</button>
        </div>
      </div>
      
      <div id="addKaderFormContainer" style="display:none; margin-bottom:20px;">
        <h3 style="margin-bottom:20px; color:var(--text-main);">Tambah Kader Baru</h3>
        <form id="adminAddKaderForm">
          <div style="display:flex; gap:15px;">
            <div class="form-group" style="flex:1;">
              <label>Nama Lengkap</label>
              <input type="text" name="name" class="form-control" required>
            </div>
            <div class="form-group" style="flex:1;">
              <label>NIK</label>
              <input type="number" name="nik" class="form-control" required>
            </div>
          </div>
          <div style="display:flex; gap:15px;">
            <div class="form-group" style="flex:1;">
              <label>Username Login</label>
              <input type="text" name="username" class="form-control" required>
            </div>
            <div class="form-group" style="flex:1;">
              <label>Password</label>
              <input type="password" name="password" class="form-control" required>
            </div>
          </div>
          <div style="display:flex; gap:15px;">
            <div class="form-group" style="flex:1;">
              <label>Kabupaten/Kota</label>
              <select name="kabupaten" class="form-control" required>
                <option value="">Pilih Kabupaten</option>
                <option value="Majene">Majene</option>
                <option value="Polewali Mandar">Polewali Mandar</option>
                <option value="Mamasa">Mamasa</option>
                <option value="Mamuju">Mamuju</option>
                <option value="Pasangkayu">Pasangkayu</option>
                <option value="Mamuju Tengah">Mamuju Tengah</option>
              </select>
            </div>
            <div class="form-group" style="flex:1;">
              <label>Kecamatan</label>
              <input type="text" name="kecamatan" class="form-control" required>
            </div>
          </div>
          <div style="display:flex; gap:15px;">
            <div class="form-group" style="flex:1;">
              <label>Desa/Kelurahan</label>
              <input type="text" name="desa" class="form-control" required>
            </div>
            <div class="form-group" style="flex:1;">
              <label>No. HP</label>
              <input type="number" name="noHp" class="form-control" required>
            </div>
          </div>
          <p id="adminAddError" style="color:#e74c3c; margin-bottom:15px;"></p>
          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-outline" id="cancelAddKaderBtn">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Kader</button>
          </div>
        </form>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama & NIK</th>
              <th>Username</th>
              <th>Asal Daerah</th>
              <th>Kontak</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>
                  <strong>${u.name}</strong><br>
                  <small>${u.nik}</small>
                </td>
                <td><span class="badge badge-primary">${u.username}</span></td>
                <td>
                  ${u.desa}<br>
                  <small>${u.kecamatan || '-'}, ${u.kabupaten || '-'}</small>
                </td>
                <td>${u.noHp}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    App.setContent(html);

    document.getElementById('addKaderBtn')?.addEventListener('click', () => {
      document.getElementById('addKaderFormContainer').style.display = 'block';
      document.getElementById('addKaderBtn').style.display = 'none';
    });

    document.getElementById('cancelAddKaderBtn')?.addEventListener('click', () => {
      document.getElementById('addKaderFormContainer').style.display = 'none';
      document.getElementById('addKaderBtn').style.display = 'block';
    });

    document.getElementById('adminAddKaderForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      const res = Auth.register(data);
      if (res.success) {
        alert('Kader berhasil ditambahkan!');
        this.renderKader();
      } else {
        document.getElementById('adminAddError').innerText = res.message;
      }
    });
  },

  renderQuestionBank(courseId = null, tab = 'pre') {
    const courses = DB.getAll(DB.KEYS.COURSES);
    if (courses.length === 0) {
      App.setContent(`<div class="header-section"><h2>Bank Soal</h2><p>Belum ada kursus. Silakan buat kursus terlebih dahulu.</p></div>`);
      return;
    }

    const selectedCourseId = courseId || courses[0].id;
    const course = courses.find(c => c.id === selectedCourseId);
    
    // Get question bank data
    const questionBanks = DB.getAll(DB.KEYS.QUESTION_BANK);
    let bankData = questionBanks.find(qb => qb.courseId === selectedCourseId);
    if (!bankData) {
      bankData = { courseId: selectedCourseId, preTest: [], postTest: [] };
      DB.add(DB.KEYS.QUESTION_BANK, bankData);
    }

    const currentQuestions = tab === 'pre' ? bankData.preTest : bankData.postTest;
    const displayCount = tab === 'pre' ? course.preTestCount : course.postTestCount;

    let html = `
      <div class="header-section">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2>Bank Soal Ujian</h2>
            <p>Kelola kumpulan soal yang akan diacak untuk setiap kader</p>
          </div>
        </div>
      </div>

      <div class="glass-panel" style="padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; gap: 20px; align-items: flex-end;">
          <div class="form-group" style="flex: 2; margin-bottom: 0;">
            <label>Pilih Kursus</label>
            <select class="form-control" id="qbCourseSelect" onchange="Admin.renderQuestionBank(this.value, '${tab}')">
              ${courses.map(c => `<option value="${c.id}" ${c.id === selectedCourseId ? 'selected' : ''}>${c.title}</option>`).join('')}
            </select>
          </div>
          <div style="flex: 1; margin-bottom: 0;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="qbUseRandom" ${course.useQuestionBank ? 'checked' : ''} style="width:20px; height:20px;">
              <span style="font-weight:600;">Aktifkan Pengacakan Soal</span>
            </label>
          </div>
        </div>
      </div>

      <div class="tabs-container" style="margin-bottom: 24px; border-bottom: 1px solid var(--glass-border); display: flex; gap: 10px;">
        <button class="btn ${tab === 'pre' ? 'btn-primary' : 'btn-outline'}" onclick="Admin.renderQuestionBank('${selectedCourseId}', 'pre')">Pre-Test Pool (${bankData.preTest.length})</button>
        <button class="btn ${tab === 'post' ? 'btn-primary' : 'btn-outline'}" onclick="Admin.renderQuestionBank('${selectedCourseId}', 'post')">Post-Test Pool (${bankData.postTest.length})</button>
      </div>

      <div style="display: flex; gap: 24px;">
        <!-- Left Column: Settings -->
        <div style="flex: 1;">
          <div class="glass-panel" style="padding: 20px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 15px;">Pengaturan Ujian</h3>
            <div class="form-group">
              <label>Jumlah soal yang ditampilkan ke kader</label>
              <div style="display:flex; gap:10px;">
                <input type="number" id="qbDisplayCount" class="form-control" value="${displayCount}" min="1" max="${currentQuestions.length || 1}">
                <button class="btn btn-primary" onclick="Admin.saveQuestionBankConfig('${selectedCourseId}', '${tab}')">Simpan</button>
              </div>
            </div>
            
            <div style="background: rgba(59,130,246,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid var(--accent-blue);">
              <p style="margin:0; font-size: 0.9rem;">
                <strong>Statistik:</strong> Saat ini ada <strong>${currentQuestions.length}</strong> soal di bank. 
                Sistem akan mengacak dan mengambil <strong>${displayCount || 0}</strong> soal untuk setiap kader.
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column: Question List -->
        <div style="flex: 2;">
          <div class="glass-panel" style="padding: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
              <h3 style="margin: 0;">Daftar Soal (${tab === 'pre' ? 'Pre-Test' : 'Post-Test'})</h3>
              <button class="btn btn-sm btn-primary" onclick="Admin.showAddQuestionForm('${selectedCourseId}', '${tab}')">+ Tambah Soal</button>
            </div>

            <!-- Form Tambah Soal (Hidden by default) -->
            <div id="qbAddQuestionFormContainer" style="display:none; background: rgba(0,0,0,0.03); padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid var(--glass-border);">
              <h4 style="margin-bottom: 10px;">Tambah Soal Baru</h4>
              <div class="form-group">
                <input type="text" id="qbNewQText" class="form-control" placeholder="Pertanyaan..." required>
              </div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
                <input type="text" id="qbNewOptA" class="form-control" placeholder="Opsi A" required>
                <input type="text" id="qbNewOptB" class="form-control" placeholder="Opsi B" required>
                <input type="text" id="qbNewOptC" class="form-control" placeholder="Opsi C" required>
                <input type="text" id="qbNewOptD" class="form-control" placeholder="Opsi D" required>
              </div>
              <div style="display:flex; gap:10px; align-items:center;">
                <label style="margin:0; min-width:100px;">Jawaban Benar:</label>
                <select id="qbNewAns" class="form-control" style="width:150px;">
                  <option value="0">A</option><option value="1">B</option>
                  <option value="2">C</option><option value="3">D</option>
                </select>
                <div style="flex:1; text-align:right;">
                  <button class="btn btn-sm btn-outline" onclick="document.getElementById('qbAddQuestionFormContainer').style.display='none'">Batal</button>
                  <button class="btn btn-sm btn-success" onclick="Admin.saveNewBankQuestion('${selectedCourseId}', '${tab}')">Simpan Soal</button>
                </div>
              </div>
            </div>

            <div class="question-list" style="display:flex; flex-direction:column; gap:12px; max-height: 500px; overflow-y: auto; padding-right: 5px;">
              ${currentQuestions.map((q, idx) => `
                <div style="background: white; border: 1px solid #eee; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                    <div style="font-weight:600; width: 85%;">
                      <span style="color:var(--text-muted); margin-right:8px;">#${idx+1}</span> ${q.question}
                    </div>
                    <button class="btn btn-sm btn-outline" style="color:#e74c3c; border-color:#e74c3c; padding:2px 8px; font-size:0.75rem;" onclick="Admin.deleteBankQuestion('${selectedCourseId}', '${tab}', '${q.id}')">Hapus</button>
                  </div>
                  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:0.85rem;">
                    ${q.options.map((opt, oIdx) => `
                      <div style="padding: 6px 10px; background: ${q.answer === oIdx ? 'rgba(46,204,113,0.1)' : '#f9f9f9'}; border: 1px solid ${q.answer === oIdx ? '#2ecc71' : '#eee'}; border-radius: 4px; ${q.answer === oIdx ? 'font-weight:600; color:#27ae60;' : 'color:#555;'}">
                        ${String.fromCharCode(65 + oIdx)}. ${opt}
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
              ${currentQuestions.length === 0 ? `<p style="text-align:center; color:var(--text-muted); padding: 20px;">Belum ada soal di bank ini.</p>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    App.setContent(html);

    // Attach event listener for useQuestionBank toggle
    document.getElementById('qbUseRandom')?.addEventListener('change', (e) => {
      DB.update(DB.KEYS.COURSES, selectedCourseId, { useQuestionBank: e.target.checked });
    });
  },

  showAddQuestionForm() {
    document.getElementById('qbAddQuestionFormContainer').style.display = 'block';
  },

  saveNewBankQuestion(courseId, tab) {
    const qText = document.getElementById('qbNewQText').value;
    const optA = document.getElementById('qbNewOptA').value;
    const optB = document.getElementById('qbNewOptB').value;
    const optC = document.getElementById('qbNewOptC').value;
    const optD = document.getElementById('qbNewOptD').value;
    const ans = parseInt(document.getElementById('qbNewAns').value);

    if(!qText || !optA || !optB || !optC || !optD) {
      alert('Mohon lengkapi pertanyaan dan semua opsi jawaban!');
      return;
    }

    const questionBanks = DB.getAll(DB.KEYS.QUESTION_BANK);
    let bankData = questionBanks.find(qb => qb.courseId === courseId);
    if (!bankData) return;

    const newQuestion = {
      id: DB.genId(),
      question: qText,
      options: [optA, optB, optC, optD],
      answer: ans
    };

    if (tab === 'pre') bankData.preTest.push(newQuestion);
    else bankData.postTest.push(newQuestion);

    DB.set(DB.KEYS.QUESTION_BANK, questionBanks);
    this.renderQuestionBank(courseId, tab);
  },

  deleteBankQuestion(courseId, tab, questionId) {
    if(!confirm('Hapus soal ini dari bank?')) return;

    const questionBanks = DB.getAll(DB.KEYS.QUESTION_BANK);
    let bankData = questionBanks.find(qb => qb.courseId === courseId);
    if (!bankData) return;

    if (tab === 'pre') {
      bankData.preTest = bankData.preTest.filter(q => q.id !== questionId);
    } else {
      bankData.postTest = bankData.postTest.filter(q => q.id !== questionId);
    }

    DB.set(DB.KEYS.QUESTION_BANK, questionBanks);
    this.renderQuestionBank(courseId, tab);
  },

  saveQuestionBankConfig(courseId, tab) {
    const count = parseInt(document.getElementById('qbDisplayCount').value);
    const questionBanks = DB.getAll(DB.KEYS.QUESTION_BANK);
    let bankData = questionBanks.find(qb => qb.courseId === courseId);
    
    if (tab === 'pre') {
      if (count > bankData.preTest.length) {
        alert('Jumlah soal yang ditampilkan tidak boleh melebihi jumlah soal di bank!');
        return;
      }
      DB.update(DB.KEYS.COURSES, courseId, { preTestCount: count });
    } else {
      if (count > bankData.postTest.length) {
        alert('Jumlah soal yang ditampilkan tidak boleh melebihi jumlah soal di bank!');
        return;
      }
      DB.update(DB.KEYS.COURSES, courseId, { postTestCount: count });
    }
    
    alert('Pengaturan jumlah soal berhasil disimpan!');
    this.renderQuestionBank(courseId, tab);
  },

  renderAnnouncements() {
    const announcements = DB.getAll(DB.KEYS.ANNOUNCEMENTS);
    
    let html = `
      <div class="header-section">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2>Kelola Pengumuman</h2>
            <p>Buat dan edit pengumuman untuk ditampilkan di dashboard admin dan kader</p>
          </div>
          <button class="btn btn-primary" onclick="Admin.showAnnouncementForm()">+ Buat Pengumuman</button>
        </div>
      </div>

      <div id="announcementFormContainer" class="glass-panel" style="display:none; padding: 24px; margin-bottom: 24px;">
        <h3 id="annFormTitle" style="margin-bottom: 20px;">Buat Pengumuman Baru</h3>
        <form id="annForm">
          <input type="hidden" id="annId">
          <div class="form-group">
            <label>Judul Pengumuman</label>
            <input type="text" id="annTitle" class="form-control" required placeholder="Contoh: Jadwal Pelatihan Bulan Juni">
          </div>
          <div class="form-group">
            <label>Konten / Isi Pengumuman</label>
            <textarea id="annContent" class="form-control" style="height: 120px;" required placeholder="Tulis detail pengumuman di sini..."></textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn btn-outline" onclick="Admin.hideAnnouncementForm()">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Pengumuman</button>
          </div>
        </form>
      </div>

      <div class="announcement-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px;">
        ${announcements.map(a => `
          <div class="glass-panel" style="padding: 24px; border-left: 5px solid var(--accent-blue);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 12px;">
              <h4 style="margin:0; font-size: 1.1rem; color: var(--text-main);">${a.title}</h4>
              <div style="display:flex; gap:5px;">
                <button class="btn btn-sm btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" onclick="Admin.editAnnouncement('${a.id}')">Edit</button>
                <button class="btn btn-sm btn-outline" style="padding: 4px 8px; font-size: 0.75rem; color:#e74c3c; border-color:#e74c3c;" onclick="Admin.deleteAnnouncement('${a.id}')">Hapus</button>
              </div>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 15px;">${a.content}</p>
            <div style="display:flex; justify-content:space-between; font-size: 0.8rem; color: var(--text-muted);">
              <span>Oleh: <strong>${a.author}</strong></span>
              <span>${new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        `).join('')}
        ${announcements.length === 0 ? '<p style="grid-column: 1/-1; text-align:center; padding: 40px; color:var(--text-muted);">Belum ada pengumuman.</p>' : ''}
      </div>
    `;
    App.setContent(html);

    document.getElementById('annForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveAnnouncement();
    });
  },

  showAnnouncementForm() {
    document.getElementById('annId').value = '';
    document.getElementById('annTitle').value = '';
    document.getElementById('annContent').value = '';
    document.getElementById('annFormTitle').innerText = 'Buat Pengumuman Baru';
    document.getElementById('announcementFormContainer').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  hideAnnouncementForm() {
    document.getElementById('announcementFormContainer').style.display = 'none';
  },

  editAnnouncement(id) {
    const ann = DB.getAll(DB.KEYS.ANNOUNCEMENTS).find(a => a.id === id);
    if (!ann) return;

    document.getElementById('annId').value = ann.id;
    document.getElementById('annTitle').value = ann.title;
    document.getElementById('annContent').value = ann.content;
    document.getElementById('annFormTitle').innerText = 'Edit Pengumuman';
    document.getElementById('announcementFormContainer').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  saveAnnouncement() {
    const id = document.getElementById('annId').value;
    const title = document.getElementById('annTitle').value;
    const content = document.getElementById('annContent').value;
    const user = Auth.getCurrentUser();

    let announcements = DB.getAll(DB.KEYS.ANNOUNCEMENTS);

    if (id) {
      // Update
      const index = announcements.findIndex(a => a.id === id);
      if (index !== -1) {
        announcements[index] = { ...announcements[index], title, content, date: new Date().toISOString() };
      }
    } else {
      // Add
      announcements.unshift({
        id: DB.genId(),
        title,
        content,
        author: user.name,
        date: new Date().toISOString()
      });
    }

    DB.set(DB.KEYS.ANNOUNCEMENTS, announcements);
    alert('Pengumuman berhasil disimpan!');
    this.renderAnnouncements();
  },

  deleteAnnouncement(id) {
    if (!confirm('Hapus pengumuman ini?')) return;
    let announcements = DB.getAll(DB.KEYS.ANNOUNCEMENTS).filter(a => a.id !== id);
    DB.set(DB.KEYS.ANNOUNCEMENTS, announcements);
    this.renderAnnouncements();
  },

  renderCourseModules(courseId) {
    const course = DB.find(DB.KEYS.COURSES, courseId);
    if (!course) return;

    let html = `
      <div class="header-section">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2>Kelola Modul: ${course.title}</h2>
            <p>Tambah, urutkan, atau hapus modul pembelajaran untuk kursus ini</p>
          </div>
          <button class="btn btn-outline" onclick="Admin.renderCourses()">Kembali ke Daftar Kursus</button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px;">
        <!-- Form Tambah Modul -->
        <div>
          <div class="glass-panel" style="padding: 24px; position: sticky; top: 20px;">
            <h3 style="margin-bottom: 20px;">Tambah Modul Baru</h3>
            <form id="addModuleForm">
              <div class="form-group">
                <label>Judul Modul</label>
                <input type="text" id="modTitle" class="form-control" required placeholder="Contoh: Pengenalan DataKU">
              </div>
              <div class="form-group">
                <label>Tipe Konten</label>
                <select id="modType" class="form-control" onchange="Admin.toggleModInputs()">
                  <option value="slide">Slide Materi (Teks)</option>
                  <option value="video">Video (YouTube)</option>
                  <option value="iframe">Dokumen/Iframe (Link)</option>
                </select>
              </div>
              
              <div id="modInputSlide" class="mod-input-group">
                <div class="form-group">
                  <label>Isi Materi (Slide)</label>
                  <textarea id="modSlideContent" class="form-control" style="height: 150px;" placeholder="Tulis konten materi di sini..."></textarea>
                </div>
              </div>

              <div id="modInputVideo" class="mod-input-group" style="display:none;">
                <div class="form-group">
                  <label>URL Video YouTube</label>
                  <input type="text" id="modVideoUrl" class="form-control" placeholder="https://www.youtube.com/watch?v=...">
                </div>
              </div>

              <div id="modInputIframe" class="mod-input-group" style="display:none;">
                <div class="form-group">
                  <label>URL Dokumen/Web</label>
                  <input type="text" id="modIframeUrl" class="form-control" placeholder="https://example.com/document">
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-full">Simpan Modul</button>
            </form>
          </div>
        </div>

        <!-- Daftar Modul -->
        <div>
          <div class="glass-panel" style="padding: 24px;">
            <h3 style="margin-bottom: 20px;">Urutan Modul</h3>
            <div id="moduleListContainer" style="display:flex; flex-direction:column; gap:12px;">
              ${(course.modules || []).sort((a, b) => a.order - b.order).map((m, i) => `
                <div style="background: white; border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px; display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:15px;">
                    <div style="width:32px; height:32px; background:var(--accent-blue); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.9rem;">${i+1}</div>
                    <div>
                      <h4 style="margin:0; font-size:1rem; color:var(--text-main);">${m.title}</h4>
                      <small style="color:var(--text-muted); text-transform:uppercase; font-size:0.7rem; font-weight:700;">${m.type}</small>
                    </div>
                  </div>
                  <div style="display:flex; gap:8px;">
                    <button class="btn btn-sm btn-outline" style="color:#e74c3c; border-color:#e74c3c; padding:4px 8px;" onclick="Admin.deleteModule('${course.id}', '${m.id}')">Hapus</button>
                  </div>
                </div>
              `).join('')}
              ${(!course.modules || course.modules.length === 0) ? '<p style="text-align:center; padding:30px; color:var(--text-muted);">Belum ada modul di kursus ini.</p>' : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    App.setContent(html);

    document.getElementById('addModuleForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveModule(courseId);
    });
  },

  toggleModInputs() {
    const type = document.getElementById('modType').value;
    document.querySelectorAll('.mod-input-group').forEach(el => el.style.display = 'none');
    if (type === 'slide') document.getElementById('modInputSlide').style.display = 'block';
    if (type === 'video') document.getElementById('modInputVideo').style.display = 'block';
    if (type === 'iframe') document.getElementById('modInputIframe').style.display = 'block';
  },

  saveModule(courseId) {
    const title = document.getElementById('modTitle').value;
    const type = document.getElementById('modType').value;
    const course = DB.find(DB.KEYS.COURSES, courseId);
    if (!course) return;

    let content = {};
    if (type === 'slide') {
      content = { slides: [{ title: title, body: document.getElementById('modSlideContent').value }] };
    } else if (type === 'video') {
      let url = document.getElementById('modVideoUrl').value;
      if (url.includes('watch?v=')) url = url.replace('watch?v=', 'embed/');
      content = { videoUrl: url, videoTitle: title };
    } else if (type === 'iframe') {
      content = { url: document.getElementById('modIframeUrl').value };
    }

    const newModule = {
      id: DB.genId(),
      title,
      type,
      content,
      order: (course.modules ? course.modules.length : 0) + 1
    };

    if (!course.modules) course.modules = [];
    course.modules.push(newModule);
    
    DB.update(DB.KEYS.COURSES, courseId, { 
      modules: course.modules,
      totalModules: course.modules.length 
    });

    alert('Modul berhasil ditambahkan!');
    this.renderCourseModules(courseId);
  },

  deleteModule(courseId, moduleId) {
    if (!confirm('Hapus modul ini?')) return;
    const course = DB.find(DB.KEYS.COURSES, courseId);
    if (!course) return;

    const updatedModules = course.modules.filter(m => m.id !== moduleId)
      .map((m, idx) => ({ ...m, order: idx + 1 }));

    DB.update(DB.KEYS.COURSES, courseId, { 
      modules: updatedModules,
      totalModules: updatedModules.length
    });

    this.renderCourseModules(courseId);
  },

  renderSettings() {
    const template = Certificate.getTemplate() || {};
    let html = `
      <div class="header-section">
        <h2>Pengaturan Sertifikat</h2>
        <p>Unggah desain template sertifikat untuk otomatis diterbitkan ke kader yang lulus</p>
      </div>
      
      <div class="settings-card glass-panel" style="padding: 30px;">
        <h3 style="margin-bottom: 12px;">Template Sertifikat</h3>
        <p style="color:var(--text-muted); margin-bottom: 24px;">Unggah file gambar (JPG/PNG) landscape ukuran A4. Nama kader akan otomatis dioverlay di tengah template.</p>
        
        <div class="form-group">
          <label>Unggah Background Template</label>
          <input type="file" id="certUpload" accept="image/png, image/jpeg" class="form-control">
        </div>
        
        <div class="preview-area" id="certPreviewArea" style="margin-top: 24px; text-align: center; border: 2px dashed var(--glass-border); border-radius: 16px; padding: 30px; background: rgba(0,0,0,0.02);">
          ${template.imageData ? `<img src="${template.imageData}" style="max-width: 100%; max-height: 400px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">` : `<p style="color:var(--text-muted)">Belum ada template khusus diunggah. Menggunakan template default.</p>`}
        </div>

        <div style="margin-top: 24px; display:flex; gap: 12px;">
          <button class="btn btn-primary" id="saveCertBtn">Simpan Template</button>
          ${template.imageData ? `<button class="btn btn-warning" id="removeCertBtn">Hapus Template Khusus</button>` : ''}
        </div>
      </div>
    `;
    App.setContent(html);

    let newImgData = null;
    document.getElementById('certUpload').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          newImgData = ev.target.result;
          document.getElementById('certPreviewArea').innerHTML = `<img src="${newImgData}" style="max-width: 100%; max-height: 400px; border: 1px solid #ddd;">`;
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById('saveCertBtn').addEventListener('click', () => {
      if (newImgData) {
        Certificate.saveTemplate({ imageData: newImgData });
        alert('Template sertifikat berhasil disimpan!');
        this.renderSettings();
      } else {
        alert('Pilih gambar terlebih dahulu!');
      }
    });

    const removeBtn = document.getElementById('removeCertBtn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if(confirm('Hapus template khusus dan kembali ke template default?')) {
          localStorage.removeItem(DB.KEYS.CERT_TEMPLATE);
          alert('Template dihapus.');
          this.renderSettings();
        }
      });
    }
  }
};
