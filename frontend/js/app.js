const fallbackProducts = [
  {
    id: 1,
    name: 'Splina Liquid Chlorophyll',
    description: 'Support your daily wellness routine with our premium chlorophyll supplement.',
    tagline: 'Purify Your Body. Support Your Daily Wellness.',
    benefits: ['Supports a healthy daily wellness routine.', 'Complements a balanced diet.', 'Helps maintain a feeling of freshness.', 'Easy to use every day.'],
    ingredients: ['Chlorophyll', 'Natural botanical extracts', 'Purified water'],
    size: '500 ml',
    price: 57000,
    image_url: 'images/splina.jpg',
    category: 'wellness',
    stock_quantity: 0,
    featured: true,
  },
  {
    id: 2,
    name: 'Shake Off',
    description: 'Suitable for a weight management program with great taste and easy preparation.',
    tagline: 'Your Weight Management Partner.',
    benefits: ['Suitable for a weight management program.', 'Easy to prepare.', 'Complements a balanced diet.', 'Great taste.'],
    ingredients: ['Natural protein blend', 'Fiber blend', 'Flavoring agents'],
    size: '12 sachets',
    price: 57000,
    image_url: 'images/shake-off.png',
    category: 'weight',
    stock_quantity: 0,
    featured: true,
  },
  {
    id: 3,
    name: 'MrD Nutrition Drink',
    description: 'Available in three delicious flavors for your active lifestyle.',
    tagline: 'Convenient Nutrition for Busy Days.',
    benefits: ['Easy to prepare.', 'Available in three delicious flavors.', 'Suitable for active lifestyles.', 'Fits into a balanced routine.'],
    ingredients: ['Vitamins', 'Minerals', 'Protein blend'],
    size: 'Chocolate / Vanilla / Strawberry',
    price: 123500,
    image_url: 'images/mrt-complex.png',
    category: 'nutrition',
    stock_quantity: 0,
    featured: true,
  },
  {
    id: 4,
    name: 'Red Coffee',
    description: 'Enjoy coffee with a wellness touch.',
    tagline: 'Enjoy Coffee with a Wellness Touch.',
    benefits: ['Rich coffee taste.', 'Easy to prepare.', 'Suitable for daily use.', 'Great way to start your day.'],
    ingredients: ['Premium coffee beans', 'Natural flavoring', 'Wellness blend'],
    size: 'Single serve sachet',
    price: 20200,
    image_url: 'images/red-coffee.png',
    category: 'nutrition',
    stock_quantity: 0,
    featured: false,
  },
  {
    id: 5,
    name: 'Ginseng Coffee',
    description: 'Coffee enhanced with ginseng for energy support.',
    tagline: 'Coffee Enhanced with Ginseng.',
    benefits: ['Smooth taste.', 'Convenient.', 'Suitable for active people.'],
    ingredients: ['Coffee beans', 'Ginseng extract', 'Natural flavor'],
    size: 'Single serve sachet',
    price: 20200,
    image_url: 'images/ginseng-coffee.jpg',
    category: 'nutrition',
    stock_quantity: 0,
    featured: false,
  },
  {
    id: 6,
    name: 'Bio-Elixir',
    description: 'Reveal your beauty from within.',
    tagline: 'Reveal Your Beauty from Within.',
    benefits: ['Supports your beauty routine.', 'Easy daily use.', 'Practical sachets.'],
    ingredients: ['Botanical extracts', 'Beauty support blend', 'Natural flavor'],
    size: 'Practical sachets',
    price: 121000,
    image_url: 'images/bio-elixir.png',
    category: 'beauty',
    stock_quantity: 0,
    featured: true,
  },
  {
    id: 7,
    name: 'Bubble C',
    description: 'A simple daily wellness habit in a great tasting formula.',
    tagline: 'A Simple Daily Wellness Habit.',
    benefits: ['Easy to consume.', 'Great taste.', 'Daily wellness support.'],
    ingredients: ['Vitamin C blend', 'Natural flavoring', 'Sweetener'],
    size: 'Daily wellness sachet',
    price: 23800,
    image_url: 'images/bubble-c.jpg',
    category: 'wellness',
    stock_quantity: 0,
    featured: false,
  },
  {
    id: 8,
    name: 'Cocollagen',
    description: 'Nourish your skin from within.',
    tagline: 'Nourish Your Skin from Within.',
    benefits: ['Supports skin care routine.', 'Easy to prepare.', 'Delicious drink.'],
    ingredients: ['Collagen support blend', 'Fruit flavor', 'Natural sweetness'],
    size: 'Easy to prepare drink',
    price: 35100,
    image_url: 'images/cocollagen.png',
    category: 'beauty',
    stock_quantity: 0,
    featured: false,
  },
  {
    id: 9,
    name: 'Beauty Package',
    description: 'The complete beauty program for wellness and skin support.',
    tagline: 'The Complete Beauty Program.',
    benefits: ['Complete beauty solution.', 'Excellent value.', 'Products designed to work together.'],
    ingredients: ['Beauty bundle', 'Wellness support', 'Beauty nutrition'],
    size: 'Complete beauty program',
    price: 300900,
    image_url: 'images/beauty-package.png',
    category: 'beauty',
    stock_quantity: 0,
    featured: true,
  }
];

