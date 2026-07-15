const API_BASE = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function ensureAdmin() {
  const accessMessage = document.getElementById('adminAccessMessage');
  const dashboard = document.getElementById('adminDashboard');
  const token = getToken();
  if (!token) {
    accessMessage.innerHTML = '<div class="error-message">Please log in as an admin to access this dashboard.</div>';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok || data.user.role !== 'admin') {
      throw new Error('Forbidden');
    }
    accessMessage.style.display = 'none';
    dashboard.style.display = 'block';
    loadDashboard();
  } catch (error) {
    accessMessage.innerHTML = '<div class="error-message">Admin access denied. Please sign in with an administrator account.</div>';
  }
}

async function loadDashboard() {
  await Promise.all([loadStats(), loadProducts(), loadOrders(), loadDistributors()]);
}

async function loadStats() {
  try {
    const [productsRes, ordersRes, usersRes] = await Promise.all([
      fetch(`${API_BASE}/products`),
      fetch(`${API_BASE}/orders`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${API_BASE}/auth/users`, { headers: { Authorization: `Bearer ${getToken()}` } })
    ]);

    const products = await productsRes.json();
    const orders = await ordersRes.json();
    const users = await usersRes.json();

    const distributors = Array.isArray(users) ? users.filter((user) => user.role === 'distributor').length : 0;
    const revenue = orders.reduce((sum, order) => sum + Number(order.total_price || order.total_amount || 0), 0);

    const stats = [
      { label: 'Total Products', value: products.length },
      { label: 'Total Orders', value: orders.length },
      { label: 'Total Users', value: users.length },
      { label: 'Total Distributors', value: distributors },
      { label: 'Revenue', value: `${revenue.toLocaleString()} RWF` }
    ];

    document.getElementById('dashboardStats').innerHTML = stats.map((stat) => `
      <article class="card stat-card">
        <p class="eyebrow">${stat.label}</p>
        <h2>${stat.value}</h2>
      </article>
    `).join('');
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
  }
}

async function loadProducts() {
  const list = document.getElementById('productList');
  try {
    const response = await fetch(`${API_BASE}/products`);
    const products = await response.json();
    list.innerHTML = products.map((product) => `
      <div class="admin-item">
        <div>
          <strong>${product.name}</strong>
          <p>${product.category || 'Uncategorized'} · Stock ${product.stock_quantity || 0}</p>
        </div>
        <div class="hero-actions">
          <button class="btn btn-secondary" onclick="editProduct(${JSON.stringify(product)})">Edit</button>
          <button class="btn btn-primary" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    list.innerHTML = '<div class="error-message">Unable to load products.</div>';
  }
}

async function loadOrders() {
  const list = document.getElementById('ordersList');
  try {
    const response = await fetch(`${API_BASE}/orders`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const orders = await response.json();
    list.innerHTML = orders.map((order) => `
      <div class="admin-item">
        <div>
          <strong>Order #${order.id}</strong>
          <p>${order.customer_name || 'Customer'} · ${order.customer_email || ''}</p>
          <p>Status: ${order.order_status || 'pending'} · Payment: ${order.payment_status || 'pending'}</p>
        </div>
        <div class="hero-actions">
          <select onchange="updateOrderStatus(${order.id}, this.value)">
            <option value="pending" ${order.order_status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="processing" ${order.order_status === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="delivered" ${order.order_status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${order.order_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
      </div>
    `).join('');
  } catch (error) {
    list.innerHTML = '<div class="error-message">Unable to load orders.</div>';
  }
}

async function loadDistributors() {
  const list = document.getElementById('distributorsList');
  try {
    const response = await fetch(`${API_BASE}/distributors`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const distributors = await response.json();
    list.innerHTML = distributors.map((entry) => `
      <div class="admin-item">
        <div>
          <strong>Application #${entry.id}</strong>
          <p>${entry.full_name || entry.email || 'Applicant'} · ${entry.district || 'Unknown district'}</p>
          <p>Status: ${entry.application_status || entry.status || 'pending'}</p>
        </div>
        <div class="hero-actions">
          <button class="btn btn-secondary" onclick="updateDistributorStatus(${entry.id}, 'approved')">Approve</button>
          <button class="btn btn-primary" onclick="updateDistributorStatus(${entry.id}, 'rejected')">Reject</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    list.innerHTML = '<div class="error-message">Unable to load distributor applications.</div>';
  }
}

function editProduct(product) {
  document.getElementById('productId').value = product.id || '';
  document.getElementById('productName').value = product.name || '';
  document.getElementById('productCategory').value = product.category || '';
  document.getElementById('productPrice').value = product.price || '';
  document.getElementById('productStock').value = product.stock_quantity || 0;
  document.getElementById('productImage').value = product.image_url || '';
  document.getElementById('productDescription').value = product.description || '';
  document.getElementById('productStatus').value = product.status || 'active';
  document.getElementById('productFeatured').checked = Boolean(product.featured);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function saveProduct(event) {
  event.preventDefault();
  const id = document.getElementById('productId').value;
  const payload = {
    name: document.getElementById('productName').value.trim(),
    category: document.getElementById('productCategory').value.trim(),
    price: Number(document.getElementById('productPrice').value),
    stock_quantity: Number(document.getElementById('productStock').value),
    image_url: document.getElementById('productImage').value.trim(),
    description: document.getElementById('productDescription').value.trim(),
    status: document.getElementById('productStatus').value,
    featured: document.getElementById('productFeatured').checked
  };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Save failed');
    document.getElementById('productForm').reset();
    loadDashboard();
  } catch (error) {
    alert(error.message || 'Unable to save product');
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  try {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Delete failed');
    loadDashboard();
  } catch (error) {
    alert(error.message || 'Unable to delete product');
  }
}

async function updateOrderStatus(id, orderStatus) {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ order_status: orderStatus })
    });
    if (!response.ok) throw new Error('Status update failed');
    loadOrders();
  } catch (error) {
    alert(error.message || 'Unable to update order status');
  }
}

async function updateDistributorStatus(id, status) {
  try {
    const response = await fetch(`${API_BASE}/distributors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ application_status: status })
    });
    if (!response.ok) throw new Error('Update failed');
    loadDistributors();
  } catch (error) {
    alert(error.message || 'Unable to update distributor application');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('productForm').addEventListener('submit', saveProduct);
  document.getElementById('cancelProductEdit').addEventListener('click', () => document.getElementById('productForm').reset());
  ensureAdmin();
});
