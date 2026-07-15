const baseUrl = 'http://localhost:3000/api';

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { response, body };
}

(async () => {
  const productsRes = await request('/products');
  if (!productsRes.response.ok || !Array.isArray(productsRes.body) || productsRes.body.length === 0) {
    throw new Error('Products endpoint failed');
  }

  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@edmarkrwanda.com', password: 'Admin@12345' }),
  });
  if (!loginRes.response.ok || !loginRes.body.token) {
    throw new Error('Admin login failed');
  }

  const token = loginRes.body.token;
  const createRes = await request('/distributors', {
    method: 'POST',
    body: JSON.stringify({
      full_name: 'Smoke Test User',
      phone: '250700000000',
      email: 'smoke@example.com',
      district: 'Kigali',
      message: 'Smoke test application',
    }),
  });
  if (!createRes.response.ok) {
    throw new Error('Distributor submission failed');
  }

  const applicationId = createRes.body.id;
  const updateRes = await request(`/distributors/${applicationId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ application_status: 'approved' }),
  });
  if (!updateRes.response.ok) {
    throw new Error('Distributor update failed');
  }
  const statusValue = updateRes.body.status || updateRes.body.application_status;
  if (statusValue !== 'approved') {
    throw new Error(`Distributor status was not updated: ${statusValue}`);
  }

  console.log('Smoke test passed');
})();
