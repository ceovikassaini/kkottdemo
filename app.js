// Khazana King OTT - Application Core Logic Engine

// Global State Management
const DEFAULT_USER = {
  name: "Rohan Malhotra",
  email: "rohan.m@khazana.com",
  plan: "None", // Starting state is None to force payment checkout
  since: "14 Jun 2026",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
  autoRenew: true
};

const state = {
  currentUser: JSON.parse(localStorage.getItem('khazana_user')) || null,
  watchlist: JSON.parse(localStorage.getItem('khazana_watchlist')) || ["m1", "m3", "s1"],
  watchHistory: JSON.parse(localStorage.getItem('khazana_history')) || [
    { id: "m2", progress: 60, durationText: "12m 14s" },
    { id: "s2", progress: 25, durationText: "8 Episodes" }
  ],
  customMovies: JSON.parse(localStorage.getItem('khazana_custom_movies')) || [],
  billingInvoices: JSON.parse(localStorage.getItem('khazana_invoices')) || [],
  deletedDefaultMovies: JSON.parse(localStorage.getItem('khazana_deleted_movies')) || [],
  editingVideoId: null,
  currentView: "landing",
  activeFilters: { genre: "", language: "", year: "", rating: "", country: "" },
  searchQuery: "",
  isYearlyBilling: false,
  activePlayback: null, // Movie ID currently playing
  theme: localStorage.getItem('khazana_theme') || 'dark'
};

// Subtitle tracks mock database
const SUBTITLE_TRACKS = {
  m1: { // Sintel
    en: [
      { time: 2, text: "[Wind howling over icy mountain peaks]" },
      { time: 5, text: "Sintel: 'Scales... Scales! Where are you?'" },
      { time: 9, text: "[Eerie low growls echoing in the caves]" },
      { time: 12, text: "Sintel: 'I will find you, my friend. I promise.'" }
    ],
    hi: [
      { time: 2, text: "[बर्फ़ीली पहाड़ियों पर तेज़ हवाएँ चल रही हैं]" },
      { time: 5, text: "सिंटेल: 'स्केल्स... स्केल्स! तुम कहाँ हो?'" },
      { time: 9, text: "गुफाओं में गूंजती हुई रहस्यमयी आवाज़" },
      { time: 12, text: "सिंटेल: 'मैं तुम्हें ढूंढ लूंगी, मेरे दोस्त। मैं वादा करती हूँ।'" }
    ],
    es: [
      { time: 2, text: "[El viento aúlla sobre picos montañosos]" },
      { time: 5, text: "Sintel: 'Scales... ¡Scales! ¿Dónde estás?'" },
      { time: 9, text: "[Rugidos oscuros retumban en las cuevas]" },
      { time: 12, text: "Sintel: 'Te encontraré, mi amigo. Lo prometo.'" }
    ]
  },
  m2: { // Tears of Steel
    en: [
      { time: 2, text: "[Giant robotic spider engines whirring]" },
      { time: 6, text: "Celia: 'The cybernetics were designed to help humanity...'" },
      { time: 10, text: "Barak: 'Now they are hunting us. Get back!'" }
    ],
    hi: [
      { time: 2, text: "[विशालकाय रोबोटिक मकड़ी के चलने की आवाज़]" },
      { time: 6, text: "सीलिया: 'ये मशीनें मानवता की भलाई के लिए थीं...'" },
      { time: 10, text: "बराक: 'अब ये हमारा शिकार कर रही हैं। पीछे हटो!'" }
    ],
    es: [
      { time: 2, text: "[Motores de arañas robóticas gigantes zumbando]" },
      { time: 6, text: "Celia: 'La cibernética fue diseñada para ayudar a la humanidad...'" },
      { time: 10, text: "Barak: 'Ahora nos están cazando. ¡Atrás!'" }
    ]
  },
  m3: { // Big Buck Bunny
    en: [
      { time: 2, text: "[Upbeat acoustic woodwind music playing]" },
      { time: 5, text: "Bunny: *chuckles softly, sniffing a wild orchid*" },
      { time: 8, text: "[Squeaking noises: The rodents prepare their sling shot]" }
    ],
    hi: [
      { time: 2, text: "[मधुर ग्रामीण संगीत बज रहा है]" },
      { time: 5, text: "बनी: *प्यार से मुस्कुराते हुए फूलों को सूंघता है*" },
      { time: 8, text: "[चूहे गुलेल तैयार कर रहे हैं]" }
    ],
    es: [
      { time: 2, text: "[Música campestre alegre sonando]" },
      { time: 5, text: "Conejo: *se ríe suavemente, oliendo una orquídea*" },
      { time: 8, text: "[Ruidos: Los roedores preparan su tirachinas]" }
    ]
  }
};

// Helper: Save state to localStorage
function saveState() {
  localStorage.setItem('khazana_user', JSON.stringify(state.currentUser));
  localStorage.setItem('khazana_watchlist', JSON.stringify(state.watchlist));
  localStorage.setItem('khazana_history', JSON.stringify(state.watchHistory));
  localStorage.setItem('khazana_custom_movies', JSON.stringify(state.customMovies));
  localStorage.setItem('khazana_invoices', JSON.stringify(state.billingInvoices));
}

// 1. SPA Router Engine with route validation guards
function getRouteParams() {
  const hash = window.location.hash || '#landing';
  const parts = hash.split('?');
  const route = parts[0];
  const params = {};
  if (parts[1]) {
    const pList = parts[1].split('&');
    pList.forEach(p => {
      const kv = p.split('=');
      params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
  }
  return { route, params };
}

function router() {
  const { route, params } = getRouteParams();

  // Remove active navbar links styling
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.mobile-item').forEach(item => item.classList.remove('active'));

  // Close mobile drawer
  document.getElementById('mobile-nav-drawer').classList.remove('open');
  document.getElementById('mobile-nav-backdrop').classList.remove('show');

  // Onboarding Gates validation checks
  const isLoggedIn = state.currentUser != null;
  const isSubscribed = isLoggedIn && state.currentUser.plan && state.currentUser.plan !== 'None';
  
  // Update Navbar widgets depending on login & subscription status
  const navLinks = document.querySelector('.nav-links');
  const navSearch = document.querySelector('.nav-search-container');
  const navNotifications = document.querySelector('.notification-container');
  const signInBtn = document.getElementById('nav-signin-btn');
  const signUpBtn = document.getElementById('nav-signup-btn');
  const profileBtn = document.getElementById('nav-profile-btn');

  if (isLoggedIn) {
    if (signInBtn) signInBtn.style.display = 'none';
    if (signUpBtn) signUpBtn.style.display = 'none';
    profileBtn.style.display = 'block';
    
    const avatarSrc = state.currentUser.avatar || DEFAULT_USER.avatar;
    document.getElementById('nav-profile-img').src = avatarSrc;
    document.getElementById('dropdown-user-name').textContent = state.currentUser.name;
    document.getElementById('dropdown-user-plan').textContent = state.currentUser.plan;

    if (state.currentUser.email === "admin@khazanaking.com") {
      document.getElementById('dropdown-link-admin').style.display = 'flex';
    } else {
      document.getElementById('dropdown-link-admin').style.display = 'none';
    }
  } else {
    if (signInBtn) signInBtn.style.display = 'block';
    if (signUpBtn) signUpBtn.style.display = 'block';
    profileBtn.style.display = 'none';
    document.getElementById('dropdown-link-admin').style.display = 'none';
  }

  // Gate header links and search controls
  if (isSubscribed) {
    navLinks.style.display = 'flex';
    navSearch.style.display = 'flex';
    navNotifications.style.display = 'block';
  } else {
    navLinks.style.display = 'none';
    navSearch.style.display = 'none';
    navNotifications.style.display = 'none';
  }

  let finalRoute = route;

  const publicRoutes = ['#landing', '#contact', '#privacy', '#terms', '#refund', '#faq', '#about'];

  // ROUTE LOCKS
  if (!isLoggedIn) {
    // Guest flow
    if (!publicRoutes.includes(route)) {
      finalRoute = '#landing';
      window.location.hash = '#landing';
      return;
    }
  } else if (!isSubscribed) {
    // Logged in but not paid subscription funnel
    if (route === '#landing' || !['#plans', '#dashboard', ...publicRoutes].includes(route)) {
      finalRoute = '#plans';
      window.location.hash = '#plans';
      return;
    }
  } else {
    // Paid active members cannot visit landing or plans selecting
    if (route === '#landing' || route === '#plans') {
      finalRoute = '#home';
      window.location.hash = '#home';
      return;
    }
  }

  // Hide all main page views once route is confirmed
  document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));

  // Load appropriate view
  switch (finalRoute) {
    case '#landing':
      document.getElementById('landing-view').classList.remove('hidden');
      renderLandingFAQs();
      renderLandingTrendingMovies();
      break;
    case '#plans':
      document.getElementById('plans-selection-view').classList.remove('hidden');
      renderPlansSelectionView();
      break;
    case '#home':
      document.getElementById('home-view').classList.remove('hidden');
      document.getElementById('nav-link-home').classList.add('active');
      document.getElementById('mobile-link-home').classList.add('active');
      break;
    case '#movies':
      document.getElementById('movies-view').classList.remove('hidden');
      document.getElementById('nav-link-movies').classList.add('active');
      document.getElementById('mobile-link-movies').classList.add('active');
      renderMoviesCatalog();
      break;
    case '#series':
      document.getElementById('series-view').classList.remove('hidden');
      document.getElementById('nav-link-series').classList.add('active');
      document.getElementById('mobile-link-series').classList.add('active');
      renderSeriesCatalog();
      break;
    case '#live-tv':
      document.getElementById('live-tv-view').classList.remove('hidden');
      document.getElementById('nav-link-live').classList.add('active');
      document.getElementById('mobile-link-live').classList.add('active');
      renderLiveTVCatalog();
      break;
    case '#categories':
      document.getElementById('categories-view').classList.remove('hidden');
      document.getElementById('nav-link-categories').classList.add('active');
      document.getElementById('mobile-link-categories').classList.add('active');
      renderCategoryFilteredCatalog(params.genre || '');
      break;
    case '#my-list':
      document.getElementById('my-list-view').classList.remove('hidden');
      document.getElementById('nav-link-mylist').classList.add('active');
      document.getElementById('mobile-link-mylist').classList.add('active');
      renderWatchlistCatalog();
      break;
    case '#dashboard':
      document.getElementById('dashboard-view').classList.remove('hidden');
      renderDashboardData();
      break;
    case '#admin':
      document.getElementById('admin-view').classList.remove('hidden');
      renderAdminDashboard();
      break;
    case '#contact':
      document.getElementById('contact-view').classList.remove('hidden');
      break;
    case '#terms':
      document.getElementById('terms-view').classList.remove('hidden');
      break;
    case '#privacy':
      document.getElementById('privacy-view').classList.remove('hidden');
      break;
    case '#refund':
      document.getElementById('refund-view').classList.remove('hidden');
      break;
    case '#about':
      document.getElementById('about-view').classList.remove('hidden');
      document.getElementById('nav-link-about')?.classList.add('active');
      document.getElementById('mobile-link-about')?.classList.add('active');
      break;
    case '#faq':
      document.getElementById('faq-view').classList.remove('hidden');
      renderPublicFAQs();
      break;
    default:
      if (isSubscribed) {
        window.location.hash = '#home';
      } else {
        window.location.hash = '#landing';
      }
  }

  // Auto scroll top when shifting pages
  window.scrollTo({ top: 0, behavior: 'instant' });
  updateLegalNavHighlight(finalRoute);
}

