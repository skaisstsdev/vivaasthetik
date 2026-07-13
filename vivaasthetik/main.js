/* ================================================================
   VIVA Ästhetik — main.js v2
   Features: Lenis smooth scroll, reveal animations, counters,
   language switcher, booking multi-step form, FAQ accordion,
   navbar scroll, toast notifications, preloader
   ================================================================ */

'use strict';

// ── Supabase Config ──
const SUPABASE_URL  = 'https://fqkxjjtxfnfdcmcxiugo.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa3hqanR4Zm5mZGNtY3hpdWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTY5NTMsImV4cCI6MjA1ODY3Mjk1M30.JuIl1rGRwbBXpNJjKrxcPFLjHVFBq6OsmXRxNpMH5RQ';

let supabase = null;
try {
  if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
} catch(e) { console.warn('Supabase not loaded'); }

// ── Language ──
const TRANSLATIONS = {
  de: {
    'nav.home': 'Startseite',
    'nav.services': 'Leistungen',
    'nav.about': 'Über mich',
    'nav.booking': 'Terminbuchung',
    'nav.faq': 'FAQ',
    'nav.reviews': 'Empfehlungen',
    'nav.book': 'Termin buchen',
    'footer.privacy': 'Datenschutz',
    'footer.impressum': 'Impressum',
    'footer.agb': 'AGB',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.about': 'Обо мне',
    'nav.booking': 'Запись',
    'nav.faq': 'FAQ',
    'nav.reviews': 'Отзывы',
    'nav.book': 'Записаться',
    'footer.privacy': 'Конфиденциальность',
    'footer.impressum': 'Impressum',
    'footer.agb': 'AGB',
  }
};

let currentLang = localStorage.getItem('viva-lang') || 'de';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('viva-lang', lang);
  document.documentElement.lang = lang;
  // Switch all [data-de] / [data-ru] elements
  document.querySelectorAll('[data-de]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (!val) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = el.getAttribute('data-placeholder-' + lang) || el.placeholder;
    } else if (el.tagName === 'OPTION') {
      el.textContent = val;
    } else {
      el.innerHTML = val;
    }
  });
  // placeholders
  document.querySelectorAll('[data-placeholder-de]').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-' + lang) || '';
  });
  // Update toggles
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function initLang() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
  applyLang(currentLang);
}

// ── Preloader ──
function initPreloader() {
  const pl = document.getElementById('preloader');
  if (!pl) return;
  // Always auto-dismiss — never block the page
  const hide = () => {
    pl.style.opacity = '0';
    pl.style.visibility = 'hidden';
    pl.style.pointerEvents = 'none';
  };
  // Dismiss after 1.2s maximum, guaranteed
  setTimeout(hide, 1200);
}


// ── Lenis Smooth Scroll ──
function initLenis() {
  if (!window.Lenis) return;
  const lenis = new window.Lenis({ lerp: 0.08, duration: 1.2 });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  // anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
    });
  });
  return lenis;
}

// ── Navbar ──
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  // Don't auto-add scrolled on page-inner pages — they start scrolled
  const isInner = document.body.classList.contains('page-inner');
  if (isInner) nav.classList.add('scrolled');

  const update = () => {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle('scrolled', scrolled || isInner);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();

  // Burger
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
}

// ── Reveal on scroll ──
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  });
  els.forEach(el => {
    // If already in viewport on load, show immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      obs.observe(el);
    }
  });
}

// ── Cookie Banner ──
function initCookieBanner() {
  if (localStorage.getItem('viva-cookie-consent')) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.id = 'cookieBanner';
  const lang = localStorage.getItem('viva-lang') || 'de';
  banner.innerHTML = `
    <div class="cookie-banner-text">
      ${lang === 'ru'
        ? 'Мы используем файлы cookie для улучшения вашего опыта и аналитики. Нажимая «Принять», вы соглашаетесь с нашей <a href="datenschutz.html">Политикой конфиденциальности</a>.'
        : 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und Analysen durchzuführen. Mit Klick auf „Akzeptieren" stimmen Sie unserer <a href="datenschutz.html">Datenschutzerklärung</a> zu.'
      }
    </div>
    <div class="cookie-banner-actions">
      <button class="cookie-btn-accept" id="cookieAccept">${lang === 'ru' ? 'Принять' : 'Akzeptieren'}</button>
      <button class="cookie-btn-decline" id="cookieDecline">${lang === 'ru' ? 'Отклонить' : 'Ablehnen'}</button>
    </div>
  `;
  document.body.appendChild(banner);
  setTimeout(() => banner.classList.add('show'), 800);

  const hide = () => {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 500);
  };
  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('viva-cookie-consent', 'accepted');
    hide();
  });
  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    localStorage.setItem('viva-cookie-consent', 'declined');
    hide();
  });
}

