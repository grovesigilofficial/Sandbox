import { CONFIG as DEFAULT_CONFIG } from './config.default.js';

let CONFIG = DEFAULT_CONFIG;

(async () => {
  try {
    const local = await import('./config.local.js');
    if (local && local.CONFIG) CONFIG = local.CONFIG;
  } catch(e){}

  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === CONFIG.adminUsername && password === CONFIG.adminPassword) {
      localStorage.setItem('grove_admin_logged_in', 'true');
      const mod = await import('./counter.js');
      await mod.incrementDay();
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid credentials');
    }
  });
})();