function getApiBase() {
  if (typeof window !== 'undefined' && window.API_BASE) {
    return window.API_BASE;
  }
  if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
    return 'http://localhost:3000/api';
  }
  return '/api';
}

async function fetchJson(url, fallbackValue) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Falling back to local product data:', error.message);
    return fallbackValue;
  }
}

const API_BASE = getApiBase();
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 6;

async function loadProducts() {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;
  productsGrid.innerHTML = '<div class="loading-message">Loading products...</div>';

  try {
    const data = await fetchJson(`${API_BASE}/products`, fallbackProducts);
    allProducts = Array.isArray(data) ? data : fallbackProducts;
    renderProducts(allProducts);
    renderFilterButtons();
    renderPagination();
  } catch (error) {
    console.error('Failed to load products:', error);
    allProducts = fallbackProducts;
    renderProducts(allProducts);
    renderFilterButtons();
    renderPagination();
  }
}

function getFilteredProducts() {
  const search = document.getElementById('productSearch')?.value?.toLowerCase() || '';
  const category = document.getElementById('productFilter')?.value || 'all';
  const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';

  return allProducts.filter((product) => {
    const matchesCategory = category === 'all' || activeCategory === 'all' ? true : product.category === activeCategory;
    const matchesSearch = !search || `${product.name} ${product.category}`.toLowerCase().includes(search);
    const matchesFilter = category === 'all' || product.category === category;
    return matchesCategory && matchesSearch && matchesFilter;
  });
}

function renderProducts(products) {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;

  const filtered = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!Array.isArray(filtered) || filtered.length === 0) {
    productsGrid.innerHTML = '<p class="empty-message">No products available.</p>';
    return;
  }

  productsGrid.innerHTML = filtered.map(product => `
    <article class="card product-card" data-category="${product.category || 'all'}">
      <img src="${product.image_url || 'images/logo.png'}" alt="${escapeHtml(product.name)}" class="product-image">
      <p class="product-tagline">${escapeHtml(product.description || 'Premium product from Edmark Rwanda')}</p>
      <h3>${escapeHtml(product.name)}</h3>
      <p style="font-size: 0.95rem; color: #666;">${escapeHtml(product.category || '')}</p>
      <div class="product-price">${formatPrice(product.price)} RWF</div>
      <div class="product-actions">
        <button class="buy-btn" onclick="addToCart(${product.id}, '${escapeJs(product.name)}', ${product.price})">Add to Cart</button>
        <a class="text-link" href="product.html?id=${product.id}">View Details</a>
      </div>
    </article>
  `).join('');
}

function renderFilterButtons() {
  const container = document.getElementById('filterButtons');
  if (!container) return;
  const categories = ['all', ...new Set(allProducts.map((product) => product.category).filter(Boolean))];
  container.innerHTML = categories.map((category) => `
    <button class="filter-btn ${category === 'all' ? 'active' : ''}" data-category="${category}">${category === 'all' ? 'All Products' : category}</button>
  `).join('');

  container.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      currentPage = 1;
      applyCatalogFilters();
    });
  });
}