// 2. Data catalog aggregation
function getFullCatalog() {
  return [
    ...window.movieData.filter(m => !state.deletedDefaultMovies.includes(m.id)),
    ...state.customMovies
  ];
}

// 3. UI rendering engines

// Carousel Rows
function renderCarousel(rowId, filterFn, title) {
  const container = document.getElementById(rowId);
  if (!container) return;

  const list = getFullCatalog().filter(filterFn);
  if (list.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';

  container.innerHTML = `
    <div class="row-header">
      <h2 class="row-title">${title}</h2>
      <div class="carousel-controls">
        <button class="carousel-btn btn-left" id="${rowId}-btn-left" title="Scroll Left">‹</button>
        <button class="carousel-btn btn-right" id="${rowId}-btn-right" title="Scroll Right">›</button>
      </div>
    </div>
    <div class="row-cards-container" id="${rowId}-cards">
      ${list.map(item => renderMovieCard(item)).join('')}
    </div>
  `;

  // Attach card event listeners
  list.forEach(item => {
    const cardEl = container.querySelector(`[data-id="${item.id}"]`);
    if (cardEl) {
      cardEl.addEventListener('click', () => openDetailsModal(item.id));
    }
  });

  // Attach carousel scroll listeners
  const cardsBox = document.getElementById(`${rowId}-cards`);
  const leftBtn = document.getElementById(`${rowId}-btn-left`);
  const rightBtn = document.getElementById(`${rowId}-btn-right`);

  if (cardsBox && leftBtn && rightBtn) {
    leftBtn.addEventListener('click', () => {
      cardsBox.scrollBy({ left: -400, behavior: 'smooth' });
    });
    rightBtn.addEventListener('click', () => {
      cardsBox.scrollBy({ left: 400, behavior: 'smooth' });
    });
  }
}

// Single Movie Card builder
function renderMovieCard(item) {
  const isInWatchlist = state.watchlist.includes(item.id);
  const watchlistIcon = isInWatchlist ? '✓' : '+';
  const continueProgress = state.watchHistory.find(h => h.id === item.id);
  const progressBarMarkup = continueProgress 
    ? `<div class="continue-progress-bar"><div class="continue-progress" style="width: ${continueProgress.progress}%"></div></div>`
    : '';

  return `
    <div class="movie-card" data-id="${item.id}">
      <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
      ${progressBarMarkup}
      <div class="movie-card-info">
        <h4 class="card-title">${item.title}</h4>
        <div class="card-meta">
          <span class="card-rating">★ ${item.rating}</span>
          <span>${item.year}</span>
          <span>${item.duration}</span>
        </div>
        <div class="card-genres">${item.genres.join(', ')}</div>
        <div class="card-actions">
          <button class="card-btn card-btn-play" onclick="event.stopPropagation(); playVideo('${item.id}');" title="Play Now">▶</button>
          <button class="card-btn card-btn-watchlist" onclick="event.stopPropagation(); toggleWatchlist('${item.id}');" title="Toggle Watchlist">${watchlistIcon}</button>
        </div>
      </div>
    </div>
  `;
}

// Categories Grid
function renderCategoriesGrid() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  container.innerHTML = window.categoriesList.map(cat => `
    <div class="category-card" style="background: ${cat.gradient};" onclick="window.location.hash = '#categories?genre=${cat.name}';">
      <span class="category-icon">${cat.icon}</span>
      <span>${cat.name}</span>
    </div>
  `).join('');
}

// Live TV Grid
function renderLiveTVGrid() {
  const container = document.getElementById('live-channels-grid');
  if (!container) return;

  container.innerHTML = window.liveChannels.map(channel => `
    <div class="live-card" onclick="playLiveChannel('${channel.id}')">
      <div class="live-badge">Live</div>
      <div class="live-channel-icon">${channel.logo}</div>
      <div class="live-channel-details">
        <h4 class="live-channel-name">${channel.name}</h4>
        <p class="live-program">${channel.program}</p>
        <p class="live-next">${channel.nextProgram}</p>
      </div>
    </div>
  `).join('');
}

// Subscription Plans (General footer page / Home section)
function renderPricingPlans() {
  const container = document.getElementById('plans-grid-container');
  if (!container) return;

  container.innerHTML = window.subscriptionPlans.map(plan => {
    const price = plan.price;
    const validity = plan.validity;
    const isPopularClass = plan.popular ? 'popular' : '';
    const popularBadge = plan.popular ? `<span class="popular-badge">Best Value</span>` : '';

    return `
      <div class="plan-card ${isPopularClass}">
        ${popularBadge}
        <div class="plan-header">
          <h3 class="plan-name">${plan.name}</h3>
          <div class="plan-price-box">
            <span class="plan-currency">₹</span>
            <span class="plan-price">${price}</span>
            <span class="plan-period">/ ${validity}</span>
          </div>
        </div>
        <ul class="plan-features-list">
          <li class="plan-feature-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Resolution: <strong>${plan.resolution}</strong>
          </li>
          <li class="plan-feature-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Active screens: <strong>${plan.screens}</strong>
          </li>
          <li class="plan-feature-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Downloads: <strong>${plan.downloads}</strong>
          </li>
          <li class="plan-feature-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Audio track: <strong>${plan.audio}</strong>
          </li>
          ${plan.features.slice(1).map(f => `
            <li class="plan-feature-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ${f}
            </li>
          `).join('')}
        </ul>
        <button class="btn btn-primary plan-btn" onclick="initiatePlanCheckout('${plan.id}')">Select ${plan.name}</button>
      </div>
    `;
  }).join('');
}

// Subscription Plans (Dedicated selection view gate)
function renderPlansSelectionView() {
  const container = document.getElementById('plans-sel-grid-container');
  if (!container) return;

  container.innerHTML = window.subscriptionPlans.map(plan => {
    const price = plan.price;
    const validity = plan.validity;
    const isPopularClass = plan.popular ? 'popular' : '';
    const popularBadge = plan.popular ? `<span class="popular-badge">Best Value</span>` : '';

    return `
      <div class="plan-card ${isPopularClass}">
        ${popularBadge}
        <div class="plan-header">
          <h3 class="plan-name">${plan.name}</h3>
          <div class="plan-price-box">
            <span class="plan-currency">₹</span>
            <span class="plan-price">${price}</span>
            <span class="plan-period">/ ${validity}</span>
          </div>
        </div>
        <ul class="plan-features-list">
          <li class="plan-feature-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Resolution: <strong>${plan.resolution}</strong>
          </li>
          <li class="plan-feature-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Active screens: <strong>${plan.screens}</strong>
          </li>
          <li class="plan-feature-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Downloads: <strong>${plan.downloads}</strong>
          </li>
          <li class="plan-feature-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Audio track: <strong>${plan.audio}</strong>
          </li>
          ${plan.features.slice(1).map(f => `
            <li class="plan-feature-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ${f}
            </li>
          `).join('')}
        </ul>
        <button class="btn btn-primary plan-btn" onclick="initiatePlanCheckout('${plan.id}')">Select ${plan.name}</button>
      </div>
    `;
  }).join('');
}

