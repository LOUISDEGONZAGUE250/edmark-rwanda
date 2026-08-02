function getCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === '') return 'index.html';
  if (path === 'product.html') return 'products.html';
  return path;
}

function isUserLoggedIn() {
  return Boolean(localStorage.getItem('token') || sessionStorage.getItem('token'));
}

function getUserProfile() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
}

function handleLogout(event) {
  if (event) event.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  window.location.href = 'index.html';
}

const PRODUCT_LINKS = [
  { label: 'View All Products', href: 'products.html', page: 'products.html' },
  { label: 'P4 Healthy Slimming Programme', href: 'p4-healthy-slimming-programme.html', page: 'p4-healthy-slimming-programme.html' },
  { label: 'Beauty Pack', href: 'beauty-pack.html', page: 'beauty-pack.html' },
  { label: 'Lifestyle Beverages', href: 'lifestyle-beverages.html', page: 'lifestyle-beverages.html' },
  { label: 'Healthcare & Wellness', href: 'healthcare-wellness.html', page: 'healthcare-wellness.html' }
];

function buildNavigation() {
  const navs = document.querySelectorAll('.nav-links');
  if (!navs.length) return;

  const currentPage = getCurrentPage().toLowerCase();
  const productsActive = currentPage === 'product.html' || PRODUCT_LINKS.some((link) => link.page.toLowerCase() === currentPage);

  const links = [
    { label: 'Home', href: 'index.html', page: 'index.html' },
    { dropdown: true, label: 'Our Products', active: productsActive },
    { label: 'Business', href: 'business-opportunity.html', page: 'business-opportunity.html' },
    { label: 'Become Distributor', href: 'distributor.html', page: 'distributor.html' },
    { label: 'About', href: 'about.html', page: 'about.html' },
    { label: 'Testimonials', href: 'testimonials.html', page: 'testimonials.html' },
    { label: 'Contact', href: 'contact.html', page: 'contact.html' }
  ];

  navs.forEach((nav) => {
    nav.innerHTML = links.map((link) => {
      if (link.dropdown) {
        const activeClass = link.active ? 'active' : '';
        const dropdownLinks = PRODUCT_LINKS.map((item) => {
          const isActive = item.page && currentPage === item.page.toLowerCase();
          return `<a href="${item.href}" class="${isActive ? 'active' : ''}">${item.label}</a>`;
        }).join('');
        return `
          <div class="dropdown">
            <a href="products.html" class="drop-btn ${activeClass}">${link.label} <i class="fas fa-chevron-down caret"></i></a>
            <div class="dropdown-content">${dropdownLinks}</div>
          </div>`;
      }
      const isActive = link.page && currentPage === link.page.toLowerCase();
      const activeClass = isActive ? 'active' : '';
      return `<a href="${link.href}" class="${activeClass}">${link.label}</a>`;
    }).join('');

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
        }
      });
    });
  });
}

function injectTopBar() {
  if (document.querySelector('.topbar')) return;
  const header = document.querySelector('.site-header');
  if (!header) return;

  const user = getUserProfile();
  const loggedIn = isUserLoggedIn();

  let actions = '';
  if (loggedIn) {
    const isAdmin = user?.role === 'admin';
    const dashLabel = isAdmin ? 'Admin Dashboard' : 'My Account';
    const dashHref = isAdmin ? 'admin.html' : 'customer-dashboard.html';
    actions += `<a href="${dashHref}"><i class="fas fa-user-circle"></i> ${dashLabel}</a>`;
    actions += `<span class="topbar-divider"></span><a href="#" data-action="logout" class="topbar-logout"><i class="fas fa-sign-out-alt"></i> Logout</a>`;
  } else {
    actions += `<a href="login.html"><i class="fas fa-sign-in-alt"></i> Login</a>`;
    actions += `<span class="topbar-divider"></span><a href="register.html"><i class="fas fa-user-plus"></i> Register</a>`;
  }
  actions += `<span class="topbar-divider"></span><a href="products.html" class="topbar-cta"><i class="fas fa-shopping-bag"></i> Shop</a>`;

  const topbar = document.createElement('div');
  topbar.className = 'topbar';
  topbar.innerHTML = `
    <div class="container topbar-inner">
      <span class="topbar-tagline">
        <span><i class="fas fa-phone-alt"></i> +250 788 991 551</span>
        <span><i class="fas fa-map-marker-alt"></i> Kigali, Rwanda</span>
        <span><i class="fas fa-truck"></i> Nationwide delivery</span>
      </span>
      <div class="topbar-actions">${actions}</div>
    </div>`;
  document.body.insertBefore(topbar, header);

  const logoutLink = topbar.querySelector('[data-action="logout"]');
  if (logoutLink) logoutLink.addEventListener('click', (event) => handleLogout(event));
}

function injectFooterNewsletter() {
  const footer = document.querySelector('.site-footer');
  if (!footer || footer.dataset.newsletter) return;
  const container = footer.querySelector('.container');
  if (!container) return;

  const box = document.createElement('div');
  box.className = 'footer-newsletter';
  box.innerHTML = `
    <div class="footer-newsletter-text">
      <h3>Stay in the loop</h3>
      <p>Get exclusive offers, new arrivals, and health tips from Edmark Rwanda.</p>
    </div>
    <form class="newsletter-form">
      <input type="email" required placeholder="Your email address" aria-label="Email address">
      <button type="submit" class="btn btn-primary">Subscribe</button>
    </form>`;

  const form = box.querySelector('.newsletter-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
    button.disabled = true;
    form.querySelector('input').value = '';
  });

  container.prepend(box);
  footer.dataset.newsletter = '1';
}

// Mobile navigation toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

injectTopBar();
buildNavigation();
injectFooterNewsletter();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Home page transparent nav scroll effect
(function() {
  const header = document.querySelector('.site-header');
  if (!header || !document.body.classList.contains('home-page')) return;

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
})();

// Fade-in animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .product-card, .testimonial-card').forEach(el => {
  observer.observe(el);
});

// Active navigation link based on scroll
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks && menuToggle && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

// Prevent body scroll when mobile menu is open
const bodyScroll = (enable) => {
  if (enable) {
    document.body.style.overflow = 'auto';
  } else {
    document.body.style.overflow = 'hidden';
  }
};

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    bodyScroll(!isOpen);
  });
}

// Log page load for analytics
console.log('Edmark Rwanda website loaded successfully');

