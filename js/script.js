/* ============================================================
   PORTFÓLIO BERNARDO DUTRA — script.js
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1. NAVBAR: fundo ao rolar, menu mobile, link ativo
  ---------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  var sections = document.querySelectorAll('main section[id]'); // inclui o hero (#topo), que limpa o destaque
  var linkFor = {};
  navLinks.querySelectorAll('a').forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
  var activeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var link = linkFor[entry.target.id];
      navLinks.querySelectorAll('a').forEach(function (a) { a.classList.remove('active'); });
      if (link) link.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function (s) { activeObserver.observe(s); });

  /* ----------------------------------------------------------
     2. REVEAL AO ROLAR (seções e cards em sequência)
  ---------------------------------------------------------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (el.classList.contains('reveal-card')) {
        var siblings = Array.prototype.slice.call(el.parentElement.querySelectorAll('.reveal-card:not(.visible)'));
        siblings.forEach(function (card, i) {
          setTimeout(function () { card.classList.add('visible'); }, i * 160);
          revealObserver.unobserve(card);
        });
      } else {
        el.classList.add('visible');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-card').forEach(function (el) { revealObserver.observe(el); });

  /* ----------------------------------------------------------
     3. EDITOR: "sobre mim" digitado linha a linha
     Cada linha é uma lista de [classe, texto].
  ---------------------------------------------------------- */
  var lines = [
    [['v', 'nome'], ['o', ' = '], ['s', '"Bernardo Pereira Dutra"']],
    [['v', 'cargo'], ['o', ' = '], ['s', '"Desenvolvedor Back-End"']],
    [['v', 'local'], ['o', ' = '], ['s', '"Rio de Janeiro, Tijuca"']],
    [['v', 'stack'], ['o', ' = '], ['p', '['], ['s', '"Java"'], ['o', ', '], ['s', '"Spring Boot"'], ['o', ', '], ['s', '"Python"'], ['o', ', '], ['s', '"FastAPI"'], ['o', ', '], ['s', '"SQL"'], ['p', ']']],
    [['v', 'formacao'], ['o', ' = '], ['s', '"ADS · Estácio de Sá · dez/2026"']],
    [['v', 'idiomas'], ['o', ' = '], ['p', '{'], ['s', '"inglês"'], ['o', ': '], ['s', '"avançado"'], ['o', ', '], ['s', '"espanhol"'], ['o', ': '], ['s', '"básico"'], ['p', '}']],
    [['c', '# prefiro entender o que acontece por baixo antes de abstrair']],
    [['v', 'buscando'], ['o', ' = '], ['p', '['], ['s', '"dev júnior"'], ['o', ', '], ['s', '"estágio back-end"'], ['o', ', '], ['s', '"freelas"'], ['p', ']']],
    [['v', 'email'], ['o', ' = '], ['s', '"contato.bernardopd@gmail.com"']],
    [],
    [['f', 'print'], ['p', '('], ['s', '"Bora conversar? Os contatos estão logo abaixo."'], ['p', ')']]
  ];

  var codeEl = document.getElementById('code');
  var gutterEl = document.getElementById('gutter');
  var editorEl = document.getElementById('editor');

  function addGutterLine(n) {
    var li = document.createElement('li');
    li.textContent = n;
    gutterEl.appendChild(li);
  }

  function renderAll() {
    codeEl.textContent = '';
    gutterEl.textContent = '';
    lines.forEach(function (tokens, i) {
      addGutterLine(i + 1);
      tokens.forEach(function (t) {
        var span = document.createElement('span');
        span.className = t[0];
        span.textContent = t[1];
        codeEl.appendChild(span);
      });
      if (i < lines.length - 1) codeEl.appendChild(document.createTextNode('\n'));
    });
  }

  function typeAll() {
    var caret = document.createElement('span');
    caret.className = 'caret';
    codeEl.textContent = '';
    gutterEl.textContent = '';
    codeEl.appendChild(caret);

    var li = 0, ti = 0, ci = 0, span = null;
    addGutterLine(1);

    function step() {
      if (li >= lines.length) return;
      var tokens = lines[li];

      if (ti >= tokens.length) {
        li++; ti = 0; ci = 0; span = null;
        if (li < lines.length) {
          codeEl.insertBefore(document.createTextNode('\n'), caret);
          addGutterLine(li + 1);
          setTimeout(step, 180);
        }
        return;
      }

      var tok = tokens[ti];
      if (!span) {
        span = document.createElement('span');
        span.className = tok[0];
        codeEl.insertBefore(span, caret);
      }
      span.textContent += tok[1].charAt(ci);
      ci++;
      if (ci >= tok[1].length) { ti++; ci = 0; span = null; }

      var delay = tok[0] === 'c' ? 14 : 22 + Math.random() * 26;
      setTimeout(step, delay);
    }
    step();
  }

  if (codeEl) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      renderAll();
    } else {
      var started = false;
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting && !started) {
          started = true;
          obs.disconnect();
          setTimeout(typeAll, 350);
        }
      }, { threshold: 0.35 }).observe(editorEl);
    }
  }

  /* ----------------------------------------------------------
     4. SKILLS: duplica as pílulas para o loop infinito
  ---------------------------------------------------------- */
  if (!reduceMotion) {
    document.querySelectorAll('.marquee-track').forEach(function (track) {
      Array.prototype.slice.call(track.children).forEach(function (pill) {
        var clone = pill.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    });
  }

  /* ----------------------------------------------------------
     5. TRILHO DE PROJETOS: setas e arrastar com o mouse
  ---------------------------------------------------------- */
  var rail = document.getElementById('rail');
  if (rail) {
    document.querySelectorAll('.rail-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = Number(btn.getAttribute('data-dir'));
        rail.scrollBy({ left: dir * 324, behavior: 'smooth' });
      });
    });

    var down = false, moved = false, startX = 0, startScroll = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; startX = e.clientX; startScroll = rail.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 5) { moved = true; rail.classList.add('dragging'); }
      if (moved) rail.scrollLeft = startScroll - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      setTimeout(function () { rail.classList.remove('dragging'); }, 0);
    });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    rail.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  /* ----------------------------------------------------------
     6. FORMULÁRIO (Formspree)
  ---------------------------------------------------------- */
  var form = document.getElementById('contactForm');
  var feedback = document.getElementById('formFeedback');

  function say(msg, type) {
    feedback.textContent = msg;
    feedback.className = 'form-feedback ' + (type || '');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var name = form.elements.name.value.trim();
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      say('');

      fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then(function (res) {
          if (!res.ok) throw new Error();
          say('Mensagem enviada' + (name ? ', ' + name.split(' ')[0] : '') + '! Respondo em breve.', 'ok');
          form.reset();
        })
        .catch(function () {
          say('Não consegui enviar. Me escreva em contato.bernardopd@gmail.com', 'err');
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = 'Enviar mensagem';
        });
    });
  }

  /* ----------------------------------------------------------
     7. ANO NO RODAPÉ
  ---------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