// Testimonials Carousel
function renderTestimonials() {
  const container = document.getElementById('testimonials-grid-container');
  if (!container) return;

  container.innerHTML = window.testimonials.map(t => `
    <div class="testimonial-card">
      <div class="rating-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-user">
        <div class="testimonial-avatar">
          <img src="${t.avatar}" alt="${t.name}">
        </div>
        <div class="user-details">
          <h4 class="user-name">${t.name}</h4>
          <span class="user-role">${t.role}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// FAQs
function renderFAQs() {
  const container = document.getElementById('faq-accordion-list');
  if (!container) return;

  container.innerHTML = window.faqs.map((faq, index) => `
    <div class="faq-item" id="faq-item-${index}">
      <button class="faq-question-btn" onclick="toggleFAQAccordion(${index})">
        <span>${faq.question}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">${faq.answer}</div>
      </div>
    </div>
  `).join('');
}

function toggleFAQAccordion(index) {
  const item = document.getElementById(`faq-item-${index}`);
  if (!item) return;

  const isActive = item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));

  if (!isActive) {
    item.classList.add('active');
  }
}

// Landing FAQs rendering
function renderLandingFAQs() {
  const container = document.getElementById('landing-faq-list');
  if (!container) return;

  container.innerHTML = window.faqs.map((faq, index) => `
    <div class="faq-item" id="landing-faq-item-${index}">
      <button class="faq-question-btn" onclick="toggleLandingFAQAccordion(${index})">
        <span>${faq.question}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">${faq.answer}</div>
      </div>
    </div>
  `).join('');
}

// Landing Page Trending Content Preview
function renderLandingTrendingMovies() {
  const container = document.getElementById('landing-trending-grid');
  if (!container) return;

  const trending = getFullCatalog().slice(0, 5);
  container.innerHTML = trending.map(item => `
    <div class="movie-card" onclick="openAuthModal('signup')">
      <div class="movie-thumbnail-wrapper">
        <img class="movie-thumbnail" src="${item.thumbnail}" alt="${item.title}">
        <div class="movie-card-overlay">
          <div class="play-btn-circle">▶</div>
        </div>
      </div>
      <div class="movie-info">
        <h4 class="movie-card-title">${item.title}</h4>
        <div class="movie-meta-row">
          <span>${item.year}</span>
          <span class="rating-badge">★ ${item.rating}</span>
        </div>
      </div>
    </div>
  `).join('');
}

window.toggleLandingFAQAccordion = function(index) {
  const item = document.getElementById(`landing-faq-item-${index}`);
  if (!item) return;

  const isActive = item.classList.contains('active');
  document.querySelectorAll('#landing-faq-list .faq-item').forEach(f => f.classList.remove('active'));

  if (!isActive) {
    item.classList.add('active');
  }
};

function renderPublicFAQs() {
  const container = document.getElementById('public-faq-accordion-list');
  if (!container || !window.faqs) return;

  container.innerHTML = window.faqs.map((faq, index) => `
    <div class="faq-item" id="public-faq-item-${index}">
      <button class="faq-question-btn" onclick="togglePublicFAQAccordion(${index})">
        <span>${faq.question}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">${faq.answer}</div>
      </div>
    </div>
  `).join('');
}

window.togglePublicFAQAccordion = function(index) {
  const item = document.getElementById(`public-faq-item-${index}`);
  if (!item) return;

  const isActive = item.classList.contains('active');
  document.querySelectorAll('#public-faq-accordion-list .faq-item').forEach(f => f.classList.remove('active'));

  if (!isActive) {
    item.classList.add('active');
  }
};

function initFooterNavigation() {
  // Only intercept in-app hash routes (not .html legal pages)
  const navigate = (e) => {
    const link = e.target.closest('a[data-route]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.endsWith('.html')) return;
    e.preventDefault();
    window.location.hash = link.dataset.route;
  };

  document.querySelector('.landing-footer-links')?.addEventListener('click', navigate);
}

function updateLegalNavHighlight(route) {
  document.querySelectorAll('.legal-nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route);
  });
}

// Hero Carousel Slider logic
let heroIndex = 0;
let heroInterval = null;

function renderHeroSlider() {
  const container = document.getElementById('hero-slider');
  if (!container) return;

  const featured = getFullCatalog().slice(0, 3);
  if (featured.length === 0) return;

  let slidesHTML = '';
  let dotsHTML = '';

  featured.forEach((item, idx) => {
    const activeClass = idx === 0 ? 'active' : '';
    slidesHTML += `
      <div class="hero-slide ${activeClass}" style="background-image: url('${item.banner}');" id="hero-slide-${idx}">
        <div class="hero-content">
          <div class="hero-badge">🏆 TOP CINEMA</div>
          <h1 class="hero-title">${item.title}</h1>
          <div class="hero-meta">
            <span class="hero-rating">★ ${item.rating} Rating</span>
            <span>${item.year}</span>
            <span class="hero-age-rating">U/A 16+</span>
            <span>${item.duration}</span>
            <span class="details-meta-badge">4K Ultra HD</span>
          </div>
          <p class="hero-desc">${item.description}</p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="playVideo('${item.id}')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Watch Now
            </button>
            <button class="btn btn-secondary" onclick="toggleWatchlist('${item.id}')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Watchlist
            </button>
            <button class="btn btn-secondary" onclick="openDetailsModal('${item.id}')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Trailer & Info
            </button>
          </div>
        </div>
      </div>
    `;
    dotsHTML += `<span class="indicator-dot ${activeClass}" onclick="setHeroSlide(${idx})"></span>`;
  });

  dotsHTML = `<div class="hero-indicators">${dotsHTML}</div>`;
  container.innerHTML = slidesHTML + dotsHTML;

  // Start auto timer rotation
  clearInterval(heroInterval);
  heroInterval = setInterval(nextHeroSlide, 6000);
}

function nextHeroSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;
  heroIndex = (heroIndex + 1) % slides.length;
  updateHeroSlides();
}

function setHeroSlide(idx) {
  heroIndex = idx;
  updateHeroSlides();
  clearInterval(heroInterval);
  heroInterval = setInterval(nextHeroSlide, 6000);
}

function updateHeroSlides() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.indicator-dot');

  slides.forEach((slide, idx) => {
    if (idx === heroIndex) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  dots.forEach((dot, idx) => {
    if (idx === heroIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// 4. View specific catalogs

// Full Movies Grid
function renderMoviesCatalog() {
  const container = document.getElementById('movies-grid-container');
  if (!container) return;

  const movies = getFullCatalog().filter(item => item.type === 'movie');
  if (movies.length === 0) {
    container.innerHTML = `<div class="no-results-msg">No movies cataloged yet.</div>`;
    return;
  }

  container.innerHTML = movies.map(item => renderMovieCard(item)).join('');
  attachGridListeners(container, movies);
}

// Full Web Series Grid
function renderSeriesCatalog() {
  const container = document.getElementById('series-grid-container');
  if (!container) return;

  const series = getFullCatalog().filter(item => item.type === 'series');
  if (series.length === 0) {
    container.innerHTML = `<div class="no-results-msg">No series cataloged yet.</div>`;
    return;
  }

  container.innerHTML = series.map(item => renderMovieCard(item)).join('');
  attachGridListeners(container, series);
}

// Watchlist Grid
function renderWatchlistCatalog() {
  const container = document.getElementById('mylist-grid-container');
  if (!container) return;

  const list = getFullCatalog().filter(item => state.watchlist.includes(item.id));
  if (list.length === 0) {
    container.innerHTML = `<div class="no-results-msg">Your watchlist is empty. Add titles while browsing!</div>`;
    return;
  }

  container.innerHTML = list.map(item => renderMovieCard(item)).join('');
  attachGridListeners(container, list);
}

// Category Filter Grid
function renderCategoryFilteredCatalog(genre) {
  const titleEl = document.getElementById('category-view-title');
  const container = document.getElementById('category-grid-container');
  if (!container) return;

  titleEl.textContent = `${genre} Collection`;

  const list = getFullCatalog().filter(item => item.genres.includes(genre));
  if (list.length === 0) {
    container.innerHTML = `<div class="no-results-msg">No titles registered in this category yet.</div>`;
    return;
  }

  container.innerHTML = list.map(item => renderMovieCard(item)).join('');
  attachGridListeners(container, list);
}

function attachGridListeners(container, list) {
  list.forEach(item => {
    const cardEl = container.querySelector(`[data-id="${item.id}"]`);
    if (cardEl) {
      cardEl.addEventListener('click', () => openDetailsModal(item.id));
    }
  });
}

// 5. Watchlist State Toggle
window.toggleWatchlist = function(id) {
  const index = state.watchlist.indexOf(id);
  if (index === -1) {
    state.watchlist.push(id);
    showToast("Added to Watchlist");
  } else {
    state.watchlist.splice(index, 1);
    showToast("Removed from Watchlist");
  }
  saveState();
  renderAllViewCatalogs();
};

function renderAllViewCatalogs() {
  // Re-render home page lists
  renderCarousel('row-trending', m => m.trending, 'Trending Now');
  renderCarousel('row-latest', m => m.isLatest, 'Latest Releases');
  renderCarousel('row-popular', m => m.popular, 'Popular Movies');
  renderCarousel('row-toprated', m => m.topRated, 'Top Rated Movies');
  renderCarousel('row-recommended', m => m.recommended, 'Recommended For You');
  renderCarousel('row-continue-watching', m => state.watchHistory.some(h => h.id === m.id), 'Continue Watching');

  // Re-render sub catalogs if active
  const { route, params } = getRouteParams();
  if (route === '#movies') renderMoviesCatalog();
  if (route === '#series') renderSeriesCatalog();
  if (route === '#my-list') renderWatchlistCatalog();
  if (route === '#categories') renderCategoryFilteredCatalog(params.genre || '');
  if (route === '#dashboard') renderDashboardData();
}

// 6. Toast notifications
function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.right = '30px';
  toast.style.background = 'var(--primary)';
  toast.style.color = '#fff';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
  toast.style.zIndex = '9999';
  toast.style.fontSize = '0.9rem';
  toast.style.fontWeight = '600';
  toast.style.animation = 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  toast.innerText = msg;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// 7. Dialog Modals

// Details Modal
function openDetailsModal(id) {
  const item = getFullCatalog().find(m => m.id === id);
  if (!item) return;

  const modal = document.getElementById('details-modal');
  document.getElementById('details-modal-banner').style.backgroundImage = `url('${item.banner}')`;
  document.getElementById('details-title').textContent = item.title;
  document.getElementById('details-tagline').textContent = item.tagline || `${item.type === 'movie' ? 'Movie' : 'Web Series'} | HD streaming feed`;
  document.getElementById('details-rating').innerHTML = `★ ${item.rating}`;
  document.getElementById('details-year').textContent = item.year;
  document.getElementById('details-duration').textContent = item.duration;
  document.getElementById('details-description').textContent = item.description;
  document.getElementById('details-cast').textContent = item.cast ? item.cast.join(', ') : 'TBD';
  document.getElementById('details-genres').textContent = item.genres.join(', ');
  document.getElementById('details-lang').textContent = item.language || 'Multi-language';
  document.getElementById('details-country').textContent = item.country || 'India';

  const playBtn = document.getElementById('details-play-btn');
  playBtn.onclick = () => {
    closeDetailsModal();
    playVideo(item.id);
  };

  const watchlistBtn = document.getElementById('details-watchlist-btn');
  const updateWatchlistBtnLabel = () => {
    watchlistBtn.innerHTML = state.watchlist.includes(item.id) 
      ? `✕ Remove Watchlist` 
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add Watchlist`;
  };
  updateWatchlistBtnLabel();

  watchlistBtn.onclick = () => {
    toggleWatchlist(item.id);
    updateWatchlistBtnLabel();
  };

  modal.classList.add('show');
}

