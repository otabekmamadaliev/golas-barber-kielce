/* Gola's — skrypt tylko tej strony. Bez zależności. */
(function () {
  'use strict';
  var T = {}; try { T = JSON.parse(document.getElementById('i18n').textContent) || {}; } catch (e) {}
  var t = function (k, d) { return T[k] || d; };

  var bar = document.querySelector('.nav');
  var onScroll = function () { bar.classList.toggle('zwarty', window.scrollY > 40); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  var burger = document.querySelector('.hamburger');
  var mob = document.getElementById('mob');
  if (burger && mob) {
    var openLabel = burger.getAttribute('aria-label');
    burger.addEventListener('click', function () {
      var open = mob.classList.toggle('otwarte');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? t('closeMenu', openLabel) : openLabel);
    });
    mob.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { mob.classList.remove('otwarte'); burger.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mob.classList.contains('otwarte')) burger.click();
    });
  }

  /* Rozdziały wchodzą pojedynczo. Stan widoczny jest domyślny w CSS,
     więc bez JS i przy zredukowanym ruchu nic się nie chowa. */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var els = document.querySelectorAll('.haslo-kolumny p, .fakty li, .lista li, .galeria figure, .bilecik');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.style.transition = 'opacity .95s ease, transform .95s cubic-bezier(.16,.84,.28,1)';
        en.target.style.opacity = 1; en.target.style.transform = 'none';
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .06 });
    Array.prototype.forEach.call(els, function (el, i) {
      el.style.opacity = 0; el.style.transform = 'translateY(22px)';
      el.style.transitionDelay = (i % 5) * 90 + 'ms';
      io.observe(el);
    });
  }

  /* Kliknięcie w przełącznik zapamiętuje wybór, żeby automat nie zabierał
     użytkownika z powrotem przy następnym wejściu. */
  document.querySelectorAll('a.lang').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('jezyk', (a.getAttribute('hreflang') || a.textContent).trim().toLowerCase().slice(0,2)); } catch (e) {}
    });
  });

  /* Godziny "na dzis": strona jest statyczna, wiec dzien tygodnia musi policzyc
     przegladarka. Wpisany przy budowaniu zestarzalby sie nazajutrz. */
  (function () {
    var zrodlo = document.querySelector('[data-godziny]');
    var pole = document.querySelector('[data-godziny-dzis]');
    if (!zrodlo || !pole) return;
    var lista;
    try { lista = JSON.parse(zrodlo.textContent); } catch (e) { return; }
    var i = (new Date().getDay() + 6) % 7;          // poniedzialek = 0
    var dzis = lista[i] || '';
    pole.textContent = dzis;
    // Dzien bez zadnej cyfry to dzien zamkniety ("nieczynne") — wtedy napis
    // jest mniejszy i szary, zeby nie krzyczal wielkim drukiem "NIECZYNNE".
    if (!/[0-9]/.test(dzis)) pole.classList.add('zamkniete');
    var wiersz = document.querySelector('.tydzien li[data-dzien="' + i + '"]');
    if (wiersz) wiersz.classList.add('dzis');
  })();
})();
