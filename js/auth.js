// ============================================
// AUTH.JS - Authentication & Session Management
// ============================================

const Auth = {
  login(username, password) {
    const users = DB.getAll(DB.KEYS.USERS);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const session = { userId: user.id, role: user.role, name: user.name, loginAt: new Date().toISOString() };
      DB.set(DB.KEYS.SESSION, session);
      return { success: true, user, session };
    }
    return { success: false, message: 'Username atau password salah!' };
  },

  logout() {
    localStorage.removeItem(DB.KEYS.SESSION);
    window.location.hash = '';
    window.location.reload();
  },

  getSession() { return DB.get(DB.KEYS.SESSION); },

  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    return DB.find(DB.KEYS.USERS, session.userId);
  },

  isLoggedIn() { return !!this.getSession(); },
  isAdmin() { const s = this.getSession(); return s && s.role === 'admin'; },
  isKader() { const s = this.getSession(); return s && s.role === 'kader'; },

  register(data) {
    const users = DB.getAll(DB.KEYS.USERS);
    
    // Validasi NIK: Tepat 16 digit angka
    if (!/^\d{16}$/.test(data.nik)) {
      return { success: false, message: 'NIK harus tepat 16 digit angka!' };
    }
    
    // Validasi No. HP: Berawalan 08/+62/62 dengan total 10-14 digit
    if (!/^(\+62|62|08)\d{8,12}$/.test(data.noHp)) {
      return { success: false, message: 'Nomor HP tidak valid! Gunakan format berawalan 08, 62, atau +62 dengan total 10-14 digit.' };
    }

    // Validasi Username: Karakter alfanumerik & underscore saja, panjang 4–20 karakter
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(data.username)) {
      return { success: false, message: 'Username harus terdiri dari 4-20 karakter alfanumerik (tanpa spasi/simbol selain underscore)!' };
    }

    // Validasi Password: Minimal 6 karakter
    if (!data.password || data.password.length < 6) {
      return { success: false, message: 'Password minimal terdiri dari 6 karakter!' };
    }

    if (users.find(u => u.username === data.username)) {
      return { success: false, message: 'Username sudah digunakan!' };
    }
    if (users.find(u => u.nik === data.nik)) {
      return { success: false, message: 'NIK sudah terdaftar!' };
    }
    const newUser = {
      id: DB.genId(),
      username: data.username,
      password: data.password,
      role: 'kader',
      name: data.name,
      nik: data.nik,
      desa: data.desa,
      kecamatan: data.kecamatan,
      kabupaten: data.kabupaten,
      noHp: data.noHp,
      avatar: '',
      createdAt: new Date().toISOString()
    };
    DB.add(DB.KEYS.USERS, newUser);
    
    // Sync to Google Sheets / MySQL
    Backend.syncUser(newUser);

    return { success: true, user: newUser };
  }
};
