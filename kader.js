// ============================================
// KADER.JS - Kader Learning Experience
// ============================================

const Kader = {
  state: {
    currentCourse: null,
    currentModuleIndex: 0,
    answers: {}
  },

  init() {
    this.renderDashboard();
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('nav-kader-dashboard')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderDashboard();
      App.setActiveNav('nav-kader-dashboard');
    });

    document.getElementById('nav-kader-courses')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderCourseList();
      App.setActiveNav('nav-kader-courses');
    });

    document.getElementById('nav-kader-certs')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderCertificates();
      App.setActiveNav('nav-kader-certs');
    });
  },

  renderDashboard() {
    const user = Auth.getCurrentUser();
    const enrollments = DB.getAll(DB.KEYS.ENROLLMENTS).filter(e => e.userId === user.id);
    
    let html = `
      <div class="header-section">
        <h2>Selamat Datang, ${user.name}!</h2>
        <p>Lanjutkan pembelajaran Anda untuk menjadi Kader Rumah DataKU yang handal.</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(41, 128, 185, 0.1); color: var(--primary);">📖</div>
          <div class="stat-info">
            <h3>Kursus Aktif</h3>
            <p>${enrollments.filter(e => e.status === 'active').length}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(46, 204, 113, 0.1); color: #2ecc71;">🏆</div>
          <div class="stat-info">
            <h3>Diselesaikan</h3>
            <p>${enrollments.filter(e => e.status === 'completed').length}</p>
          </div>
        </div>
      </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-top: 30px;">
        <!-- Announcements -->
        <div style="background: rgba(255,255,255,0.6); backdrop-filter: blur(16px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.8); padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #3B82F6, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: white;">📢</div>
            <div>
              <h3 style="font-size: 1.2rem; color: var(--text-main); margin: 0;">Pengumuman Terbaru</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Informasi penting untuk Anda</p>
            </div>
          </div>
          <div class="announcement-list" style="display: flex; flex-direction: column; gap: 16px;">
            ${DB.getAll(DB.KEYS.ANNOUNCEMENTS).length > 0 ? DB.getAll(DB.KEYS.ANNOUNCEMENTS).map((a, i) => `
              <div style="padding: 20px; background: ${i === 0 ? 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))' : 'rgba(0,0,0,0.02)'}; border-radius: 16px; border-left: 4px solid ${i === 0 ? 'var(--accent-blue)' : 'var(--accent-teal)'}; transition: all 0.3s ease;">
                <h4 style="font-size: 1rem; color: var(--text-main); margin-bottom: 8px; font-weight: 700;">${a.title}</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 10px;">${a.content}</p>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="width: 24px; height: 24px; border-radius: 8px; background: linear-gradient(135deg, var(--accent-blue), #8b5cf6); display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; color: white;">👤</span>
                  <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">${a.author || 'Admin'}</span>
                  <span style="color: #cbd5e1;">•</span>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">${a.date}</span>
                </div>
              </div>
            `).join('') : '<p style="text-align:center; padding:20px; color:var(--text-muted);">Belum ada pengumuman.</p>'}
          </div>
        </div>

        <!-- Sidebar / Shortcuts -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div style="background: white; border-radius: 20px; padding: 24px; border: 1px solid var(--glass-border);">
            <h4 style="margin-bottom: 16px;">Akses Cepat</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <button class="btn btn-primary btn-full" onclick="Kader.renderCourseList()">📚 Mulai Belajar</button>
              <button class="btn btn-outline btn-full" onclick="Kader.renderCertificates()">🎓 Sertifikat Saya</button>
            </div>
          </div>
        </div>
      </div>
    `;
    App.setContent(html);
  },

  renderCourseList() {
    const courses = DB.getAll(DB.KEYS.COURSES);
    const user = Auth.getCurrentUser();
    const enrollments = DB.getAll(DB.KEYS.ENROLLMENTS).filter(e => e.userId === user.id);

    let html = `
      <div class="header-section">
        <h2>Daftar Kursus</h2>
        <p>Pilih dan ikuti materi pelatihan yang tersedia</p>
      </div>
      <div class="course-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
        ${courses.map(course => {
          const enrollment = enrollments.find(e => e.courseId === course.id);
          let btnHtml = `<button class="btn btn-primary" onclick="Kader.startCourse('${course.id}')">Mulai Belajar</button>`;
          let statusBadge = '';
          
          if (enrollment) {
            if (enrollment.status === 'completed') {
              btnHtml = `<button class="btn btn-success" onclick="Kader.renderCertificates()">Lihat Sertifikat</button>`;
              statusBadge = `<span class="badge badge-success" style="position:absolute; top:10px; right:10px;">Lulus</span>`;
            } else {
              btnHtml = `<button class="btn btn-warning" onclick="Kader.continueCourse('${course.id}')">Lanjutkan</button>`;
              statusBadge = `<span class="badge badge-warning" style="position:absolute; top:10px; right:10px;">Berjalan</span>`;
            }
          }

          return `
            <div class="course-card" style="position:relative;">
              ${statusBadge}
              <div style="height: 160px; background: linear-gradient(135deg, var(--accent-blue), var(--accent-teal)); display:flex; align-items:center; justify-content:center; color:white; font-size:3.5rem;">
                📚
              </div>
              <div style="padding: 24px;">
                <span class="badge" style="background: rgba(0,0,0,0.05); color:var(--text-muted); margin-bottom:12px; display:inline-block;">${course.category}</span>
                <h3 style="margin-bottom: 12px; font-size: 1.3rem; color: var(--text-main);">${course.title}</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px; height: 65px; overflow:hidden;">${course.description}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; font-size:0.85rem; color:var(--text-muted); font-weight: 600;">
                  <span>⏱ ${course.duration}</span>
                  <span>📄 ${course.totalModules} Modul</span>
                </div>
                ${btnHtml}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    App.setContent(html);
  },

  startCourse(courseId) {
    const course = DB.find(DB.KEYS.COURSES, courseId);
    const user = Auth.getCurrentUser();
    
    // Create enrollment
    const newEnrollment = {
      id: DB.genId(),
      userId: user.id,
      courseId: course.id,
      status: 'active',
      progress: 0,
      preTestScore: null,
      postTestScore: null,
      startedAt: new Date().toISOString()
    };
    DB.add(DB.KEYS.ENROLLMENTS, newEnrollment);
    
    this.renderPreTest(course, newEnrollment);
  },

  continueCourse(courseId) {
    const course = DB.find(DB.KEYS.COURSES, courseId);
    const user = Auth.getCurrentUser();
    const enrollment = DB.getAll(DB.KEYS.ENROLLMENTS).find(e => e.courseId === courseId && e.userId === user.id);
    
    if (enrollment.preTestScore === null) {
      this.renderPreTest(course, enrollment);
    } else if (enrollment.progress < course.totalModules) {
      this.state.currentCourse = course;
      this.state.currentModuleIndex = enrollment.progress;
      this.renderModule();
    } else {
      this.renderPostTest(course, enrollment);
    }
  },

  // Helper for shuffling array (Fisher-Yates)
  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  // Helper to shuffle options but keep track of the correct answer
  shuffleQuestionOptions(question) {
    const optionsWithIndex = question.options.map((opt, idx) => ({ text: opt, isCorrect: idx === question.answer }));
    const shuffledOptions = this.shuffleArray(optionsWithIndex);
    
    return {
      ...question,
      options: shuffledOptions.map(o => o.text),
      answer: shuffledOptions.findIndex(o => o.isCorrect)
    };
  },

  getQuestionsForTest(course, type) {
    if (!course.useQuestionBank) {
      // Return static course questions if bank is disabled
      return type === 'pre' ? course.preTest : course.postTest;
    }

    const banks = DB.getAll(DB.KEYS.QUESTION_BANK);
    const bankData = banks.find(b => b.courseId === course.id);
    
    if (!bankData) {
      // Fallback
      return type === 'pre' ? course.preTest : course.postTest;
    }

    const sourceQuestions = type === 'pre' ? bankData.preTest : bankData.postTest;
    const displayCount = type === 'pre' ? course.preTestCount : course.postTestCount;

    // Shuffle and pick N questions
    const selectedQuestions = this.shuffleArray(sourceQuestions).slice(0, displayCount || 5);
    
    // Shuffle options for each selected question
    return selectedQuestions.map(q => this.shuffleQuestionOptions(q));
  },

  renderPreTest(course, enrollment) {
    this.state.answers = {};
    
    // Check if we already generated randomized questions for this attempt
    let questionsToAsk = this.state.currentTestQuestions;
    if (!questionsToAsk) {
      questionsToAsk = this.getQuestionsForTest(course, 'pre');
      this.state.currentTestQuestions = questionsToAsk; // Cache so it doesn't reshuffle on re-render
    }

    let html = `
      <div class="learning-container">
        <div class="header-section text-center">
          <h2>Pre-Test: ${course.title}</h2>
          <p>Ujian awal untuk mengukur pengetahuan dasar Anda sebelum memulai materi.</p>
        </div>
        <div class="quiz-container">
          <form id="quizForm">
            ${questionsToAsk.map((q, index) => `
              <div class="question-block" style="margin-bottom: 25px;">
                <p><strong>${index + 1}. ${q.question}</strong></p>
                ${q.options.map((opt, oIndex) => `
                  <label style="display:block; margin: 10px 0; cursor:pointer;">
                    <input type="radio" name="q_${q.id}" value="${oIndex}" required>
                    ${opt}
                  </label>
                `).join('')}
              </div>
            `).join('')}
            <div style="text-align:center; margin-top:30px;">
              <button type="submit" class="btn btn-primary btn-large">Kumpulkan Pre-Test & Mulai Belajar</button>
            </div>
          </form>
        </div>
      </div>
    `;
    App.setContent(html);

    document.getElementById('quizForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      let correct = 0;
      questionsToAsk.forEach(q => {
        if (parseInt(formData.get(`q_${q.id}`)) === q.answer) correct++;
      });
      const score = Math.round((correct / questionsToAsk.length) * 100);
      
      DB.update(DB.KEYS.ENROLLMENTS, enrollment.id, { preTestScore: score });
      alert(`Pre-Test selesai! Nilai Anda: ${score}`);
      
      // Sync to Google Sheets
      Backend.syncResult(Auth.getCurrentUser(), course, { ...enrollment, preTestScore: score, status: 'active' });

      this.state.currentTestQuestions = null; // Clear cache
      this.state.currentCourse = course;
      this.state.currentModuleIndex = 0;
      this.renderModule();
    });
  },

  renderModule() {
    const course = this.state.currentCourse;
    const module = course.modules[this.state.currentModuleIndex];
    
    let contentHtml = '';
    if (module.type === 'slide') {
      contentHtml = `
        <div class="slides-container" style="min-height: 300px;">
          ${module.content.slides.map((s, i) => `
            <div class="slide" id="slide_${i}" style="display: ${i === 0 ? 'block' : 'none'};">
              <h3 style="color:var(--accent-blue); margin-bottom:20px; font-size:1.6rem;">${s.title}</h3>
              <p style="white-space: pre-line; line-height: 1.8; font-size:1.1rem;">${s.body}</p>
            </div>
          `).join('')}
          <div class="slide-controls" style="margin-top:40px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--glass-border); padding-top:24px;">
            <button class="btn btn-outline" id="prevSlide" disabled>Sebelumnya</button>
            <span id="slideCounter" style="font-weight:600;">1 / ${module.content.slides.length}</span>
            <button class="btn btn-primary" id="nextSlide">Selanjutnya</button>
          </div>
        </div>
      `;
    } else if (module.type === 'video') {
      contentHtml = `
        <div class="video-container" style="text-align:center;">
          <h3 style="margin-bottom:15px; color:var(--text-main);">${module.content.videoTitle}</h3>
          <iframe width="100%" height="450" src="${module.content.videoUrl}" frameborder="0" allowfullscreen style="border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1);"></iframe>
          <p style="margin-top:15px; color:var(--text-muted);">${module.content.description}</p>
        </div>
      `;
    } else if (module.type === 'file') {
      contentHtml = `
        <div class="slides-container" style="text-align:center; padding: 20px;">
          <h3 style="margin-bottom:15px; color:var(--text-main);">Materi File (${module.content.fileName})</h3>
          <p style="margin-bottom: 15px; color:var(--text-muted);">${module.content.description}</p>
          <embed src="${module.content.fileData}" width="100%" height="600px" style="border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1); margin-bottom: 20px; border: 1px solid var(--glass-border);">
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:15px;">*Jika file tidak tampil (khususnya file PPT), gunakan tombol unduh di bawah ini.</p>
          <a href="${module.content.fileData}" download="${module.content.fileName}" class="btn btn-outline">
            ⬇️ Unduh File
          </a>
        </div>
      `;
    } else if (module.type === 'iframe') {
      contentHtml = `
        <div class="video-container" style="text-align:center;">
          <h3 style="margin-bottom:15px; color:var(--text-main);">Presentasi / Dokumen Embed</h3>
          <iframe width="100%" height="500" src="${module.content.url}" frameborder="0" allowfullscreen style="border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1);"></iframe>
          <p style="margin-top:15px; color:var(--text-muted);">${module.content.description}</p>
        </div>
      `;
    }

    let html = `
      <div class="learning-container">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h2>Modul ${this.state.currentModuleIndex + 1}: ${module.title}</h2>
          <span class="badge badge-primary">Progress: ${this.state.currentModuleIndex + 1} / ${course.totalModules}</span>
        </div>
        
        ${contentHtml}

        <div style="text-align:right; margin-top:30px; display:flex; justify-content:space-between; align-items:center;">
          <button class="btn btn-outline" onclick="Kader.renderCourseList()">Kembali ke Daftar Kursus</button>
          <button class="btn btn-success btn-large" id="finishModuleBtn" disabled>
            Selesaikan Modul Ini & Lanjut
          </button>
        </div>
      </div>
    `;
    App.setContent(html);

    // Timer Logic: Hidden timer controlled by admin setting
    let timeLeft = course.readTimer !== undefined ? course.readTimer : 15;
    
    // If timer is 0, enable immediately
    if (timeLeft <= 0) {
      document.getElementById('finishModuleBtn').disabled = false;
    } else {
      window.kaderModuleTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(window.kaderModuleTimer);
          const finishBtn = document.getElementById('finishModuleBtn');
          if (finishBtn) finishBtn.disabled = false;
        }
      }, 1000);
    }

    // Stop timer if user navigates away
    const origSetContent = App.setContent;
    App.setContent = function(h) {
      if(window.kaderModuleTimer) clearInterval(window.kaderModuleTimer);
      origSetContent.call(App, h);
    };

    // Slide logic
    if (module.type === 'slide') {
      let currentSlide = 0;
      const totalSlides = module.content.slides.length;
      
      document.getElementById('nextSlide')?.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
          document.getElementById(`slide_${currentSlide}`).style.display = 'none';
          currentSlide++;
          document.getElementById(`slide_${currentSlide}`).style.display = 'block';
          document.getElementById('slideCounter').innerText = `${currentSlide + 1} / ${totalSlides}`;
          document.getElementById('prevSlide').disabled = false;
          if (currentSlide === totalSlides - 1) document.getElementById('nextSlide').disabled = true;
        }
      });
      
      document.getElementById('prevSlide')?.addEventListener('click', () => {
        if (currentSlide > 0) {
          document.getElementById(`slide_${currentSlide}`).style.display = 'none';
          currentSlide--;
          document.getElementById(`slide_${currentSlide}`).style.display = 'block';
          document.getElementById('slideCounter').innerText = `${currentSlide + 1} / ${totalSlides}`;
          document.getElementById('nextSlide').disabled = false;
          if (currentSlide === 0) document.getElementById('prevSlide').disabled = true;
        }
      });
    }

    document.getElementById('finishModuleBtn').addEventListener('click', () => {
      this.state.currentModuleIndex++;
      const user = Auth.getCurrentUser();
      const enrollment = DB.getAll(DB.KEYS.ENROLLMENTS).find(e => e.courseId === course.id && e.userId === user.id);
      
      DB.update(DB.KEYS.ENROLLMENTS, enrollment.id, { progress: this.state.currentModuleIndex });

      if (this.state.currentModuleIndex >= course.totalModules) {
        this.renderPostTest(course, enrollment);
      } else {
        this.renderModule();
      }
    });
  },

  renderPostTest(course, enrollment) {
    // Check if we already generated randomized questions for this attempt
    let questionsToAsk = this.state.currentTestQuestions;
    if (!questionsToAsk) {
      questionsToAsk = this.getQuestionsForTest(course, 'post');
      this.state.currentTestQuestions = questionsToAsk; // Cache so it doesn't reshuffle on re-render
    }

    let html = `
      <div class="learning-container">
        <div class="header-section text-center">
          <h2>Post-Test: ${course.title}</h2>
          <p>Ujian akhir. Anda harus mendapat minimal ${course.passingGrade}% untuk lulus dan mendapat sertifikat.</p>
        </div>
        <div class="quiz-container">
          <form id="postQuizForm">
            ${questionsToAsk.map((q, index) => `
              <div class="question-block" style="margin-bottom: 25px;">
                <p><strong>${index + 1}. ${q.question}</strong></p>
                ${q.options.map((opt, oIndex) => `
                  <label style="display:block; margin: 10px 0; cursor:pointer;">
                    <input type="radio" name="pq_${q.id}" value="${oIndex}" required>
                    ${opt}
                  </label>
                `).join('')}
              </div>
            `).join('')}
            <div style="text-align:center; margin-top:30px;">
              <button type="submit" class="btn btn-primary btn-large">Selesai & Lihat Hasil</button>
            </div>
          </form>
        </div>
      </div>
    `;
    App.setContent(html);

    document.getElementById('postQuizForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      let correct = 0;
      questionsToAsk.forEach(q => {
        if (parseInt(formData.get(`pq_${q.id}`)) === q.answer) correct++;
      });
      const score = Math.round((correct / questionsToAsk.length) * 100);
      
      if (score >= course.passingGrade) {
        DB.update(DB.KEYS.ENROLLMENTS, enrollment.id, { 
          postTestScore: score, 
          status: 'completed',
          completedAt: new Date().toISOString(),
          certNumber: Certificate.generateCertNumber(course.id, enrollment.userId)
        });
        
        // Sync to Google Sheets
        Backend.syncResult(Auth.getCurrentUser(), course, enrollment);

        this.state.currentTestQuestions = null; // Clear cache
        
        let successHtml = `
          <div style="text-align:center; padding: 50px 20px;">
            <div style="font-size: 5rem; margin-bottom: 20px;">🎉</div>
            <h2 style="color: #2ecc71; margin-bottom: 15px;">Selamat! Anda Lulus!</h2>
            <p style="font-size: 1.2rem; margin-bottom: 20px;">Nilai Anda: <strong>${score}</strong></p>
            <p style="margin-bottom: 30px;">Anda telah berhasil menyelesaikan pelatihan "${course.title}".</p>
            <button class="btn btn-primary btn-large" onclick="Kader.renderCertificates()">Unduh Sertifikat</button>
          </div>
        `;
        App.setContent(successHtml);
      } else {
        alert(`Maaf, nilai Anda ${score}. Anda belum mencapai batas kelulusan (${course.passingGrade}). Silakan ulangi post-test.`);
        this.state.currentTestQuestions = null; // Clear cache so they get new random questions
        this.renderPostTest(course, enrollment);
      }
    });
  },

  renderCertificates() {
    const user = Auth.getCurrentUser();
    const enrollments = DB.getAll(DB.KEYS.ENROLLMENTS).filter(e => e.userId === user.id && e.status === 'completed');
    
    let html = `
      <div class="header-section">
        <h2>Sertifikat Saya</h2>
        <p>Unduh sertifikat pelatihan yang telah Anda selesaikan</p>
      </div>
    `;

    if (enrollments.length === 0) {
      html += `
        <div style="text-align:center; padding: 50px; background:white; border-radius:10px; border:1px dashed #ccc;">
          <p style="color:#888; font-size:1.1rem;">Belum ada sertifikat. Selesaikan kursus terlebih dahulu!</p>
          <button class="btn btn-primary" style="margin-top:15px;" onclick="Kader.renderCourseList()">Lihat Kursus</button>
        </div>
      `;
    } else {
      html += `
        <div class="cert-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
          ${enrollments.map(e => {
            const course = DB.find(DB.KEYS.COURSES, e.courseId);
            const dateStr = new Date(e.completedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            return `
              <div class="cert-card" style="padding: 30px; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🎓</div>
                <h3 style="margin-bottom: 12px; font-size: 1.2rem; color: var(--text-main);">${course.title}</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 8px;">Lulus pada: ${dateStr}</p>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px; font-weight:600;">Nilai: <span style="color:var(--accent-blue)">${e.postTestScore}</span></p>
                <button class="btn btn-primary btn-full" onclick="Certificate.generate('${user.name}', '${course.title}', ${e.postTestScore}, '${e.certNumber}', '${dateStr}')">
                  ⬇️ Download PDF
                </button>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
    
    App.setContent(html);
  }
};