// ── Counter animation ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(ease * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

// ── Hero Parallax ──
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  const isMobile = window.innerWidth < 768;
  if (isMobile) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.35}px)`;
  }, { passive: true });
}

// ── FAQ Accordion ──
function initFAQ() {
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── Toast ──
function showToast(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast ' + type;
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── Booking Multi-step ──
function initBooking() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  let step = 1;
  let selectedService = null;
  let selectedDate = null;
  let selectedTime = null;

  const steps = {
    1: document.getElementById('step1'),
    2: document.getElementById('step2'),
    3: document.getElementById('step3'),
    4: document.getElementById('step4'),
  };
  const indicators = document.querySelectorAll('.step-ind');

  function goTo(n) {
    step = n;
    Object.values(steps).forEach(el => el && el.classList.remove('active'));
    if (steps[n]) steps[n].classList.add('active');
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i + 1 === n);
      ind.classList.toggle('done', i + 1 < n);
    });
  }

  // Service cards
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.svc-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedService = card.dataset.service;
      updateSummary();
    });
  });

  // Time slots
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      if (slot.classList.contains('taken')) return;
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedTime = slot.dataset.time;
      updateSummary();
    });
  });

  // Date input
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.addEventListener('change', () => {
      selectedDate = dateInput.value;
      updateSummary();
    });
  }

  function updateSummary() {
    const el = document.getElementById('bookingSummary');
    if (!el) return;
    let html = '';
    if (selectedService) html += `<div><span data-de="Leistung" data-ru="Услуга">Leistung</span>: <strong>${selectedService}</strong></div>`;
    if (selectedDate) html += `<div><span data-de="Datum" data-ru="Дата">Datum</span>: <strong>${selectedDate}</strong></div>`;
    if (selectedTime) html += `<div><span data-de="Uhrzeit" data-ru="Время">Uhrzeit</span>: <strong>${selectedTime}</strong></div>`;
    el.innerHTML = html || '';
  }

  // Navigation buttons
  document.getElementById('toStep2')?.addEventListener('click', () => {
    if (!selectedService) { showToast(currentLang === 'de' ? 'Bitte wählen Sie eine Leistung.' : 'Пожалуйста, выберите услугу.', 'error'); return; }
    goTo(2);
  });
  document.getElementById('toStep3')?.addEventListener('click', () => {
    const d = document.getElementById('preferredDate')?.value;
    if (!d) { showToast(currentLang === 'de' ? 'Bitte wählen Sie ein Datum.' : 'Пожалуйста, выберите дату.', 'error'); return; }
    selectedDate = d;
    updateSummary();
    goTo(3);
  });
  document.getElementById('toStep2Back')?.addEventListener('click', () => goTo(1));
  document.getElementById('toStep3Back')?.addEventListener('click', () => goTo(2));

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = currentLang === 'de' ? 'Wird gesendet...' : 'Отправка...'; }

    const data = {
      service: selectedService || '',
      preferred_date: selectedDate || document.getElementById('preferredDate')?.value || '',
      preferred_time: selectedTime || null,
      first_name: document.getElementById('firstName')?.value || '',
      last_name: document.getElementById('lastName')?.value || '',
      email: document.getElementById('bookEmail')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      message: document.getElementById('message')?.value || '',
      lang: currentLang,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    let success = false;
    if (supabase) {
      try {
        const { error } = await supabase.from('bookings').insert([data]);
        if (!error) success = true;
        else console.error('Supabase error:', error);
      } catch (err) { console.error(err); }
    }

    if (btn) { btn.disabled = false; btn.textContent = currentLang === 'de' ? 'Anfrage senden' : 'Отправить запрос'; }

    goTo(4);
    if (success) {
      showToast(currentLang === 'de' ? 'Ihre Anfrage wurde erfolgreich gesendet!' : 'Ваш запрос успешно отправлен!', 'success');
    }
  });

  goTo(1);
}

// ── Newsletter ──
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast(currentLang === 'de' ? 'Vielen Dank! Sie erhalten bald Neuigkeiten.' : 'Спасибо! Вы скоро получите новости.', 'success');
    form.reset();
  });
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initLang();
  initReveal();
  initCounters();
  initParallax();
  initFAQ();
  initBooking();
  initNewsletter();
  initLenis();
  initCookieBanner();
});