function closeDetailsModal() {
  document.getElementById('details-modal').classList.remove('show');
}

// Authentication Modal
function openAuthModal(defaultTab = 'signin') {
  const modal = document.getElementById('auth-modal');
  document.getElementById('auth-signin-form').reset();
  document.getElementById('auth-signup-form').reset();
  document.getElementById('auth-forgot-form').reset();
  document.getElementById('auth-otp-form').reset();

  showAuthFormPanel(defaultTab);
  modal.classList.add('show');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('show');
}

function showAuthFormPanel(panelId) {
  document.querySelectorAll('.auth-form-wrapper').forEach(p => p.classList.remove('active'));
  document.getElementById('auth-tabs-row').style.display = 'grid';
  document.getElementById('auth-social-row').style.display = 'block';

  document.getElementById('auth-tab-signin-trigger').classList.remove('active');
  document.getElementById('auth-tab-signup-trigger').classList.remove('active');

  if (panelId === 'signin') {
    document.getElementById('form-signin-wrapper').classList.add('active');
    document.getElementById('auth-tab-signin-trigger').classList.add('active');
  } else if (panelId === 'signup') {
    document.getElementById('form-signup-wrapper').classList.add('active');
    document.getElementById('auth-tab-signup-trigger').classList.add('active');
  } else if (panelId === 'forgot') {
    document.getElementById('form-forgot-wrapper').classList.add('active');
    document.getElementById('auth-tabs-row').style.display = 'none';
    document.getElementById('auth-social-row').style.display = 'none';
  } else if (panelId === 'otp') {
    document.getElementById('form-otp-wrapper').classList.add('active');
    document.getElementById('auth-tabs-row').style.display = 'none';
    document.getElementById('auth-social-row').style.display = 'none';
  }
}

// Plan Checkout Modal
let pendingCheckoutPlan = null;
function initiatePlanCheckout(planId) {
  if (!state.currentUser) {
    openAuthModal('signin');
    showToast("Please sign in to complete subscription payment.");
    return;
  }

  pendingCheckoutPlan = window.subscriptionPlans.find(p => p.id === planId);
  if (!pendingCheckoutPlan) return;

  const modal = document.getElementById('checkout-modal');
  document.getElementById('checkout-summary-name').textContent = pendingCheckoutPlan.name;
  
  const price = pendingCheckoutPlan.price;
  const period = ` / ${pendingCheckoutPlan.validity}`;
  
  document.getElementById('checkout-summary-price').textContent = `₹${price}${period}`;
  
  document.getElementById('checkout-processing-overlay').style.display = 'none';
  document.getElementById('pay-form-card').style.display = 'flex';
  document.getElementById('pay-form-upi').style.display = 'none';
  
  document.getElementById('pay-method-card').classList.add('active');
  document.getElementById('pay-method-upi').classList.remove('active');

  modal.classList.add('show');
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').classList.remove('show');
}

// 8. Custom Video Player Engine with Canvas Fallback Visualizer
let subtitleTimer = null;
let canvasAnimationId = null;
let metadataTimeout = null;

window.playVideo = function(id) {
  const item = getFullCatalog().find(m => m.id === id);
  if (!item) return;

  state.activePlayback = id;
  const view = document.getElementById('player-view');
  const video = document.getElementById('main-video-player');
  const canvas = document.getElementById('player-canvas-fallback');
  const title = document.getElementById('player-video-title');
  const subOverlay = document.getElementById('player-subtitle-overlay');

  title.textContent = item.title;
  
  // Hide canvas on load start, show video
  canvas.style.display = 'none';
  video.style.display = 'block';
  cancelAnimationFrame(canvasAnimationId);

  // Set subtitles off initially
  subOverlay.style.display = 'none';
  document.querySelectorAll('#player-menu-subtitles .player-menu-option').forEach(opt => {
    opt.classList.remove('active');
    if (opt.dataset.sub === 'off') opt.classList.add('active');
  });

  video.src = item.videoUrl;
  video.load();

  const historyItem = state.watchHistory.find(h => h.id === id);

  video.onloadedmetadata = () => {
    clearTimeout(metadataTimeout);
    if (historyItem && historyItem.progress < 95) {
      const seekTime = (historyItem.progress / 100) * video.duration;
      video.currentTime = seekTime;
    }
    video.play().catch(e => {
      console.log("Autoplay block", e);
      if (e.name === 'NotAllowedError') {
        showPlayerPlayOverlay(item.title);
      } else {
        triggerCanvasPlaybackFallback(item.title);
      }
    });
    updatePlayerTimeDisplay();
  };

  // Video error handler triggers canvas loop
  video.onerror = () => {
    clearTimeout(metadataTimeout);
    triggerCanvasPlaybackFallback(item.title);
  };

  // Timeout boundary - if metadata fails in 2.5s, run visualizer
  clearTimeout(metadataTimeout);
  metadataTimeout = setTimeout(() => {
    if (video.readyState < 1 && !state.activePlayback.startsWith('c')) {
      triggerCanvasPlaybackFallback(item.title);
    }
  }, 2500);

  view.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  clearInterval(window.playbackLogInterval);
  window.playbackLogInterval = setInterval(logPlaybackProgress, 4000);

  clearInterval(subtitleTimer);
  subtitleTimer = setInterval(trackSubtitles, 500);
};

function showPlayerPlayOverlay(title) {
  let playOverlay = document.getElementById('player-autoplay-block-overlay');
  if (!playOverlay) {
    playOverlay = document.createElement('div');
    playOverlay.id = 'player-autoplay-block-overlay';
    playOverlay.className = 'player-autoplay-block-overlay';
    playOverlay.innerHTML = `
      <div class="autoplay-block-content" style="text-align:center;">
        <button class="autoplay-block-play-btn" id="autoplay-block-play-btn" style="background:var(--primary); color:white; width:80px; height:80px; border-radius:50%; font-size:2.2rem; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; transition:transform 0.2s; box-shadow: 0 4px 20px rgba(229, 9, 20, 0.4);">▶</button>
        <p class="autoplay-block-text" style="font-size:1.1rem; font-weight:600; color:white; text-shadow:0 2px 4px rgba(0,0,0,0.8);">Click to Play "${title}"</p>
      </div>
    `;
    document.getElementById('video-player-container').appendChild(playOverlay);
    document.getElementById('autoplay-block-play-btn').addEventListener('click', () => {
      playOverlay.remove();
      const video = document.getElementById('main-video-player');
      video.play().catch(err => console.log(err));
    });
  }
}

