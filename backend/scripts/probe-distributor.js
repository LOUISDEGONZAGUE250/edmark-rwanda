const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const body = options.body ? JSON.stringify(options.body) : undefined;
    const req = http.request({ hostname: 'localhost', port: 3000, path, method: options.method || 'GET', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        try { parsed = data ? JSON.parse(data) : null; } catch (err) { parsed = data; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  const login = await request('/api/auth/login', { method: 'POST', body: { email: 'admin@edmarkrwanda.com', password: 'Admin@12345' } });
  console.log('login', login.status, login.body);
  const token = login.body.token;
  const create = await request('/api/distributors', { method: 'POST', body: { full_name: 'Probe', phone: '250700000000', email: 'probe@example.com', district: 'Kigali', message: 'probe' } });
  console.log('create', create.status, create.body);
  const id = create.body.id;
  const update = await request(`/api/distributors/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: { application_status: 'approved' } });
  console.log('update', update.status, update.body);
})();