function renderPagination() {
  const container = document.getElementById('paginationControls');
  if (!container) return;
  const filtered = getFilteredProducts();
  const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  container.innerHTML = `
    <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
    <span>Page ${currentPage} of ${pages}</span>
    <button id="nextPage" ${currentPage === pages ? 'disabled' : ''}>Next</button>
  `;

  document.getElementById('prevPage')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      applyCatalogFilters();
    }
  });
  document.getElementById('nextPage')?.addEventListener('click', () => {
    if (currentPage < pages) {
      currentPage += 1;
      applyCatalogFilters();
    }
  });
}

function applyCatalogFilters() {
  const filtered = getFilteredProducts();
  renderProducts(filtered);
  renderPagination();
}

function formatPrice(price) {
  return Number(price).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

async function loadProductDetails() {
  const productTitle = document.getElementById('productTitle');
  if (!productTitle) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  if (!productId) return;

  try {
    const response = await fetch(`${API_BASE}/products/${productId}`);
    const product = response.ok ? await response.json() : null;
    if (!product) {
      throw new Error('Product not found');
    }

    document.getElementById('productName').textContent = product.name;
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productTagline').textContent = product.tagline || 'Premium wellness solution';
    document.getElementById('productSize').textContent = product.size || 'Available now';
    document.getElementById('productPrice').textContent = `${formatPrice(product.price)} RWF`;
    document.getElementById('productDescription').textContent = product.description || 'Premium wellness support product.';
    document.getElementById('productImage').innerHTML = `<img src="${product.image_url || 'images/logo.png'}" alt="${escapeHtml(product.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:1rem;">`;
    const benefitsList = document.getElementById('productBenefits');
    if (benefitsList && Array.isArray(product.benefits)) {
      benefitsList.innerHTML = product.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join('');
    }
    const ingredientsList = document.getElementById('productIngredients');
    if (ingredientsList && Array.isArray(product.ingredients)) {
      ingredientsList.innerHTML = product.ingredients.map((ingredient) => `<li><i class="fas fa-check" style="margin-right: 0.5rem; color: var(--primary-green);"></i> ${escapeHtml(ingredient)}</li>`).join('');
    }
  } catch (error) {
    const fallbackProduct = fallbackProducts.find((product) => String(product.id) === String(productId));
    if (fallbackProduct) {
      document.getElementById('productName').textContent = fallbackProduct.name;
      document.getElementById('productTitle').textContent = fallbackProduct.name;
      document.getElementById('productTagline').textContent = fallbackProduct.tagline || 'Premium wellness solution';
      document.getElementById('productSize').textContent = fallbackProduct.size || 'Available now';
      document.getElementById('productPrice').textContent = `${formatPrice(fallbackProduct.price)} RWF`;
      document.getElementById('productDescription').textContent = fallbackProduct.description || 'Premium wellness support product.';
      document.getElementById('productImage').innerHTML = `<img src="${fallbackProduct.image_url || 'images/logo.png'}" alt="${escapeHtml(fallbackProduct.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:1rem;">`;
      const benefitsList = document.getElementById('productBenefits');
      if (benefitsList && Array.isArray(fallbackProduct.benefits)) {
        benefitsList.innerHTML = fallbackProduct.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join('');
      }
      const ingredientsList = document.getElementById('productIngredients');
      if (ingredientsList && Array.isArray(fallbackProduct.ingredients)) {
        ingredientsList.innerHTML = fallbackProduct.ingredients.map((ingredient) => `<li><i class="fas fa-check" style="margin-right: 0.5rem; color: var(--primary-green);"></i> ${escapeHtml(ingredient)}</li>`).join('');
      }
      return;
    }
    document.getElementById('productTitle').textContent = 'Product unavailable';
  }
}

async function loadCustomerDashboard() {
  const container = document.getElementById('dashboardContent');
  if (!container) return;
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!user || !token) {
    container.innerHTML = '<div class="error-message">Please log in to view your dashboard.</div>';
    return;
  }
  try {
    const response = await fetch(`${API_BASE}/orders/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
    const orders = await response.json();
    container.innerHTML = `
      <div class="card">
        <h2>Welcome, ${escapeHtml(user.full_name || user.name || 'Customer')}</h2>
        <p>You can review your recent orders and account details here.</p>
      </div>
      <div class="card" style="margin-top: 1rem;">
        <h3>Your Orders</h3>
        ${orders.length ? orders.map((order) => `
          <div class="admin-item">
            <div>
              <strong>Order #${order.id}</strong>
              <p>Status: ${escapeHtml(order.order_status || 'pending')}</p>
              <p>Total: ${formatPrice(order.total_price || 0)} RWF</p>
            </div>
          </div>
        `).join('') : '<p>No orders yet.</p>'}
      </div>
    `;
  } catch (error) {
    container.innerHTML = '<div class="error-message">Unable to load dashboard details.</div>';
  }
}

function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  window.location.href = 'index.html';
}

async function submitContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const messageBox = document.getElementById('contactMessage');
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
  };

  if (!payload.name || !payload.email || !payload.message) {
    messageBox.textContent = 'Please fill in your name, email, and message.';
    messageBox.style.color = '#c0392b';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send message');
    messageBox.textContent = 'Message sent successfully. Our team will contact you soon.';
    messageBox.style.color = '#2d8a2d';
    form.reset();
  } catch (error) {
    messageBox.textContent = error.message || 'Unable to submit message';
    messageBox.style.color = '#c0392b';
  }
}

async function submitTestimonialForm(event) {
  event.preventDefault();
  const form = event.target;
  const messageBox = document.getElementById('testimonialMessage');
  const payload = {
    customer_name: form.customer_name.value.trim(),
    rating: Number(form.rating.value),
    message: form.message.value.trim(),
  };

  if (!payload.customer_name || !payload.message) {
    messageBox.textContent = 'Please add your name and feedback.';
    messageBox.style.color = '#c0392b';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to submit testimonial');
    messageBox.textContent = 'Thank you for your testimonial.';
    messageBox.style.color = '#2d8a2d';
    form.reset();
  } catch (error) {
    messageBox.textContent = error.message || 'Unable to submit testimonial';
    messageBox.style.color = '#c0392b';
  }
}

async function submitDistributorForm(event) {
  event.preventDefault();
  const form = event.target;
  const payload = {
    full_name: form.full_name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    district: form.district.value.trim(),
    message: form.message.value.trim(),
  };

  try {
    const response = await fetch(`${API_BASE}/distributors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to submit distributor application');
    const messageBox = document.getElementById('distributorMessage');
    if (messageBox) {
      messageBox.textContent = 'Your distributor application has been received.';
      messageBox.style.color = '#2d8a2d';
    }
    form.reset();
  } catch (error) {
    const messageBox = document.getElementById('distributorMessage');
    if (messageBox) {
      messageBox.textContent = error.message || 'Unable to submit distributor application';
      messageBox.style.color = '#c0392b';
    }
  }
}

function escapeHtml(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJs(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

const cart = [];

function addToCart(productId, productName, price) {
  const existing = cart.find(item => item.product_id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      product_id: productId,
      product_name: productName,
      unit_price: Number(price),
      quantity: 1
    });
  }

  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartEmpty = document.getElementById('cart-empty');

  if (!cartItems || !cartTotal || !cartEmpty) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '';
    cartEmpty.style.display = 'block';
    cartTotal.textContent = '0';
    return;
  }

  cartEmpty.style.display = 'none';
  cartItems.innerHTML = cart.map(item => `
    <li>${escapeHtml(item.product_name)} x ${item.quantity} - ${formatPrice(item.unit_price * item.quantity)} RWF</li>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  cartTotal.textContent = formatPrice(total);
}

async function placeOrder() {
  const nameInput = document.getElementById('customer-name');
  const emailInput = document.getElementById('customer-email');
  const messageArea = document.getElementById('cart-message');
  const paymentMethod = document.getElementById('payment-method')?.value || 'cash';
  const mtnPhone = document.getElementById('mtn-phone')?.value?.trim() || '';

  if (!nameInput || !emailInput || !messageArea) return;

  if (cart.length === 0) {
    messageArea.textContent = 'Add at least one product to your cart before placing an order.';
    messageArea.style.color = '#c0392b';
    return;
  }

  if (!nameInput.value.trim() || !emailInput.value.trim()) {
    messageArea.textContent = 'Please enter your name and email.';
    messageArea.style.color = '#c0392b';
    return;
  }

  if (paymentMethod === 'mtn' && !mtnPhone) {
    messageArea.textContent = 'Please enter your MTN phone number.';
    messageArea.style.color = '#c0392b';
    return;
  }

  const loggedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const payload = {
    user_id: loggedUser ? loggedUser.id : null,
    customer_name: nameInput.value.trim(),
    customer_email: emailInput.value.trim(),
    payment_method: paymentMethod,
    items: cart.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price
    }))
  };

  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Unable to place order');
    }

    const orderId = data.orderId;
    cart.length = 0;
    renderCart();

    if (paymentMethod === 'mtn') {
      messageArea.textContent = `Order #${orderId} placed. Initiating MTN payment...`;
      messageArea.style.color = '#2d8a2d';
      await initiateMtnPayment(orderId, mtnPhone);
    } else {
      messageArea.textContent = `Order placed successfully. Order ID: ${orderId}`;
      messageArea.style.color = '#2d8a2d';
    }
  } catch (error) {
    console.error('Order submission failed:', error);
    messageArea.textContent = error.message || 'Order failed. Please try again later.';
    messageArea.style.color = '#c0392b';
  }
}