// Canvas Render Fallback Loop (Simulated Playback & Audio wave)
function triggerCanvasPlaybackFallback(movieTitle) {
  const video = document.getElementById('main-video-player');
  const canvas = document.getElementById('player-canvas-fallback');
  if (!canvas) return;

  video.style.display = 'none';
  canvas.style.display = 'block';

  // Force duration metadata mock in HTML controls
  const totalText = document.getElementById('player-time-total');
  if (totalText && totalText.textContent === '0:00') {
    totalText.textContent = getFullCatalog().find(m => m.id === state.activePlayback)?.duration || '15:00';
  }

  const ctx = canvas.getContext('2d');
  
  const resizeCanvas = () => {
    canvas.width = canvas.parentElement.clientWidth || 1280;
    canvas.height = canvas.parentElement.clientHeight || 720;
  };
  resizeCanvas();
  
  let waveOffset = 0;
  let particles = [];
  
  // Sparkle stars particles setup
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.5 + 0.3
    });
  }

  cancelAnimationFrame(canvasAnimationId);

  // Simulated ticks logic - when playing, ticks video element time manually
  let lastTime = performance.now();
  
  const draw = (now) => {
    if (canvas.style.display === 'none') return;

    // Time ticker mapping
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    if (!video.paused && video.currentTime < video.duration) {
      video.currentTime += delta * video.playbackRate;
      updatePlayerTimeDisplay();
    }

    // Render radial backdrop
    const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 20, canvas.width/2, canvas.height/2, canvas.width/1.1);
    grad.addColorStop(0, '#1c0505');
    grad.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Drifting particles
    ctx.fillStyle = '#ffffff';
    particles.forEach(p => {
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      if (!video.paused) {
        p.x -= p.speed * video.playbackRate * 1.5;
        if (p.x < 0) p.x = canvas.width;
      }
    });
    ctx.globalAlpha = 1.0;

    // Frequency sine wave (volume changes height, speed changes frequency)
    const waveHeight = video.paused ? 3 : (video.volume * 28 + 6);
    const waveFreq = video.paused ? 0.004 : (0.009 * video.playbackRate);
    
    ctx.strokeStyle = 'rgba(229, 9, 20, 0.65)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * waveFreq + waveOffset) * waveHeight * Math.sin(x / canvas.width * Math.PI);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Secondary sync wave
    ctx.strokeStyle = 'rgba(0, 198, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.cos(x * (waveFreq * 0.85) - waveOffset) * (waveHeight * 0.6) * Math.sin(x / canvas.width * Math.PI);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (!video.paused) waveOffset += 0.06 * video.playbackRate;

    // Center UI elements
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 1.8rem 'Outfit', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(movieTitle.toUpperCase(), canvas.width / 2, canvas.height / 2 - 45);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = "bold 0.8rem 'Inter', sans-serif";
    ctx.fillText("[ OFFLINE DYNAMIC ENCRYPTED FEED ACTIVE ]", canvas.width / 2, canvas.height / 2 - 15);

    // Dynamic dot status
    ctx.fillStyle = video.paused ? '#e50914' : '#28a745';
    ctx.beginPath();
    ctx.arc(canvas.width / 2 - 95, canvas.height / 2 + 50, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#aaaaaa';
    ctx.font = "600 0.85rem 'Inter', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillText(video.paused ? "SIMULATOR PAUSED" : `STREAMING FEED (${video.playbackRate}x speed) - Audio: ${video.volume > 0 ? 'Surround' : 'Muted'}`, canvas.width / 2 - 80, canvas.height / 2 + 54);

    canvasAnimationId = requestAnimationFrame(draw);
  };

  canvasAnimationId = requestAnimationFrame(draw);
}

