function getApiBase() {
  if (typeof window !== 'undefined' && window.API_BASE) {
    return window.API_BASE;
  }
  if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
    return 'http://localhost:3000/api';
  }
  return '/api';
}

const API_BASE = getApiBase();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem('fallbackUsers') || '[]');
  } catch (error) {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem('fallbackUsers', JSON.stringify(users));
}

function createFallbackUser({ full_name, phone, email, password }) {
  const users = getStoredUsers();
  if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('A user with this email already exists.');
  }

  const user = {
    id: Date.now(),
    full_name,
    name: full_name,
    email,
    phone,
    password,
    role: 'customer'
  };

  users.push(user);
  saveStoredUsers(users);
  return user;
}

function loginFallbackUser(email, password) {
  const users = getStoredUsers();
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  return user;
}

async function registerUser(form) {
  const data = {
    full_name: form.full_name.value.trim(),
    phone: form.phone?.value.trim() || '',
    email: form.email.value.trim(),
    password: form.password.value,
    confirm_password: form.confirm_password?.value || '',
  };

  const msg = document.getElementById('registerMessage');
  if (!data.full_name || !isValidEmail(data.email)) {
    msg.textContent = 'Please provide a valid full name and email.';
    msg.style.color = '#c0392b';
    return;
  }
  if (data.password !== data.confirm_password) {
    msg.textContent = 'Passwords do not match.';
    msg.style.color = '#c0392b';
    return;
  }
  if (!isStrongPassword(data.password)) {
    msg.textContent = 'Password must be at least 8 characters and include a number and uppercase letter.';
    msg.style.color = '#c0392b';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: data.full_name, phone: data.phone, email: data.email, password: data.password })
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Registration failed');
    msg.textContent = 'Registration successful. Redirecting to site...';
    msg.style.color = '#2d8a2d';
    setTimeout(()=> location.href = 'index.html', 1200);
  } catch (err) {
    try {
      const fallbackUser = createFallbackUser({ full_name: data.full_name, phone: data.phone, email: data.email, password: data.password });
      localStorage.setItem('token', 'local-token');
      localStorage.setItem('user', JSON.stringify({
        id: fallbackUser.id,
        full_name: fallbackUser.full_name,
        name: fallbackUser.name,
        email: fallbackUser.email,
        phone: fallbackUser.phone,
        role: fallbackUser.role
      }));
      msg.textContent = 'Registration successful. Redirecting to site...';
      msg.style.color = '#2d8a2d';
      setTimeout(()=> location.href = 'index.html', 1200);
    } catch (fallbackError) {
      msg.textContent = fallbackError.message || 'Registration error';
      msg.style.color = '#c0392b';
    }
  }
}

async function loginUser(form) {
  const data = {
    email: form.email.value.trim(),
    password: form.password.value,
  };
  const msg = document.getElementById('loginMessage');
  const rememberMe = form.remember?.checked || false;
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Login failed');
    if (rememberMe) {
      localStorage.setItem('token', body.token);
    } else {
      sessionStorage.setItem('token', body.token);
    }
    localStorage.setItem('user', JSON.stringify(body.user));
    msg.textContent = 'Login successful. Redirecting...';
    msg.style.color = '#2d8a2d';
    const targetPage = body.user.role === 'admin' ? 'admin.html' : 'index.html';
    setTimeout(()=> location.href = targetPage, 800);
  } catch (err) {
    try {
      const fallbackUser = loginFallbackUser(data.email, data.password);
      if (rememberMe) {
        localStorage.setItem('token', 'local-token');
      } else {
        sessionStorage.setItem('token', 'local-token');
      }
      localStorage.setItem('user', JSON.stringify({
        id: fallbackUser.id,
        full_name: fallbackUser.full_name,
        name: fallbackUser.name,
        email: fallbackUser.email,
        phone: fallbackUser.phone,
        role: fallbackUser.role
      }));
      msg.textContent = 'Login successful. Redirecting...';
      msg.style.color = '#2d8a2d';
      const targetPage = fallbackUser.role === 'admin' ? 'admin.html' : 'index.html';
      setTimeout(()=> location.href = targetPage, 800);
    } catch (fallbackError) {
      msg.textContent = fallbackError.message || 'Login error';
      msg.style.color = '#c0392b';
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => { e.preventDefault(); registerUser(e.target); });
  }
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => { e.preventDefault(); loginUser(e.target); });
  }

  const showLoginPassword = document.getElementById('showLoginPassword');
  const loginPassword = document.getElementById('loginPassword');
  if (showLoginPassword && loginPassword) {
    showLoginPassword.addEventListener('change', () => {
      loginPassword.type = showLoginPassword.checked ? 'text' : 'password';
    });
  }

  const showRegisterPassword = document.getElementById('showRegisterPassword');
  const registerPassword = document.getElementById('registerPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  if (showRegisterPassword && registerPassword && confirmPassword) {
    showRegisterPassword.addEventListener('change', () => {
      const nextType = showRegisterPassword.checked ? 'text' : 'password';
      registerPassword.type = nextType;
      confirmPassword.type = nextType;
    });
  }
});
