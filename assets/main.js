/* ═══════════════════════════════════════════════════════════
   PATHOS LABS — SHARED JS
   Nav (transparent→solid), mobile menu, scroll reveals,
   newsletter forms + modal, writing filters,
   GoatCounter, smooth scroll.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── NAV: TRANSPARENT → SOLID ON SCROLL ─────────── */
  var nav = document.querySelector('.nav');
  if (nav && nav.classList.contains('nav--transparent')) {
    var hero = document.querySelector('.hero') || document.querySelector('.page-hero') || document.querySelector('.newsletter-hero') || document.querySelector('.assess-hero');
    if (hero) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            nav.classList.remove('nav--scrolled');
          } else {
            nav.classList.add('nav--scrolled');
          }
        });
      }, { threshold: 0, rootMargin: '-' + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ds-nav-h')) || 60) + 'px 0px 0px 0px' });
      observer.observe(hero);
    }
  }

  /* ─── MOBILE NAV ──────────────────────────────────── */
  var hamburger = document.querySelector('.nav-hamburger');
  var mobilePanel = document.querySelector('.nav-mobile-panel');
  var navOverlay = document.querySelector('.nav-overlay');

  if (hamburger && mobilePanel) {
    var focusableInPanel = function () {
      return mobilePanel.querySelectorAll('a[href], button:not([disabled])');
    };

    function openNav() {
      hamburger.setAttribute('aria-expanded', 'true');
      mobilePanel.classList.add('is-open');
      if (navOverlay) navOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      var links = focusableInPanel();
      if (links.length) links[0].focus();
    }

    function closeNav() {
      hamburger.setAttribute('aria-expanded', 'false');
      mobilePanel.classList.remove('is-open');
      if (navOverlay) navOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      hamburger.focus();
    }

    hamburger.addEventListener('click', function () {
      var isOpen = this.getAttribute('aria-expanded') === 'true';
      isOpen ? closeNav() : openNav();
    });

    if (navOverlay) navOverlay.addEventListener('click', closeNav);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        closeNav();
      }
    });

    // Focus trap
    mobilePanel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var links = focusableInPanel();
      if (!links.length) return;
      var first = links[0];
      var last = links[links.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    mobilePanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  /* ─── SCROLL REVEAL ──────────────────────────────── */
  if (!prefersReducedMotion) {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      reveals.forEach(function (el) { revealObserver.observe(el); });
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ─── POST BODY REVEALS (pull quotes, callouts) ──── */
  var postReveals = document.querySelectorAll('.post-body .pull-quote, .post-callout');
  if (postReveals.length) {
    if (!prefersReducedMotion) {
      var postRevealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            postRevealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      postReveals.forEach(function (el) { postRevealObs.observe(el); });
    } else {
      postReveals.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ─── EVIDENCE COUNTER ANIMATION ─────────────────── */
  if (!prefersReducedMotion) {
    var counters = document.querySelectorAll('.evidence-num, .evidence-figure');
    if (counters.length) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          counterObserver.unobserve(el);
          var raw = el.textContent.trim();
          // Handle ranges like "55–60%"
          var rangeMatch = raw.match(/^(\d+)(\D+)(\d+)(%.*)$/);
          if (rangeMatch) {
            var lo = parseInt(rangeMatch[1]);
            var sep = rangeMatch[2];
            var hi = parseInt(rangeMatch[3]);
            var suf = rangeMatch[4];
            var dur = 800;
            var st = performance.now();
            el.textContent = '0' + sep + '0' + suf;
            (function animRange() {
              requestAnimationFrame(function (now) {
                var t = Math.min((now - st) / dur, 1);
                var e = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(e * lo) + sep + Math.round(e * hi) + suf;
                if (t < 1) animRange();
              });
            })();
            return;
          }
          // Single number: "3.5×", "37", etc.
          var match = raw.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
          if (!match) return;
          var prefix = match[1];
          var target = parseFloat(match[2]);
          var suffix = match[3];
          var isFloat = match[2].indexOf('.') !== -1;
          var duration = 800;
          var start = performance.now();
          function tick(now) {
            var t = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            var current = eased * target;
            el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
            if (t < 1) requestAnimationFrame(tick);
          }
          el.textContent = prefix + (isFloat ? '0.0' : '0') + suffix;
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ─── TESTIMONY SECTION REVEAL ─────────────────── */
  if (!prefersReducedMotion) {
    var testimonySection = document.querySelector('.section-testimony');
    if (testimonySection) {
      var testimonyObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            testimonyObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      testimonyObs.observe(testimonySection);
    }
  }

  /* ─── SMOOTH SCROLL WITH NAV OFFSET ──────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || href === '#main') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ds-nav-h')) || 60;
      var y = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: y, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ─── NEWSLETTER FORM HANDLER ────────────────────── */
  var KIT_FORM_ID = '9098413';
  var KIT_API_KEY = 'GXwvYXvNYOsCjiliB4ILTA';

  function handleNewsletterForm(form) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) {
        showFormMsg(form, 'Thank you.', 'success');
        return;
      }

      var emailInput = form.querySelector('input[type="email"]');
      var email = emailInput ? emailInput.value.trim() : '';
      if (!email) return;

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending\u2026'; btn.disabled = true; }

      var formLocation = 'unknown';
      var sourceTagId = null;
      if (form.closest('.newsletter-hero')) { formLocation = 'hero'; sourceTagId = 17002547; }
      else if (form.closest('.footer')) { formLocation = 'footer'; sourceTagId = 17002548; }
      else if (form.closest('.section-newsletter')) { formLocation = 'inline'; sourceTagId = 17002546; }
      else if (form.closest('.modal')) { formLocation = 'modal'; sourceTagId = 17002545; }

      var payload = {
        api_key: KIT_API_KEY,
        email: email,
        fields: {
          source: 'newsletter-' + formLocation,
          page: window.location.pathname,
          referrer: document.referrer || 'direct'
        }
      };
      if (sourceTagId) payload.tags = [sourceTagId];

      fetch('https://api.convertkit.com/v3/forms/' + KIT_FORM_ID + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (res) {
        if (!res.ok) throw new Error('Subscription failed');
        return res.json();
      })
      .then(function () {
        showFormMsg(form, 'You\u2019re in. Check your inbox.', 'success');
        if (emailInput) emailInput.value = '';
        localStorage.setItem('pathos_subscribed', '1');
        var modal = form.closest('.modal');
        if (modal) setTimeout(closeModal, 3000);
      })
      .catch(function () {
        showFormMsg(form, 'Something went wrong. Try again.', 'error');
      })
      .finally(function () {
        if (btn) { btn.textContent = originalText; btn.disabled = false; }
      });
    });
  }

  function showFormMsg(form, text, type) {
    var container = form.parentElement;
    var msgEl = container.querySelector('.newsletter-form-msg');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'newsletter-form-msg';
      container.appendChild(msgEl);
    }
    msgEl.textContent = text;
    msgEl.className = 'newsletter-form-msg is-' + type;
  }

  document.querySelectorAll('.newsletter-form').forEach(handleNewsletterForm);

  /* ─── NEWSLETTER MODAL ───────────────────────────── */
  var modalBackdrop = document.querySelector('.modal-backdrop');
  var modal = document.querySelector('.modal');
  var modalCloseBtn = document.querySelector('.modal-close');
  var modalTrigger = null;

  function shouldShowModal() {
    return modal && !localStorage.getItem('pathos_dismissed') && !localStorage.getItem('pathos_subscribed');
  }

  function openModal() {
    if (!modal || !modalBackdrop) return;
    modalTrigger = document.activeElement;
    modalBackdrop.classList.add('is-open');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var input = modal.querySelector('input[type="email"]');
    if (input) input.focus();
  }

  function closeModal() {
    if (!modal || !modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    localStorage.setItem('pathos_dismissed', '1');
    if (modalTrigger) modalTrigger.focus();
  }

  if (modal && shouldShowModal()) {
    var modalShown = false;

    function triggerModal() {
      if (modalShown || !shouldShowModal()) return;
      modalShown = true;
      openModal();
    }

    var timer = setTimeout(triggerModal, 50000);

    window.addEventListener('scroll', function onScroll() {
      var pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (pct > 0.8) {
        triggerModal();
        window.removeEventListener('scroll', onScroll);
        clearTimeout(timer);
      }
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    // Focus trap
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = modal.querySelectorAll('input:not([type="hidden"]):not([tabindex="-1"]), button:not([disabled]), a[href]');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  /* ─── WRITING FILTERS ───────────────────────────── */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var writingSections = document.querySelectorAll('.writing-section[data-section-type]');

  if (filterBtns.length && writingSections.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var type = btn.getAttribute('data-filter');

        writingSections.forEach(function (section) {
          if (type === 'all' || section.getAttribute('data-section-type') === type) {
            section.removeAttribute('data-hidden');
          } else {
            section.setAttribute('data-hidden', 'true');
          }
        });
      });
    });
  }

  /* ─── READING PROGRESS BAR ─────────────────────── */
  var progressBar = document.querySelector('.post-progress');
  if (progressBar) {
    var postBody = document.querySelector('.post-body');
    if (postBody) {
      var bodyTop = 0;
      var bodyHeight = 0;

      function cachePostLayout() {
        var rect = postBody.getBoundingClientRect();
        bodyTop = rect.top + window.scrollY;
        bodyHeight = rect.height;
      }
      cachePostLayout();
      window.addEventListener('resize', cachePostLayout, { passive: true });

      window.addEventListener('scroll', function () {
        var scrolled = window.scrollY - bodyTop;
        var pct = Math.max(0, Math.min(100, (scrolled / bodyHeight) * 100));
        progressBar.style.width = pct + '%';
      }, { passive: true });
    }
  }

  /* ─── GOATCOUNTER ANALYTICS ──────────────────────── */
  if (!window.goatcounter) {
    var script = document.createElement('script');
    script.async = true;
    script.dataset.goatcounter = 'https://pathos-labs.goatcounter.com/count';
    script.src = '//gc.zgo.at/count.js';
    document.head.appendChild(script);
  }

  /* ─── EVENT TRACKING (GoatCounter) ─────────────── */
  function trackEvent(name) {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: 'event/' + name, title: name, event: true });
    }
  }

  // Track Cal.com CTA clicks
  document.querySelectorAll('a[href*="cal.com/pathos-labs"]').forEach(function (link) {
    link.addEventListener('click', function () {
      trackEvent('cta-book-call');
    });
  });

  // Track newsletter signups by location (hero, footer, modal)
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function () {
      var location = 'unknown';
      if (form.closest('.newsletter-hero')) location = 'hero';
      else if (form.closest('.footer')) location = 'footer';
      else if (form.closest('.section-newsletter')) location = 'inline';
      else if (form.closest('.modal')) location = 'modal';
      trackEvent('newsletter-signup-' + location);
    });
  });

  // Track research deck card clicks
  document.querySelectorAll('.research-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var title = card.querySelector('.research-card-title');
      var slug = title ? title.textContent.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 40) : 'unknown';
      trackEvent('research-card-click-' + slug);
    });
  });

  // Track writing filter tab clicks
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      trackEvent('filter-' + (btn.getAttribute('data-filter') || 'unknown'));
    });
  });
})();