window.playLiveChannel = function(id) {
  const channel = window.liveChannels.find(c => c.id === id);
  if (!channel) return;

  state.activePlayback = id;
  const view = document.getElementById('player-view');
  const video = document.getElementById('main-video-player');
  const canvas = document.getElementById('player-canvas-fallback');
  const title = document.getElementById('player-video-title');
  
  title.textContent = `LIVE: ${channel.name} (${channel.program})`;
  
  canvas.style.display = 'none';
  video.style.display = 'block';
  cancelAnimationFrame(canvasAnimationId);

  video.src = channel.videoUrl;
  video.load();
  video.play().catch(e => {
    console.log("Live block", e);
    triggerCanvasPlaybackFallback(channel.name);
  });
  
  video.onerror = () => {
    triggerCanvasPlaybackFallback(channel.name);
  };

  view.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

function exitPlayer() {
  clearTimeout(metadataTimeout);
  clearInterval(window.playbackLogInterval);
  clearInterval(subtitleTimer);
  cancelAnimationFrame(canvasAnimationId);
  cancelNextEpisodeAutoplay();
  
  const blockOverlay = document.getElementById('player-autoplay-block-overlay');
  if (blockOverlay) blockOverlay.remove();
  
  const video = document.getElementById('main-video-player');
  video.pause();
  video.src = '';
  
  document.getElementById('player-canvas-fallback').style.display = 'none';
  document.getElementById('player-view').classList.add('hidden');
  document.body.style.overflow = 'auto';

  renderAllViewCatalogs();
}

function logPlaybackProgress() {
  const video = document.getElementById('main-video-player');
  if (!video || !state.activePlayback) return;
  if (state.activePlayback.startsWith('c')) return;

  const duration = video.duration || 900; // fallback 15 mins
  const progressPercent = Math.min(100, Math.floor((video.currentTime / duration) * 100));
  
  const historyIndex = state.watchHistory.findIndex(h => h.id === state.activePlayback);
  if (historyIndex > -1) {
    state.watchHistory[historyIndex].progress = progressPercent;
  } else {
    state.watchHistory.unshift({
      id: state.activePlayback,
      progress: progressPercent,
      durationText: getFullCatalog().find(m => m.id === state.activePlayback)?.duration || '0m'
    });
  }

  if (state.watchHistory.length > 8) state.watchHistory.pop();
  saveState();
}

// Subtitles renderer
function trackSubtitles() {
  const video = document.getElementById('main-video-player');
  const subOverlay = document.getElementById('player-subtitle-overlay');
  if (!video || !state.activePlayback) return;

  const activeSubOpt = document.querySelector('#player-menu-subtitles .player-menu-option.active');
  const subLang = activeSubOpt ? activeSubOpt.dataset.sub : 'off';

  if (subLang === 'off') {
    subOverlay.style.display = 'none';
    return;
  }

  const catalogItemSubs = SUBTITLE_TRACKS[state.activePlayback];
  if (!catalogItemSubs || !catalogItemSubs[subLang]) {
    subOverlay.style.display = 'none';
    return;
  }

  const currTime = video.currentTime;
  const subsList = catalogItemSubs[subLang];
  const matchedSub = subsList.find(sub => currTime >= sub.time && currTime < sub.time + 3);
  
  if (matchedSub) {
    subOverlay.textContent = matchedSub.text;
    subOverlay.style.display = 'block';
  } else {
    subOverlay.style.display = 'none';
  }
}

// Time Displays
function updatePlayerTimeDisplay() {
  const video = document.getElementById('main-video-player');
  const currentText = document.getElementById('player-time-current');
  const totalText = document.getElementById('player-time-total');
  const scrubber = document.getElementById('player-progress-filled');

  if (!video || !currentText || !totalText || !scrubber) return;

  const duration = video.duration || 900;

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  currentText.textContent = formatTime(video.currentTime);
  totalText.textContent = formatTime(duration);
  
  const filledPercent = Math.min(100, (video.currentTime / duration) * 100);
  scrubber.style.width = `${filledPercent}%`;

  if (video.currentTime > 0 && (duration - video.currentTime < 8) && !state.activePlayback.startsWith('c')) {
    triggerNextEpisodeAutoplay();
  }
}

// Next autoplay episode
let autoplayCountdown = null;
let autoplaySeconds = 5;

function triggerNextEpisodeAutoplay() {
  const nextCard = document.getElementById('next-episode-card');
  const nextBtn = document.getElementById('next-autoplay-timer-btn');
  if (!nextCard || nextCard.style.display === 'block') return;

  const currentItemIndex = getFullCatalog().findIndex(m => m.id === state.activePlayback);
  const nextItem = getFullCatalog()[currentItemIndex + 1];
  
  if (!nextItem || nextItem.type !== getFullCatalog()[currentItemIndex].type) return;

  document.getElementById('next-episode-name').textContent = nextItem.title;
  nextCard.style.display = 'block';

  autoplaySeconds = 5;
  nextBtn.textContent = `Play in ${autoplaySeconds}s`;

  clearInterval(autoplayCountdown);
  autoplayCountdown = setInterval(() => {
    autoplaySeconds--;
    if (autoplaySeconds <= 0) {
      clearInterval(autoplayCountdown);
      nextCard.style.display = 'none';
      playVideo(nextItem.id);
    } else {
      nextBtn.textContent = `Play in ${autoplaySeconds}s`;
    }
  }, 1000);
}

function cancelNextEpisodeAutoplay() {
  clearInterval(autoplayCountdown);
  document.getElementById('next-episode-card').style.display = 'none';
}

// 9. Dashboard Panels
function renderDashboardData() {
  if (!state.currentUser) return;

  document.getElementById('dashboard-user-name').textContent = state.currentUser.name;
  document.getElementById('dashboard-user-plan').textContent = state.currentUser.plan;

  const avatarSrc = state.currentUser.avatar || DEFAULT_USER.avatar;
  document.getElementById('dashboard-avatar-preview').src = avatarSrc;

  document.getElementById('db-profile-email').value = state.currentUser.email;
  document.getElementById('db-profile-since').value = state.currentUser.since;
  
  const statusBadge = document.getElementById('db-profile-active-status');
  if (state.currentUser.plan === 'None') {
    statusBadge.textContent = "Unpaid (Subscription required)";
    statusBadge.style.color = "#ffc107";
  } else {
    statusBadge.textContent = "Active subscription (Auto-renew enabled)";
    statusBadge.style.color = "#28a745";
  }

  document.getElementById('settings-fullname').value = state.currentUser.name;
  document.getElementById('settings-avatar-select').value = avatarSrc;

  // Watchlist Grid
  const watchlistGrid = document.getElementById('db-watchlist-grid');
  const watchlistItems = getFullCatalog().filter(m => state.watchlist.includes(m.id));
  if (watchlistItems.length === 0) {
    watchlistGrid.innerHTML = `<div class="no-results-msg" style="grid-column: 1/-1;">Watchlist is empty.</div>`;
  } else {
    watchlistGrid.innerHTML = watchlistItems.map(item => `
      <div style="position:relative;">
        ${renderMovieCard(item)}
        <button class="btn btn-secondary" onclick="toggleWatchlist('${item.id}')" style="position:absolute; bottom:15px; left:15px; font-size:0.75rem; padding: 4px 8px; z-index:11;">Remove</button>
      </div>
    `).join('');
    attachGridListeners(watchlistGrid, watchlistItems);
  }

  // History Grid
  const historyGrid = document.getElementById('db-history-grid');
  const historyIds = state.watchHistory.map(h => h.id);
  const historyItems = getFullCatalog().filter(m => historyIds.includes(m.id));
  if (historyItems.length === 0) {
    historyGrid.innerHTML = `<div class="no-results-msg" style="grid-column: 1/-1;">No watch history.</div>`;
  } else {
    historyGrid.innerHTML = historyItems.map(item => renderMovieCard(item)).join('');
    attachGridListeners(historyGrid, historyItems);
  }

  // Billing Details
  document.getElementById('db-billing-plan-title').textContent = `${state.currentUser.plan}`;
  
  const activePlan = window.subscriptionPlans.find(p => p.name === state.currentUser.plan);
  const planPriceText = activePlan ? `₹${activePlan.price} / ${activePlan.validity}` : '₹0.00';
  document.getElementById('db-billing-plan-price').textContent = planPriceText;
  
  document.getElementById('db-billing-autorenew-btn').textContent = state.currentUser.autoRenew ? 'Enabled (Cancel)' : 'Disabled (Enable)';
  document.getElementById('db-billing-autorenew-btn').style.background = state.currentUser.autoRenew ? 'var(--primary)' : 'rgba(255,255,255,0.1)';

  const invoicesTbody = document.getElementById('db-billing-invoices-tbody');
  if (state.billingInvoices.length === 0) {
    invoicesTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">No billing records.</td></tr>`;
  } else {
    invoicesTbody.innerHTML = state.billingInvoices.map(inv => `
      <tr>
        <td>${inv.id}</td>
        <td>${inv.date}</td>
        <td>${inv.plan}</td>
        <td>${inv.amount}</td>
        <td><span class="invoice-status-paid">${inv.status}</span></td>
      </tr>
    `).join('');
  }
}

// 10. Admin Control Functions
function renderAdminDashboard() {
  document.getElementById('admin-metric-movies').textContent = getFullCatalog().length;
  
  const catalogTbody = document.getElementById('admin-catalog-tbody');
  catalogTbody.innerHTML = getFullCatalog().map(item => `
    <tr>
      <td><strong>${item.title}</strong></td>
      <td>${item.type.toUpperCase()}</td>
      <td>${item.year}</td>
      <td>★ ${item.rating}</td>
      <td>${item.duration}</td>
      <td>
        <div class="admin-table-actions">
          <button class="admin-action-btn edit" onclick="editVideoDetails('${item.id}')">Edit</button>
          <button class="admin-action-btn delete" onclick="deleteVideoItem('${item.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  const mockUsers = [
    { name: "Aarav Mehta", email: "aarav.mehta@gmail.com", plan: "Premium Plan", status: "Active" },
    { name: "Priya Sharma", email: "priya.sharma@yahoo.com", plan: "Standard Plan", status: "Active" },
    { name: "Vikram Malhotra", email: "vikram@outlook.com", plan: "Basic Plan", status: "Active" },
    { name: "Celia V", email: "celia@tears.com", plan: "None", status: "Active" }
  ];
  if (state.currentUser) {
    mockUsers.unshift({ name: state.currentUser.name, email: state.currentUser.email, plan: state.currentUser.plan, status: "Active" });
  }

  const usersTbody = document.getElementById('admin-users-tbody');
  usersTbody.innerHTML = mockUsers.map((u, i) => `
    <tr>
      <td><strong>${u.name}</strong></td>
      <td>${u.email}</td>
      <td><span style="color:var(--primary); font-weight:700;">${u.plan.toUpperCase()}</span></td>
      <td><span style="color:#28a745; font-weight:700;">${u.status}</span></td>
      <td>
        <div class="admin-table-actions">
          <button class="admin-action-btn edit" onclick="showToast('User status toggled')" style="border-color:#ffc107; color:white;">Suspend</button>
          <button class="admin-action-btn delete" onclick="showToast('User tier upgraded')">Upgrade</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.deleteVideoItem = function(id) {
  if (confirm("Delete this video from the catalog?")) {
    const isCustom = state.customMovies.some(m => m.id === id);
    if (isCustom) {
      state.customMovies = state.customMovies.filter(m => m.id !== id);
    } else {
      if (!state.deletedDefaultMovies.includes(id)) {
        state.deletedDefaultMovies.push(id);
        localStorage.setItem('khazana_deleted_movies', JSON.stringify(state.deletedDefaultMovies));
      }
    }
    saveState();
    renderAdminDashboard();
    renderAllViewCatalogs();
    showToast("Video deleted.");
  }
};

window.editVideoDetails = function(id) {
  const item = getFullCatalog().find(m => m.id === id);
  if (!item) return;

  state.editingVideoId = id;

  document.getElementById('admin-video-title').value = item.title;
  document.getElementById('admin-video-type').value = item.type;
  document.getElementById('admin-video-genres').value = item.genres.join(', ');
  document.getElementById('admin-video-year').value = item.year;
  document.getElementById('admin-video-lang').value = item.language || 'English';
  document.getElementById('admin-video-country').value = item.country || 'USA';
  document.getElementById('admin-video-duration').value = item.duration;
  document.getElementById('admin-video-rating').value = item.rating;
  document.getElementById('admin-video-desc').value = item.description;
  document.getElementById('admin-video-banner').value = item.banner;
  document.getElementById('admin-video-url').value = item.videoUrl;

  document.getElementById('admin-tbtn-add').click();
  showToast("Details loaded. Update below.");
};

// 11. Initializers & DOM Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  
  if (state.theme === 'light') {
    document.body.className = 'theme-light';
    document.getElementById('theme-icon-sun').style.display = 'block';
    document.getElementById('theme-icon-moon').style.display = 'none';
  } else {
    document.body.className = 'theme-dark';
  }

  // Load render calls
  renderHeroSlider();
  renderAllViewCatalogs();
  renderCategoriesGrid();
  renderLiveTVGrid();
  renderPricingPlans();
  renderTestimonials();
  renderFAQs();

  // Route initialization
  window.addEventListener('hashchange', router);
  initFooterNavigation();
  router();

  // Scroll solid navbar styling
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('app-navbar');
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // Theme Toggler
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');

    if (isDark) {
      document.body.className = 'theme-light';
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
      state.theme = 'light';
    } else {
      document.body.className = 'theme-dark';
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
      state.theme = 'dark';
    }
    localStorage.setItem('khazana_theme', state.theme);
    showToast(`Switched to ${state.theme} mode.`);
  });

  // Mobile Drawer
  const burger = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');

  burger.addEventListener('click', () => {
    drawer.classList.add('open');
    backdrop.classList.add('show');
  });

  backdrop.addEventListener('click', () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
  });

  // Profile Dropdown
  const navProfileBtn = document.getElementById('nav-profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown-menu');

  if (navProfileBtn && profileDropdown) {
    navProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      profileDropdown.classList.remove('show');
    });
  }

  // Search input expands in Header
  const searchTrigger = document.getElementById('nav-search-trigger');
  const searchInput = document.getElementById('nav-search-input');

  searchTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    searchInput.classList.toggle('expanded');
    if (searchInput.classList.contains('expanded')) searchInput.focus();
  });

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value;
    const mainSearchInput = document.getElementById('search-input-main');
    if (mainSearchInput) {
      mainSearchInput.value = q;
      mainSearchInput.dispatchEvent(new Event('input'));
    }
    if (window.location.hash !== '#home') window.location.hash = '#home';
  });

  // Main Search suggestions updates
  const mainSearch = document.getElementById('search-input-main');
  const mainSuggestions = document.getElementById('search-suggestions-main');

  mainSearch.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    state.searchQuery = q;
    
    if (q.length === 0) {
      mainSuggestions.classList.remove('show');
      mainSuggestions.innerHTML = '';
      renderAllViewCatalogs();
      return;
    }

    const filtered = getFullCatalog().filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.genres.some(g => g.toLowerCase().includes(q)) ||
      (item.cast && item.cast.some(c => c.toLowerCase().includes(q)))
    );

    if (filtered.length === 0) {
      mainSuggestions.innerHTML = `<div style="padding:15px; text-align:center; color:var(--text-secondary);">No matches.</div>`;
    } else {
      mainSuggestions.innerHTML = filtered.slice(0, 5).map(item => `
        <div class="suggestion-item" data-id="${item.id}">
          <img src="${item.thumbnail}" alt="${item.title}">
          <div class="suggestion-info">
            <span class="suggestion-title">${item.title}</span>
            <span class="suggestion-meta">${item.type.toUpperCase()} • ${item.year} • ★ ${item.rating}</span>
          </div>
        </div>
      `).join('');
      
      filtered.slice(0, 5).forEach(item => {
        mainSuggestions.querySelector(`[data-id="${item.id}"]`).addEventListener('click', () => {
          mainSuggestions.classList.remove('show');
          openDetailsModal(item.id);
        });
      });
    }
    
    mainSuggestions.classList.add('show');

    const filterFn = (m) => m.title.toLowerCase().includes(q) || m.genres.some(g => g.toLowerCase().includes(q)) || (m.cast && m.cast.some(c => c.toLowerCase().includes(q)));
    renderCarousel('row-trending', m => m.trending && filterFn(m), 'Trending Matches');
    renderCarousel('row-latest', m => m.isLatest && filterFn(m), 'Latest Matches');
    renderCarousel('row-popular', m => m.popular && filterFn(m), 'Popular Matches');
    renderCarousel('row-toprated', m => m.topRated && filterFn(m), 'Top Rated Matches');
    renderCarousel('row-recommended', m => m.recommended && filterFn(m), 'Recommended Matches');
    renderCarousel('row-continue-watching', m => state.watchHistory.some(h => h.id === m.id) && filterFn(m), 'Continue Watching Matches');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar-row')) mainSuggestions.classList.remove('show');
  });

  // Filters inputs
  const filterElements = ['filter-genre', 'filter-language', 'filter-year', 'filter-rating', 'filter-country'];
  filterElements.forEach(fId => {
    document.getElementById(fId).addEventListener('change', (e) => {
      const field = fId.replace('filter-', '');
      state.activeFilters[field] = e.target.value;
      
      const filterFn = (m) => {
        if (state.activeFilters.genre && !m.genres.includes(state.activeFilters.genre)) return false;
        if (state.activeFilters.language && m.language !== state.activeFilters.language) return false;
        if (state.activeFilters.year && m.year.toString() !== state.activeFilters.year) return false;
        if (state.activeFilters.rating && parseFloat(m.rating) < parseFloat(state.activeFilters.rating)) return false;
        if (state.activeFilters.country && m.country !== state.activeFilters.country) return false;
        return true;
      };

      renderCarousel('row-trending', m => m.trending && filterFn(m), 'Trending Now');
      renderCarousel('row-latest', m => m.isLatest && filterFn(m), 'Latest Releases');
      renderCarousel('row-popular', m => m.popular && filterFn(m), 'Popular Movies');
      renderCarousel('row-toprated', m => m.topRated && filterFn(m), 'Top Rated Movies');
      renderCarousel('row-recommended', m => m.recommended && filterFn(m), 'Recommended For You');
    });
  });

  // Monthly vs Yearly Pricing Toggles
  const billingToggleMonthly = document.getElementById('billing-toggle-monthly');
  const billingToggleYearly = document.getElementById('billing-toggle-yearly');
  if (billingToggleMonthly && billingToggleYearly) {
    billingToggleMonthly.addEventListener('click', () => {
      billingToggleMonthly.classList.add('active');
      billingToggleYearly.classList.remove('active');
      state.isYearlyBilling = false;
      renderPricingPlans();
    });

    billingToggleYearly.addEventListener('click', () => {
      billingToggleMonthly.classList.remove('active');
      billingToggleYearly.classList.add('active');
      state.isYearlyBilling = true;
      renderPricingPlans();
    });
  }

  // Pricing Selection Monthly/Yearly triggers
  const plansSelToggleMonthly = document.getElementById('plans-sel-toggle-monthly');
  const plansSelToggleYearly = document.getElementById('plans-sel-toggle-yearly');
  if (plansSelToggleMonthly && plansSelToggleYearly) {
    plansSelToggleMonthly.addEventListener('click', () => {
      plansSelToggleMonthly.classList.add('active');
      plansSelToggleYearly.classList.remove('active');
      state.isYearlyBilling = false;
      renderPlansSelectionView();
    });

    plansSelToggleYearly.addEventListener('click', () => {
      plansSelToggleMonthly.classList.remove('active');
      plansSelToggleYearly.classList.add('active');
      state.isYearlyBilling = true;
      renderPlansSelectionView();
    });
  }

  // Landing Form: Pre-fill Email and Open Signup
  const landingForm = document.getElementById('landing-email-form');
  if (landingForm) {
    landingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('landing-email-input').value;
      openAuthModal('signup');
      document.getElementById('signup-email').value = email;
    });
  }

  // Auth Toggles
  document.getElementById('auth-tab-signin-trigger').addEventListener('click', () => showAuthFormPanel('signin'));
  document.getElementById('auth-tab-signup-trigger').addEventListener('click', () => showAuthFormPanel('signup'));
  document.getElementById('auth-btn-forgot-password').addEventListener('click', () => showAuthFormPanel('forgot'));

  document.getElementById('auth-modal-close').addEventListener('click', closeAuthModal);
  document.getElementById('details-modal-close').addEventListener('click', closeDetailsModal);
  document.getElementById('checkout-modal-close').addEventListener('click', closeCheckoutModal);

  const navSignInBtn = document.getElementById('nav-signin-btn');
  if (navSignInBtn) {
    navSignInBtn.addEventListener('click', () => openAuthModal('signin'));
  }
  const navSignUpBtn = document.getElementById('nav-signup-btn');
  if (navSignUpBtn) {
    navSignUpBtn.addEventListener('click', () => openAuthModal('signup'));
  }

  // Sign In submit
  document.getElementById('auth-signin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    
    let account = { ...DEFAULT_USER, email: email, name: email.split('@')[0], plan: "None" };
    if (email === "admin@khazanaking.com") {
      account.name = "System Administrator";
      account.plan = "Premium Plan";
    }

    state.currentUser = account;
    saveState();
    
    closeAuthModal();
    showToast(`Logged in successfully!`);
    
    // Refresh page router state
    router();
  });

  // Sign Up Submit
  document.getElementById('auth-signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    document.getElementById('otp-instruction-text').textContent = `Verification OTP sent to: ${email}. Enter code below:`;
    showAuthFormPanel('otp');
  });

  // OTP Submit
  document.getElementById('auth-otp-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    
    const account = {
      name: name,
      email: email,
      plan: "None", // starts with None plan
      since: "14 Jun 2026",
      avatar: DEFAULT_USER.avatar,
      autoRenew: true
    };

    state.currentUser = account;
    saveState();
    
    closeAuthModal();
    showToast(`Registration complete. Choose a subscription plan!`);
    
    router();
  });

  // Social Login clicks
  const socialTriggers = ['auth-social-google', 'auth-social-facebook'];
  socialTriggers.forEach(sId => {
    document.getElementById(sId).addEventListener('click', () => {
      const platformName = sId.replace('auth-social-', '');
      closeAuthModal();
      
      const account = {
        name: `User_${platformName}`,
        email: `user.${platformName}@khazana.com`,
        plan: "None",
        since: "14 Jun 2026",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
        autoRenew: true
      };
      
      state.currentUser = account;
      saveState();

      showToast(`Welcome! Subscribe to a plan to start watching.`);
      router();
    });
  });

  // Sign Out click
  document.getElementById('dropdown-btn-signout').addEventListener('click', () => {
    state.currentUser = null;
    saveState();
    showToast("Logged out successfully.");
    window.location.hash = '#landing';
  });

  // Checkout submission
  const triggerPaymentSubmit = () => {
    document.getElementById('pay-form-card').style.display = 'none';
    document.getElementById('pay-form-upi').style.display = 'none';
    document.getElementById('checkout-processing-overlay').style.display = 'flex';
    document.getElementById('checkout-status-text').textContent = "Connecting Secure Bank API Gateway...";

    setTimeout(() => {
      document.getElementById('checkout-status-text').textContent = "Completing subscription purchase...";
      setTimeout(() => {
        state.currentUser.plan = pendingCheckoutPlan.name;
        
        const price = pendingCheckoutPlan.price;
        const periodText = pendingCheckoutPlan.validity;
        const newInvoice = {
          id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          date: "14 Jun 2026",
          plan: `${pendingCheckoutPlan.name} (${periodText})`,
          amount: `₹${price}.00`,
          status: "Paid"
        };
        state.billingInvoices.unshift(newInvoice);

        saveState();
        closeCheckoutModal();
        showToast(`Checkout successful! Plan activated: ${pendingCheckoutPlan.name}`);
        
        // Redirect to homepage
        window.location.hash = '#home';
        
      }, 1500);
    }, 1500);
  };

  document.getElementById('checkout-card-form').addEventListener('submit', (e) => {
    e.preventDefault();
    triggerPaymentSubmit();
  });

  document.getElementById('checkout-upi-form').addEventListener('submit', (e) => {
    e.preventDefault();
    triggerPaymentSubmit();
  });

  // Save dashboard settings
  document.getElementById('db-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('settings-fullname').value;
    const avatar = document.getElementById('settings-avatar-select').value;
    
    state.currentUser.name = name;
    state.currentUser.avatar = avatar;
    saveState();
    
    showToast("Profile updated.");
    renderDashboardData();
  });

  // Autorenew toggle
  document.getElementById('db-billing-autorenew-btn').addEventListener('click', () => {
    state.currentUser.autoRenew = !state.currentUser.autoRenew;
    saveState();
    renderDashboardData();
    showToast(`Auto-renewal ${state.currentUser.autoRenew ? 'Enabled' : 'Disabled'}.`);
  });

  // Clear History
  document.getElementById('db-clear-history-btn').addEventListener('click', () => {
    if (confirm("Clear your entire watch history?")) {
      state.watchHistory = [];
      saveState();
      renderDashboardData();
      renderAllViewCatalogs();
      showToast("History cleared.");
    }
  });

  // Sidebar dashboard switcher
  document.querySelectorAll('.dashboard-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      document.querySelectorAll('.dashboard-menu-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      const panelId = item.dataset.panel;
      document.querySelectorAll('.panel-tab-content').forEach(p => p.classList.remove('active'));
      document.getElementById(panelId).classList.add('active');
    });
  });

  // Video Controls
  const video = document.getElementById('main-video-player');
  const playPauseBtn = document.getElementById('player-btn-play');
  const volumeBtn = document.getElementById('player-btn-volume');
  const volumeSlider = document.getElementById('player-volume-slider');
  const scrubberContainer = document.getElementById('player-scrubber-container');
  const backBtn = document.getElementById('player-back-btn');
  const pipBtn = document.getElementById('player-btn-pip');
  const fullScreenBtn = document.getElementById('player-btn-fullscreen');

  const togglePlayState = () => {
    if (video.paused) {
      video.play().catch(e => console.log(e));
      playPauseBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
    } else {
      video.pause();
      playPauseBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    }
  };

  playPauseBtn.addEventListener('click', togglePlayState);
  video.addEventListener('click', togglePlayState);

  video.addEventListener('play', () => {
    playPauseBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
  });

  video.addEventListener('pause', () => {
    playPauseBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
  });

  video.addEventListener('timeupdate', updatePlayerTimeDisplay);

  document.getElementById('player-btn-rewind').addEventListener('click', () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
    updatePlayerTimeDisplay();
  });

  document.getElementById('player-btn-forward').addEventListener('click', () => {
    video.currentTime = Math.min(video.duration || 900, video.currentTime + 10);
    updatePlayerTimeDisplay();
  });

  volumeSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    video.volume = val;
    video.muted = false;
    if (val == 0) {
      volumeBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    } else {
      volumeBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    }
  });

  volumeBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
      volumeSlider.value = 0;
      volumeBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    } else {
      volumeSlider.value = video.volume;
      volumeBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    }
  });

  scrubberContainer.addEventListener('click', (e) => {
    const rect = scrubberContainer.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    const duration = video.duration || 900;
    video.currentTime = clickPos * duration;
    updatePlayerTimeDisplay();
  });

  backBtn.addEventListener('click', exitPlayer);

  pipBtn.addEventListener('click', () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(e => console.log(e));
    } else if (video.requestPictureInPicture) {
      video.requestPictureInPicture().catch(e => console.log(e));
    } else {
      showToast("PiP not supported.");
    }
  });

  fullScreenBtn.addEventListener('click', () => {
    const container = document.getElementById('video-player-container');
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => showToast(`Fullscreen error: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  });

  document.getElementById('player-btn-subtitles').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('player-menu-subtitles').classList.toggle('show');
    document.getElementById('player-menu-speed').classList.remove('show');
    document.getElementById('player-menu-quality').classList.remove('show');
  });

  document.querySelectorAll('#player-menu-subtitles .player-menu-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('#player-menu-subtitles .player-menu-option').forEach(el => el.classList.remove('active'));
      opt.classList.add('active');
      document.getElementById('player-menu-subtitles').classList.remove('show');
      showToast(`Subtitles: ${opt.textContent}`);
      trackSubtitles();
    });
  });

  const speedBtn = document.getElementById('player-btn-speed');
  speedBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('player-menu-speed').classList.toggle('show');
    document.getElementById('player-menu-subtitles').classList.remove('show');
    document.getElementById('player-menu-quality').classList.remove('show');
  });

  document.querySelectorAll('#player-menu-speed .player-menu-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('#player-menu-speed .player-menu-option').forEach(el => el.classList.remove('active'));
      opt.classList.add('active');
      document.getElementById('player-menu-speed').classList.remove('show');
      
      const speedVal = parseFloat(opt.dataset.speed);
      video.playbackRate = speedVal;
      speedBtn.textContent = `${speedVal.toFixed(1)}x`;
      showToast(`Speed: ${opt.textContent}`);
    });
  });

  const qualBtn = document.getElementById('player-btn-quality');
  qualBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('player-menu-quality').classList.toggle('show');
    document.getElementById('player-menu-subtitles').classList.remove('show');
    document.getElementById('player-menu-speed').classList.remove('show');
  });

  document.querySelectorAll('#player-menu-quality .player-menu-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('#player-menu-quality .player-menu-option').forEach(el => el.classList.remove('active'));
      opt.classList.add('active');
      document.getElementById('player-menu-quality').classList.remove('show');
      qualBtn.textContent = opt.dataset.qual;
      showToast(`Quality: ${opt.textContent}`);
    });
  });

  document.addEventListener('click', () => {
    document.getElementById('player-menu-subtitles').classList.remove('show');
    document.getElementById('player-menu-speed').classList.remove('show');
    document.getElementById('player-menu-quality').classList.remove('show');
  });

  document.getElementById('next-autoplay-timer-btn').addEventListener('click', () => {
    const currentItemIndex = getFullCatalog().findIndex(m => m.id === state.activePlayback);
    const nextItem = getFullCatalog()[currentItemIndex + 1];
    cancelNextEpisodeAutoplay();
    if (nextItem) playVideo(nextItem.id);
  });

  document.getElementById('next-autoplay-cancel-btn').addEventListener('click', cancelNextEpisodeAutoplay);

  // Admin tabs navigation
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab-btn').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');

      const tabId = btn.dataset.tab;
      document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      
      if (tabId === 'admin-tab-catalog' || tabId === 'admin-tab-users') renderAdminDashboard();
    });
  });

  document.getElementById('admin-add-video-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('admin-video-title').value;
    const type = document.getElementById('admin-video-type').value;
    const genres = document.getElementById('admin-video-genres').value.split(',').map(g => g.trim());
    const year = parseInt(document.getElementById('admin-video-year').value);
    const lang = document.getElementById('admin-video-lang').value;
    const country = document.getElementById('admin-video-country').value;
    const duration = document.getElementById('admin-video-duration').value;
    const rating = document.getElementById('admin-video-rating').value;
    const desc = document.getElementById('admin-video-desc').value;
    const banner = document.getElementById('admin-video-banner').value || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80";
    const streamUrl = document.getElementById('admin-video-url').value;

    if (state.editingVideoId) {
      const idxCustom = state.customMovies.findIndex(m => m.id === state.editingVideoId);
      const idxDefault = window.movieData.findIndex(m => m.id === state.editingVideoId);
      const updatedVideo = {
        id: state.editingVideoId,
        title: title,
        type: type,
        description: desc,
        rating: rating,
        year: year,
        genres: genres,
        language: lang,
        country: country,
        duration: duration,
        banner: banner,
        thumbnail: banner,
        videoUrl: streamUrl,
        cast: ["Creator Cast"],
        trending: false,
        popular: false,
        topRated: false,
        recommended: false,
        isLatest: true
      };
      if (idxCustom > -1) {
        state.customMovies[idxCustom] = updatedVideo;
      } else if (idxDefault > -1) {
        window.movieData[idxDefault] = updatedVideo;
      }
      state.editingVideoId = null;
      showToast(`Updated: ${title}`);
    } else {
      const newVideo = {
        id: `custom-${Math.floor(1000 + Math.random() * 9000)}`,
        title: title,
        type: type,
        description: desc,
        rating: rating,
        year: year,
        genres: genres,
        language: lang,
        country: country,
        duration: duration,
        banner: banner,
        thumbnail: banner,
        videoUrl: streamUrl,
        cast: ["Creator Cast"],
        trending: false,
        popular: false,
        topRated: false,
        recommended: false,
        isLatest: true
      };
      state.customMovies.unshift(newVideo);
      showToast(`Published: ${title}`);
    }
    saveState();
    
    document.getElementById('admin-add-video-form').reset();
    document.getElementById('admin-tbtn-catalog').click();
    renderAllViewCatalogs();
  });

  // Approvals queue
  const approveDemo = document.getElementById('btn-approve-demo');
  const rejectDemo = document.getElementById('btn-reject-demo');
  if (approveDemo && rejectDemo) {
    approveDemo.addEventListener('click', () => {
      approveDemo.closest('tr').remove();
      showToast("Approved");
    });
    rejectDemo.addEventListener('click', () => {
      rejectDemo.closest('tr').remove();
      showToast("Rejected");
    });
  }

  // Newsletter Submit
  const newsletterForm = document.getElementById('newsletter-subscription-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('newsletter-success-toast').style.display = 'block';
    document.getElementById('newsletter-email-input').value = '';
    setTimeout(() => {
      document.getElementById('newsletter-success-toast').style.display = 'none';
    }, 4000);
  });

  // Contact Support submit
  const contactForm = document.getElementById('contact-us-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('contact-success-toast').style.display = 'block';
    contactForm.reset();
    setTimeout(() => {
      document.getElementById('contact-success-toast').style.display = 'none';
    }, 4000);
  });

  // Keyboard Navigation Shortcuts for video player
  document.addEventListener('keydown', (e) => {
    const playerView = document.getElementById('player-view');
    if (playerView && !playerView.classList.contains('hidden')) {
      const video = document.getElementById('main-video-player');
      if (e.code === 'Space') {
        e.preventDefault();
        const playBtn = document.getElementById('player-btn-play');
        if (playBtn) playBtn.click();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 10);
        updatePlayerTimeDisplay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        video.currentTime = Math.min(video.duration || 900, video.currentTime + 10);
        updatePlayerTimeDisplay();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        exitPlayer();
      }
    }
  });

});

// PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA active', reg.scope))
      .catch(err => console.log('PWA registration failed', err));
  });
}