async function initiateMtnPayment(orderId, phone) {
  const total = cart.length > 0
    ? cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
    : 0;

  const totalEl = document.getElementById('cart-total');
  const amount = totalEl ? parseInt(totalEl.textContent.replace(/,/g, '')) : total;

  const statusDiv = document.getElementById('payment-status');
  if (statusDiv) {
    statusDiv.style.display = 'block';
    statusDiv.style.background = '#e8f4fd';
    statusDiv.style.color = '#0B2D73';
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initiating MTN Mobile Money payment...';
  }

  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}/payments/initiate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        order_id: orderId,
        amount: amount,
        phone: phone,
        provider: 'mtn',
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Payment initiation failed');

    if (statusDiv) {
      statusDiv.style.background = '#e8fbf0';
      statusDiv.style.color = '#1E8E3E';
      statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Payment request sent! Please check your phone to complete the payment.';
    }

    pollPaymentStatus(data.payment_ref);
  } catch (error) {
    if (statusDiv) {
      statusDiv.style.background = '#fdecea';
      statusDiv.style.color = '#c0392b';
      statusDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message || 'Payment initiation failed'}. You can pay later via WhatsApp.`;
    }
  }
}

async function pollPaymentStatus(paymentRef, attempts = 0) {
  if (attempts >= 30) return;
  const statusDiv = document.getElementById('payment-status');

  setTimeout(async () => {
    try {
      const headers = {};
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/payments/status/${paymentRef}`, { headers });
      const data = await response.json();

      if (data.status === 'completed' || data.status === 'successful') {
        if (statusDiv) {
          statusDiv.style.background = '#e8fbf0';
          statusDiv.style.color = '#1E8E3E';
          statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Payment completed successfully!';
        }
        return;
      }

      if (data.status === 'failed' || data.status === 'cancelled') {
        if (statusDiv) {
          statusDiv.style.background = '#fdecea';
          statusDiv.style.color = '#c0392b';
          statusDiv.innerHTML = '<i class="fas fa-times-circle"></i> Payment was not completed. Please try again or use WhatsApp.';
        }
        return;
      }

      pollPaymentStatus(paymentRef, attempts + 1);
    } catch (error) {
      pollPaymentStatus(paymentRef, attempts + 1);
    }
  }, 5000);
}

window.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  renderCart();
  loadProductDetails();
  loadCustomerDashboard();

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', submitContactForm);
  }

  const testimonialForm = document.getElementById('testimonialForm');
  if (testimonialForm) {
    testimonialForm.addEventListener('submit', submitTestimonialForm);
  }

  const distributorForm = document.getElementById('distributorForm');
  if (distributorForm) {
    distributorForm.addEventListener('submit', submitDistributorForm);
  }

  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      applyCatalogFilters();
    });
  }

  const filterSelect = document.getElementById('productFilter');
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      currentPage = 1;
      applyCatalogFilters();
    });
  }

  const checkoutButton = document.getElementById('checkout-button');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', placeOrder);
  }

  const paymentMethod = document.getElementById('payment-method');
  if (paymentMethod) {
    paymentMethod.addEventListener('change', () => {
      const mtnSection = document.getElementById('mtn-phone-section');
      if (mtnSection) {
        mtnSection.style.display = paymentMethod.value === 'mtn' ? 'block' : 'none';
      }
    });
  }

  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
  }
});
