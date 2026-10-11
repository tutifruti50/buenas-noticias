/* =========================================================
   BUENAS NOTICIAS — interacción (portada y artículos)
   CONFIGURACIÓN: número de WhatsApp que recibe las
   suscripciones (código de país + número, sin espacios ni +)
   ========================================================= */
var WHATSAPP = '18094888459';

/* Versículos del día (Reina-Valera 1909, dominio público) */
var VERSES = [
  ['Venid a mí todos los que estáis trabajados y cargados, que yo os haré descansar.', 'Mateo 11:28'],
  ['Yo he venido para que tengan vida, y para que la tengan en abundancia.', 'Juan 10:10'],
  ['Yo soy la luz del mundo: el que me sigue, no andará en tinieblas.', 'Juan 8:12'],
  ['Yo soy la resurrección y la vida.', 'Juan 11:25'],
  ['El Hijo del hombre vino a buscar y salvar lo que se había perdido.', 'Lucas 19:10'],
  ['La paz os dejo, mi paz os doy.', 'Juan 14:27'],
  ['Yo estoy con vosotros todos los días, hasta el fin del mundo.', 'Mateo 28:20']
];

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return document.getElementById(id); }
  var now = new Date();

  /* Fecha y año */
  if ($('today')) {
    var d = now.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    $('today').textContent = d.charAt(0).toUpperCase() + d.slice(1);
  }
  if ($('year')) $('year').textContent = now.getFullYear();

  /* ---------- Menú móvil ---------- */
  var toggle = $('navToggle'), menu = $('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Aparecer al hacer scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Sección activa en el menú (portada) ---------- */
  if (menu && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]:not(.btn)'));
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) {
      var s = document.querySelector(l.getAttribute('href'));
      if (s) spy.observe(s);
    });
  }

  /* ---------- Movimiento ligado al scroll ---------- */
  var nav = $('nav');
  var depthEls = document.querySelectorAll('[data-depth]');
  var progress = $('readProgress');
  var ticking = false;

  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    if (nav) nav.classList.toggle('is-scrolled', y > 30);
    if (progress) {
      var max = document.documentElement.scrollHeight - vh;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
    if (reduce) return;
    depthEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh + 300) return;
      var dd = parseFloat(el.getAttribute('data-depth'));
      var base = el.closest('.hero, .ahero') ? y : (r.top + r.height / 2 - vh / 2);
      el.style.transform = 'translate3d(0,' + (base * dd).toFixed(1) + 'px,0)';
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  window.addEventListener('resize', frame);
  frame();

  /* ---------- Cinta de titulares ---------- */
  var ticker = $('ticker');
  if (ticker && !reduce) {
    var drift = 0, lastY = window.scrollY;
    (function loop() {
      var y = window.scrollY;
      var boost = Math.min(12, Math.abs(y - lastY) * 0.4);
      lastY = y;
      drift += 0.6 + boost;
      var half = ticker.scrollWidth / 2;
      if (drift > half) drift -= half;
      ticker.style.transform = 'translate3d(' + (-drift) + 'px,0,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Versículo del día ---------- */
  var vText = $('verseText'), vRef = $('verseRef');
  if (vText && vRef) {
    var current = Math.floor(now.getTime() / 86400000) % VERSES.length;
    vText.textContent = VERSES[current][0];
    vRef.textContent = VERSES[current][1];
    $('verseNext').addEventListener('click', function () {
      current = (current + 1) % VERSES.length;
      vText.classList.add('fade');
      setTimeout(function () {
        vText.textContent = VERSES[current][0];
        vRef.textContent = VERSES[current][1];
        vText.classList.remove('fade');
      }, reduce ? 0 : 300);
    });
    $('verseShare').addEventListener('click', function () {
      var msg = '«' + VERSES[current][0] + '» — ' + VERSES[current][1] + '\n\nUna buena noticia para tu día. ' + location.href.split('#')[0];
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  /* ---------- Compartir un artículo ---------- */
  document.querySelectorAll('[data-share]').forEach(function (b) {
    b.addEventListener('click', function () {
      var msg = document.title.split(' — ')[0] + '\n' + location.href.split('#')[0];
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  });

  /* ---------- Suscripción por WhatsApp ---------- */
  var form = $('subForm'), err = $('subError');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim();
      var city = form.city.value.trim();
      if (!name) { err.textContent = 'Escribe tu nombre para suscribirte.'; form.name.focus(); return; }
      err.textContent = '';
      var msg = 'Hola, quiero recibir las Buenas Noticias cada mañana.\nNombre: ' + name + (city ? '\nCiudad: ' + city : '');
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }
})();
