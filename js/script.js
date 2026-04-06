/* ============================================================
   PORTFÓLIO BERNARDO DUTRA — script.js
   ============================================================ */

/* ============================================================
   0. TEMA — roda ANTES de tudo para evitar flash
   ============================================================ */
(function () {
  var saved = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', saved || 'dark');
})();


/* ============================================================
   Tudo o mais roda após o DOM estar pronto
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. NAVBAR — scroll + menu mobile
  ---------------------------------------------------------- */
  var navbar    = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNavLink();
    updateBackToTop();
  });

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ----------------------------------------------------------
     2. LINK ATIVO NA NAVBAR
  ---------------------------------------------------------- */
  function updateActiveNavLink() {
    var scrollPos = window.scrollY + 100;
    document.querySelectorAll('section[id]').forEach(function (section) {
      var id   = section.getAttribute('id');
      var link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (!link) return;
      var inView = scrollPos >= section.offsetTop &&
                   scrollPos < section.offsetTop + section.offsetHeight;
      link.classList.toggle('active', inView);
    });
  }

  /* ----------------------------------------------------------
     3. REVEAL AO SCROLL
  ---------------------------------------------------------- */
  function revealVisibleNow() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom >= 0) {
        el.classList.add('visible');
      }
    });
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  revealVisibleNow();
  window.addEventListener('scroll', revealVisibleNow, { passive: true });
  window.addEventListener('hashchange', function () { setTimeout(revealVisibleNow, 300); });

  /* ----------------------------------------------------------
     4. TYPEWRITER
  ---------------------------------------------------------- */
  var typedStrings = [
    'Desenvolvedor Full Stack',
    'Forte interesse em Back-End',
    'Python · Java · SQL',
  ];

  var currentStringIndex = 0;
  var currentCharIndex   = 0;
  var isDeleting         = false;
  var typedTextEl        = document.getElementById('typedText');

  function typeEffect() {
    if (!typedTextEl) return;
    var str = typedStrings[currentStringIndex];

    typedTextEl.textContent = isDeleting
      ? str.substring(0, currentCharIndex - 1)
      : str.substring(0, currentCharIndex + 1);

    isDeleting ? currentCharIndex-- : currentCharIndex++;

    var speed = isDeleting ? 40 : 80;

    if (!isDeleting && currentCharIndex === str.length) {
      speed = 2000; isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentStringIndex = (currentStringIndex + 1) % typedStrings.length;
      speed = 400;
    }
    setTimeout(typeEffect, speed);
  }
  setTimeout(typeEffect, 600);

  /* ----------------------------------------------------------
     5. FILTRO DE PROJETOS
  ---------------------------------------------------------- */
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.project-card').forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !match);
        if (match) setTimeout(function () { card.classList.add('visible'); }, 50);
      });
    });
  });

  /* ----------------------------------------------------------
     6. FORMULÁRIO DE CONTATO
  ---------------------------------------------------------- */
  var contactForm  = document.getElementById('contactForm');
  var formFeedback = document.getElementById('formFeedback');

  function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  function showFeedback(msg, type) {
    formFeedback.textContent = msg;
    formFeedback.className   = 'form-feedback ' + type;
    setTimeout(function () { formFeedback.className = 'form-feedback'; }, 5000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = document.getElementById('name').value.trim();
      var email   = document.getElementById('email_visible').value.trim();
      var message = document.getElementById('message').value.trim();

      if (!name || !email || !message) { showFeedback('Preencha todos os campos.', 'error'); return; }
      if (!isValidEmail(email))        { showFeedback('Digite um e-mail válido.', 'error');   return; }

      var btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      /* Envia de verdade para Formspree */
      fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      })
      .then(function (res) {
        if (res.ok) {
          showFeedback('Mensagem enviada, ' + name + '! Retorno em breve. 🚀', 'success');
          contactForm.reset();
        } else {
          showFeedback('Erro ao enviar. Tente: contato.bernardopd@gmail.com', 'error');
        }
      })
      .catch(function () {
        showFeedback('Sem conexão. Tente: contato.bernardopd@gmail.com', 'error');
      })
      .finally(function () {
        btn.textContent = 'Enviar mensagem';
        btn.disabled = false;
      });
    });
  }

  /* ----------------------------------------------------------
     7. VOLTAR AO TOPO
  ---------------------------------------------------------- */
  var backToTopBtn = document.getElementById('backToTop');

  function updateBackToTop() {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     8. ANO NO FOOTER
  ---------------------------------------------------------- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     9. SCROLL SUAVE + REVEAL PÓS-CLIQUE
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(revealVisibleNow, 600);
      }
    });
  });

  /* ----------------------------------------------------------
     10. HERO STAGGER
  ---------------------------------------------------------- */
  document.querySelectorAll('.hero .reveal').forEach(function (el, i) {
    setTimeout(function () { el.classList.add('visible'); }, 150 + i * 150);
  });

  /* ----------------------------------------------------------
     11. DARK / LIGHT TOGGLE
  ---------------------------------------------------------- */
  var themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

}); // fim DOMContentLoaded