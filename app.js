// ============================================
// APP.JS - Main Application Controller
// ============================================

const App = {
  init() {
    this.checkAuth();
    this.setupThemeToggle();
  },

  checkAuth() {
    if (Auth.isLoggedIn()) {
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('app-section').style.display = 'flex';
      
      const user = Auth.getCurrentUser();
      document.getElementById('user-name-display').innerText = user.name;
      document.getElementById('user-role-display').innerText = user.role === 'admin' ? 'Administrator' : 'Kader';

      if (Auth.isAdmin()) {
        document.getElementById('admin-nav').style.display = 'block';
        document.getElementById('kader-nav').style.display = 'none';
        Admin.init();
      } else {
        document.getElementById('admin-nav').style.display = 'none';
        document.getElementById('kader-nav').style.display = 'block';
        Kader.init();
      }
    } else {
      document.getElementById('auth-section').style.display = 'block';
      document.getElementById('app-section').style.display = 'none';
      this.setupAuthForms();
    }
  },

  setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');

    if (showRegisterBtn) {
      showRegisterBtn.onclick = (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        document.querySelector('.auth-form-container h2').innerText = 'Daftar Akun';
        document.querySelector('.auth-form-container p').innerText = 'Daftar sebagai Kader Rumah DataKU';
      };
    }

    if (showLoginBtn) {
      showLoginBtn.onclick = (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        document.querySelector('.auth-form-container h2').innerText = 'Login';
        document.querySelector('.auth-form-container p').innerText = 'Masuk ke akun Anda';
      };
    }

    if (loginForm) {
      loginForm.onsubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = Auth.login(fd.get('username'), fd.get('password'));
        if (res.success) {
          window.location.reload();
        } else {
          document.getElementById('loginError').innerText = res.message;
        }
      };
    }

    if (registerForm) {
      registerForm.onsubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        
        const res = Auth.register(data);
        if (res.success) {
          alert('Pendaftaran berhasil! Silakan login menggunakan username dan password yang baru dibuat.');
          showLoginBtn.click();
          loginForm.reset();
          registerForm.reset();
        } else {
          document.getElementById('registerError').innerText = res.message;
        }
      };
    }
  },

  logout() {
    Auth.logout();
  },

  setContent(html) {
    document.getElementById('main-content').innerHTML = html;
  },

  setActiveNav(navId) {
    document.querySelectorAll('.sidebar-menu a').forEach(el => el.classList.remove('active'));
    document.getElementById(navId)?.classList.add('active');
  },

  setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        btn.innerText = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
      });
    }
  }
};

window.onload = () => {
  App.init();
};
