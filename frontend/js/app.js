const fallbackProducts = [
  {
    id: 1,
    name: 'Splina Liquid Chlorophyll',
    description: 'A nutritional drink made of fresh and pure liquid chlorophyll from White Mulberry Leaves.',
    tagline: 'Purify Your Body. Balance Your pH.',
    benefits: ['Balances acid and alkaline levels in the body.', 'Cleanses the digestive system and helps purify the blood.', 'Rich in Vitamins A, C and E, Zinc, Folic Acid, Calcium, Magnesium, and Iron.', 'Boosts the immune system and increases oxygen supply in the blood.'],
    ingredients: ['Chlorophyll from White Mulberry Leaves', 'Vitamins A, C and E', 'Zinc, Folic Acid, Calcium, Magnesium and Iron', 'Purified water'],
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
    description: 'A fiber-rich cleansing drink that detoxifies your system and helps you feel full, naturally.',
    tagline: 'Detoxify. Cleanse. Feel Amazing in Just 8 Hours.',
    benefits: ['Fast and effective — see results in just eight hours.', 'Comes in two delicious flavors — Pandan and Lemon.', 'Keeps the digestive tract clean, healthy and feeling of fullness.', 'Absorbs fat and facilitates metabolism.'],
    ingredients: ['Dietary fiber blend', 'Natural botanical extracts', 'Pandan and Lemon flavors'],
    size: '12 sachets',
    price: 57000,
    image_url: 'images/shake-off.png',
    category: 'weight',
    stock_quantity: 0,
    featured: true,
  },
  {
    id: 3,
    name: 'MRT Complex',
    description: 'A delicious, low-calorie meal replacement loaded with complete vitamins, proteins, and energy-releasing amino acids.',
    tagline: 'Burn Fat. Cut Calories. No Hunger Pangs.',
    benefits: ['Replaces your meal to help you cut calories safely and effectively.', 'Loaded with complete vitamins, proteins, and energy-releasing amino acids.', 'Delicious, highly soluble and low in calories.', 'Comes in three delicious flavors — chocolate, vanilla, and strawberry.'],
    ingredients: ['Vitamins and minerals', 'Protein blend', 'Energy-releasing amino acids'],
    size: 'Chocolate / Vanilla / Strawberry',
    price: 123500,
    image_url: 'images/mrt-complex.png',
    category: 'nutrition',
    stock_quantity: 0,
    featured: true,
  },
  {
    id: 4,
    name: 'Red Yeast Coffee',
    description: 'Deep, full-bodied coffee blended with red yeast rice for optimal cholesterol health.',
    tagline: 'Rejuvenate Your Heart, Body and Mind.',
    benefits: ['Deep and full-bodied with a bold, complex flavor.', 'Supports optimal cholesterol health.', 'Made from an organic blend of premium imported coffee beans and red yeast rice.', 'A crisp finish that lingers in your taste buds.'],
    ingredients: ['Premium imported coffee beans', 'Red yeast rice'],
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
    description: 'Finest Arabica coffee beans from Brazil and Colombia infused with Korean Ginseng extract.',
    tagline: 'Smooth, Elegant and Refreshing.',
    benefits: ['A smooth, elegant and refreshing coffee drinking experience.', 'Infused with Korean Ginseng extract, known for increasing longevity.', 'Made from a natural blend of the finest Arabica coffee beans.', 'A healthy coffee that will satisfy your discriminating taste.'],
    ingredients: ['Arabica coffee beans', 'Korean Ginseng extract'],
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
    description: 'An all-natural HGH releaser made from excellent quality soy protein and amino acids that helps you look young, feel young, and be young.',
    tagline: 'Reverse Aging Naturally. 100% Natural · Zero Side Effects.',
    benefits: ['Helps you look young, feel young, and be young.', '100% natural — not a steroid or drug; tested and proven safe to consume.', 'Targets problem areas through gastric absorption into the bloodstream.', 'Rich in amino acids, glutamine, and Vitamin B5.'],
    ingredients: ['Soy protein', 'Amino acids', 'Glutamine', 'Vitamin B5'],
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
    description: 'A refreshing instant orange beverage loaded with natural Vitamin C and Calcium — every glass is equivalent to three fresh oranges!',
    tagline: 'Refresh. Energize. Burst into Bubbly Fun.',
    benefits: ['Every glass is loaded with Vitamin C equivalent to that of three fresh oranges.', 'Fortified with Calcium to energize the body and build bones, teeth and muscles.', 'Made from natural spray-dried orange juice concentrate.', 'Sweetened by natural fructose which does not raise blood sugar levels.'],
    ingredients: ['Natural spray-dried orange juice concentrate', 'Vitamin C', 'Calcium', 'Natural fructose', 'Carotene'],
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
    description: 'A nourishing collagen drink made of enzymatically hydrolysed fish collagen from marine sources such as salmon.',
    tagline: 'Tighten. Lift. Revive Your Skin\'s Natural Glow.',
    benefits: ['100% natural marine-source collagen for a rich supply of skin nourishment.', 'Lifts the signs of aging by boosting collagen formation in the epidermis.', 'Rich in amino acids such as Glycine, L-Proline and L-Hydroproline.', 'Refreshing, easily digested, and irresistibly chocolatey.'],
    ingredients: ['Hydrolysed fish collagen (marine source)', 'Amino acids: Glycine, L-Proline, L-Hydroproline', 'Malt', 'Chocolate flavor'],
    size: 'Easy to prepare drink',
    price: 35100,
    image_url: 'images/cocollagen.png',
    category: 'beauty',
    stock_quantity: 0,
    featured: false,
  },
  {
    id: 9,
    name: 'Beauty Pack',
    description: 'The complete 3-step beauty program — Reverse Aging, Tightening and Strengthening.',
    tagline: 'The Complete 3-Step Beauty Program.',
    benefits: ['Step 1 — Reverse Aging with Bio-Elixir.', 'Step 2 — Tightening with CoCollagen.', 'Step 3 — Strengthening with Bubble C.', 'Products designed to work together for total beauty from within.'],
    ingredients: ['Bio-Elixir', 'CoCollagen', 'Bubble C'],
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
      <img src="${product.image_url || 'images/logo.svg'}" alt="${escapeHtml(product.name)}" class="product-image" loading="lazy">
      <p class="product-tagline">${escapeHtml(product.tagline || product.description || 'Premium product from Edmark Rwanda')}</p>
      <h3>${escapeHtml(product.name)}</h3>
      ${Array.isArray(product.benefits) && product.benefits.length ? '<ul class="product-benefits">' + product.benefits.slice(0, 3).map(b => '<li>' + escapeHtml(b) + '</li>').join('') + '</ul>' : ''}
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
    document.getElementById('productImage').innerHTML = `<img src="${product.image_url || 'images/logo.svg'}" alt="${escapeHtml(product.name)}" style="width:100%;height:100%;object-fit:contain;border-radius:1rem;">`;
    if (typeof window !== 'undefined') window.currentProductImage = product.image_url || 'images/logo.svg';
    const thumbs = document.getElementById('productThumbnails');
    if (thumbs && product.image_url) {
      const img = product.image_url;
      thumbs.querySelectorAll('.product-thumb').forEach((t, i) => {
        t.innerHTML = `<img src="${img}" alt="Thumbnail ${i+1}" style="width:100%;height:100%;object-fit:cover;border-radius:0.3rem;">`;
      });
    }
    const benefitsList = document.getElementById('productBenefits');
    if (benefitsList && Array.isArray(product.benefits)) {
      benefitsList.innerHTML = product.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join('');
    }
    const ingredientsList = document.getElementById('productIngredients');
    if (ingredientsList && Array.isArray(product.ingredients)) {
      ingredientsList.innerHTML = product.ingredients.map((ingredient) => `<li><i class="fas fa-check" style="margin-right: 0.5rem; color: var(--primary-red);"></i> ${escapeHtml(ingredient)}</li>`).join('');
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
      document.getElementById('productImage').innerHTML = `<img src="${fallbackProduct.image_url || 'images/logo.svg'}" alt="${escapeHtml(fallbackProduct.name)}" style="width:100%;height:100%;object-fit:contain;border-radius:1rem;">`;
      if (typeof window !== 'undefined') window.currentProductImage = fallbackProduct.image_url || 'images/logo.svg';
      const thumbs = document.getElementById('productThumbnails');
      if (thumbs && fallbackProduct.image_url) {
        const img = fallbackProduct.image_url;
        thumbs.querySelectorAll('.product-thumb').forEach((t, i) => {
          t.innerHTML = `<img src="${img}" alt="Thumbnail ${i+1}" style="width:100%;height:100%;object-fit:cover;border-radius:0.3rem;">`;
        });
      }
      const benefitsList = document.getElementById('productBenefits');
      if (benefitsList && Array.isArray(fallbackProduct.benefits)) {
        benefitsList.innerHTML = fallbackProduct.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join('');
      }
      const ingredientsList = document.getElementById('productIngredients');
      if (ingredientsList && Array.isArray(fallbackProduct.ingredients)) {
        ingredientsList.innerHTML = fallbackProduct.ingredients.map((ingredient) => `<li><i class="fas fa-check" style="margin-right: 0.5rem; color: var(--primary-red);"></i> ${escapeHtml(ingredient)}</li>`).join('');
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
    container.innerHTML = '<div class="error-message">Please log in to view your dashboard. <a href="login.html">Log in here</a></div>';
    return;
  }

  const displayName = user.full_name || user.name || 'Customer';
  const initials = displayName.split(/\s+/).map((part) => part[0]).filter(Boolean).join('').slice(0, 2).toUpperCase();
  const joinedAt = user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' }) : null;

  let orders = [];
  try {
    const response = await fetch(`${API_BASE}/orders/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (response.ok) orders = await response.json();
  } catch (error) {
    orders = [];
  }

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
  const pendingCount = orders.filter((order) => (order.order_status || 'pending') === 'pending').length;

  const statusLabel = (status) => {
    const value = String(status || 'pending').toLowerCase();
    if (value === 'shipped') return 'Shipped';
    if (value === 'delivered' || value === 'completed') return 'Delivered';
    if (value === 'cancelled' || value === 'canceled') return 'Cancelled';
    return 'Pending';
  };

  const ordersMarkup = orders.length
    ? orders.map((order) => {
        const items = Array.isArray(order.items)
          ? order.items.map((item) => `${escapeHtml(item.product_name || 'Product')} &times; ${item.quantity}`).join(', ')
          : 'Order items';
        const date = order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently';
        const payment = order.payment_method ? `Paid via ${escapeHtml(order.payment_method)}` : 'Payment pending';
        return `
          <div class="order-item">
            <div class="order-item-head">
              <span class="order-id">Order #${order.id}</span>
              <span class="order-status status-${String(order.order_status || 'pending').toLowerCase()}">${statusLabel(order.order_status)}</span>
            </div>
            <p class="order-date">${date}</p>
            <p class="order-lines">${items}</p>
            <p class="order-total">Total: <strong>${formatPrice(order.total_price || 0)} RWF</strong> &middot; ${payment}</p>
          </div>`;
      }).join('')
    : '<p class="empty-note">No orders yet. <a href="products.html">Browse our products</a> and place your first order.</p>';

  container.innerHTML = `
    <div class="dashboard-grid">
      <div class="dashboard-profile-col">
        <div class="profile-card">
          <div class="profile-avatar">${escapeHtml(initials)}</div>
          <h2>${escapeHtml(displayName)}</h2>
          <p class="profile-meta"><i class="fas fa-check-circle"></i> ${escapeHtml(user.role || 'Customer')} account</p>
          <ul class="profile-list">
            <li><i class="fas fa-envelope"></i> ${escapeHtml(user.email || '—')}</li>
            <li><i class="fas fa-phone-alt"></i> ${escapeHtml(user.phone || '+250 788 991 551')}</li>
            ${joinedAt ? `<li><i class="fas fa-calendar-check"></i> Member since ${joinedAt}</li>` : ''}
          </ul>
          <button type="button" class="btn btn-secondary" id="logoutUserBtn"><i class="fas fa-sign-out-alt"></i> Log out</button>
        </div>

        <div class="support-card">
          <h3>Need help?</h3>
          <p>Our Kigali team is happy to assist with orders, delivery, and product advice.</p>
          <a class="contact-line" href="tel:+250788991551"><i class="fas fa-phone-alt"></i> +250 788 991 551</a>
          <a class="contact-line" href="mailto:info@edmarkrwanda.com"><i class="fas fa-envelope"></i> info@edmarkrwanda.com</a>
          <a class="contact-line" href="https://wa.me/250788991551"><i class="fab fa-whatsapp"></i> Chat on WhatsApp</a>
          <a class="contact-line" href="contact.html"><i class="fas fa-paper-plane"></i> Send us a message</a>
        </div>
      </div>

      <div class="dashboard-main-col">
        <div class="stats-grid dashboard-stats">
          <div class="stat-card">
            <span class="stat-value">${orders.length}</span>
            <span class="stat-label">Total orders</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${pendingCount}</span>
            <span class="stat-label">Pending</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${formatPrice(totalSpent)} RWF</span>
            <span class="stat-label">Total spent</span>
          </div>
        </div>

        <div class="orders-card">
          <div class="section-heading">
            <p class="eyebrow">Order History</p>
            <h2>Your Orders</h2>
          </div>
          ${ordersMarkup}
        </div>
      </div>
    </div>
  `;

  const logoutBtn = document.getElementById('logoutUserBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
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
    cartTotal.textContent = '0 RWF';
    return;
  }

  cartEmpty.style.display = 'none';
  cartItems.innerHTML = cart.map(item => `
    <li>${escapeHtml(item.product_name)} x ${item.quantity} - ${formatPrice(item.unit_price * item.quantity)} RWF</li>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  cartTotal.textContent = `${formatPrice(total)} RWF`;
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
    statusDiv.style.color = '#040059';
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
      statusDiv.style.color = '#E2231A';
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
          statusDiv.style.color = '#E2231A';
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
});
