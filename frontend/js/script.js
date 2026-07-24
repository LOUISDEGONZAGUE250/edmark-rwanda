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

function buildNavigation() {
  const navs = document.querySelectorAll('.nav-links');
  if (!navs.length) return;

  const currentPage = getCurrentPage().toLowerCase();
  const user = getUserProfile();
  const loggedIn = isUserLoggedIn();

  const links = [
    { label: 'Home', href: 'index.html', page: 'index.html' },
    { label: 'Products', href: 'products.html', page: 'products.html' },
    { label: 'Business', href: 'business-opportunity.html', page: 'business-opportunity.html' },
    { label: 'Become Distributor', href: 'distributor.html', page: 'distributor.html' },
    { label: 'About', href: 'about.html', page: 'about.html' },
    { label: 'Testimonials', href: 'testimonials.html', page: 'testimonials.html' },
    { label: 'Contact', href: 'contact.html', page: 'contact.html' }
  ];

  if (loggedIn) {
    const dashboardPage = user?.role === 'admin' ? 'admin.html' : 'customer-dashboard.html';
    const dashboardLabel = user?.role === 'admin' ? 'Admin' : 'Dashboard';
    links.push({ label: dashboardLabel, href: dashboardPage, page: dashboardPage });
    links.push({ label: 'Logout', href: '#', action: 'logout' });
  } else {
    links.push({ label: 'Login', href: 'login.html', page: 'login.html' });
    links.push({ label: 'Register', href: 'register.html', page: 'register.html' });
  }

  navs.forEach((nav) => {
    nav.innerHTML = links.map((link) => {
      const isActive = link.page && currentPage === link.page.toLowerCase();
      const activeClass = isActive ? 'active' : '';
      if (link.action === 'logout') {
        return `<a href="#" class="${activeClass}" data-action="logout" style="color:#c0392b; font-weight:600;">${link.label}</a>`;
      }
      return `<a href="${link.href}" class="${activeClass}">${link.label}</a>`;
    }).join('');

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (link.dataset.action === 'logout') {
          handleLogout(event);
          return;
        }
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
        }
      });
    });
  });
}

// Mobile navigation toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

buildNavigation();

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

