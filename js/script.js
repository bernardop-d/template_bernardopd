/* ============================================================
   PORTFÓLIO BERNARDO DUTRA — script.js
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* 1. MENU MOBILE ------------------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  function setMenu(open) {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Fechar' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
  links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* 2. REVEAL AO ROLAR -------------------------------------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    // linhas da mesma lista entram em cascata
    var list = el.parentElement;
    if (list && list.classList.contains('rows')) {
      el.style.transitionDelay = (Array.prototype.indexOf.call(list.children, el) * 70) + 'ms';
    }
    io.observe(el);
  });

  /* 3. PARALLAX DA FOTO DO HERO ----------------------------------- */
  var heroImg = document.querySelector('.hero-photo img');
  if (heroImg && !reduceMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, window.innerHeight);
        heroImg.style.transform = 'translateY(' + (y * 0.12) + 'px) scale(' + (1 + y * 0.0002) + ')';
        ticking = false;
      });
    }, { passive: true });
  }

  /* 4. PRÉVIA DO PROJETO SEGUINDO O CURSOR ------------------------ */
  var preview = document.getElementById('preview');
  if (preview && canHover) {
    var text = preview.querySelector('p');
    var x = 0, y = 0, px = 0, py = 0, running = false;

    function loop() {
      px += (x - px) * 0.18;
      py += (y - py) * 0.18;
      preview.style.left = px + 'px';
      preview.style.top = py + 'px';
      if (running) requestAnimationFrame(loop);
    }

    document.querySelectorAll('#projectRows .row').forEach(function (row) {
      row.addEventListener('mouseenter', function (e) {
        text.textContent = row.getAttribute('data-desc');
        if (!running) { px = e.clientX; py = e.clientY; running = true; requestAnimationFrame(loop); }
        preview.classList.add('on');
      });
      row.addEventListener('mousemove', function (e) { x = e.clientX + 170; y = e.clientY; });
      row.addEventListener('mouseleave', function () { preview.classList.remove('on'); });
    });
    document.getElementById('projectRows').addEventListener('mouseleave', function () {
      setTimeout(function () { if (!preview.classList.contains('on')) running = false; }, 400);
    });
  }

  /* 5. FAIXA DE TEXTO: duplica para o loop ------------------------ */
  if (!reduceMotion) {
    document.querySelectorAll('.band-row').forEach(function (row) {
      var track = row.querySelector('.band-track');
      row.appendChild(track.cloneNode(true));
    });
  }

  /* 6. NOME DO RODAPÉ OCUPA A LARGURA TODA ------------------------ */
  var word = document.querySelector('.footer-word');
  function fitWord() {
    if (!word) return;
    var cs = getComputedStyle(word.parentElement);
    var avail = word.parentElement.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    word.style.fontSize = '100px';
    var w = word.getBoundingClientRect().width;
    if (w) word.style.fontSize = (100 * avail / w * 0.995) + 'px';
  }
  fitWord();
  window.addEventListener('resize', fitWord);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWord);

  /* 7. ANO -------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
