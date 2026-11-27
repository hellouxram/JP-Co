/*!
 * JP & Co. — site behaviour (plain JavaScript, no framework).
 *
 * Every page is complete HTML; this file only adds progressive enhancements:
 *   1. Header hairline on scroll
 *   2. Accessible mobile menu
 *   3. Scroll-reveal animations
 *   4. Ambient hero ribbon motion (home page)
 *   5. Contact form validation + submission
 *   6. Footer year
 *
 * Without JavaScript the site still works: all content and links are in the HTML,
 * and a <noscript> style in each page makes scroll-reveal content visible.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------
     1. Header hairline once the page scrolls
     ------------------------------------------------------------------ */
  var header = document.querySelector('header');
  function updateHeader() {
    if (!header) return;
    var scrolled = window.scrollY > 8 || isMenuOpen();
    header.classList.toggle('border-jp-ivory/10', scrolled);
    header.classList.toggle('border-transparent', !scrolled);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ------------------------------------------------------------------
     2. Mobile menu: aria-expanded, Escape to close, focus kept inside,
        background made inert, body scroll locked, closes at desktop width
     ------------------------------------------------------------------ */
  var toggle = document.querySelector('[aria-controls="mobile-navigation"]');
  var panel = document.getElementById('mobile-navigation');
  var MENU_ICON = toggle ? toggle.innerHTML : '';
  var CLOSE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true" focusable="false" class="h-6 w-6"><path d="m6 6 12 12M18 6 6 18"></path></svg>';

  function isMenuOpen() {
    return !!panel && !panel.hidden;
  }

  function background() {
    return [document.getElementById('main'), document.querySelector('footer')].filter(Boolean);
  }

  function openMenu() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    toggle.innerHTML = CLOSE_ICON;
    document.body.style.overflow = 'hidden';
    background().forEach(function (el) { el.setAttribute('inert', ''); });
    var first = panel.querySelector('a, button');
    if (first) first.focus();
    updateHeader();
  }

  function closeMenu(returnFocus) {
    if (!isMenuOpen()) return;
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.innerHTML = MENU_ICON;
    document.body.style.overflow = '';
    background().forEach(function (el) { el.removeAttribute('inert'); });
    if (returnFocus) toggle.focus();
    updateHeader();
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      if (isMenuOpen()) closeMenu(true);
      else openMenu();
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) closeMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (!isMenuOpen()) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(true);
        return;
      }
      if (e.key !== 'Tab') return;
      var focusables = [toggle].concat(
        Array.prototype.slice.call(panel.querySelectorAll('a[href], button:not([disabled])')),
      );
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches) closeMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     3. Scroll reveal
     ------------------------------------------------------------------ */
  var reveals = document.querySelectorAll('.reveal[data-visible="false"]');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.setAttribute('data-visible', 'true'); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     4. Ambient hero ribbon: slow silk-like drift + pointer parallax.
        (The light sweep along the edges is pure CSS.) Off for reduced
        motion; paused when off-screen or when the tab is hidden.
     ------------------------------------------------------------------ */
  var RIBBONS = [
    { edge: [[40, 960], [380, 760], [430, 300], [960, -40]], inner: [[330, 960], [560, 800], [640, 560], [960, 420]], lines: 48, amp: 42, phase: 0 },
    { edge: [[400, 960], [600, 820], [690, 650], [960, 560]], inner: [[620, 960], [740, 880], [820, 820], [960, 790]], lines: 28, amp: 30, phase: 2.1 },
  ];
  var FLOW_PERIOD_S = 18;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpPt(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
  function lerpCubic(a, b, t) { return [lerpPt(a[0], b[0], t), lerpPt(a[1], b[1], t), lerpPt(a[2], b[2], t), lerpPt(a[3], b[3], t)]; }
  function fmt(p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function cubicPath(c) { return 'M' + fmt(c[0]) + ' C' + fmt(c[1]) + ' ' + fmt(c[2]) + ' ' + fmt(c[3]); }
  function bodyPath(edge, inner, depth) {
    var i = lerpCubic(edge, inner, depth);
    return cubicPath(edge) + ' L' + fmt(i[3]) + ' C' + fmt(i[2]) + ' ' + fmt(i[1]) + ' ' + fmt(i[0]) + ' Z';
  }
  function offset(p, dx, dy) { return [p[0] + dx, p[1] + dy]; }

  /** Ribbon geometry at `time` seconds into the loop (time 0 = the static shape in the HTML). */
  function flow(r, time) {
    var A = r.amp, ph = r.phase, lag = 0.9, w = (2 * Math.PI) / FLOW_PERIOD_S;
    function s(k, l) { l = l || 0; return Math.sin(w * k * time + l) - Math.sin(l); }
    function c(k, l) { l = l || 0; return Math.cos(w * k * time + l) - Math.cos(l); }
    var e = r.edge, i = r.inner;
    return {
      edge: [e[0], offset(e[1], A * s(1, ph), A * 0.7 * c(1, ph)), offset(e[2], A * c(1, ph + 1.3), A * 0.6 * s(2, ph + 0.4)), offset(e[3], 0, A * 0.5 * s(1, ph + 2))],
      inner: [i[0], offset(i[1], A * 1.3 * s(1, ph + lag), A * 0.9 * c(1, ph + lag)), offset(i[2], A * 1.3 * c(1, ph + 1.3 + lag), A * 0.8 * s(2, ph + 0.4 + lag)), offset(i[3], 0, A * 0.7 * s(1, ph + 2 + lag))],
    };
  }

  function startRibbon(svg) {
    var OVERSCAN = 1.06, MORPH_MS = 33, PX = 18, PY = 12;
    var finePointer = window.matchMedia('(pointer: fine)');
    var parts = RIBBONS.map(function (_, i) {
      function q(part) { return svg.querySelectorAll('[data-rb="' + i + '"][data-part="' + part + '"]'); }
      return { body: q('body')[0], sheen: q('sheen')[0], strands: q('strand'), edges: q('edge') };
    });
    var raf = 0, running = false, inView = true, elapsed = 0, lastTick = 0, lastMorph = -Infinity;
    var pointer = { x: 0, y: 0 }, pos = { x: 0, y: 0 }, room = { x: PX, y: PY };

    function measure() {
      var r = svg.getBoundingClientRect();
      room.x = Math.min(PX, (r.width * (OVERSCAN - 1)) / 2 - 1);
      room.y = Math.min(PY, (r.height * (OVERSCAN - 1)) / 2 - 1);
    }
    function apply(t) {
      RIBBONS.forEach(function (r, i) {
        var g = flow(r, t), p = parts[i];
        if (p.body) p.body.setAttribute('d', bodyPath(g.edge, g.inner, 1));
        if (p.sheen) p.sheen.setAttribute('d', bodyPath(g.edge, g.inner, 0.16));
        for (var n = 0; n < p.strands.length; n++) {
          var tt = Math.pow(n / r.lines, 1.6);
          p.strands[n].setAttribute('d', cubicPath(lerpCubic(g.edge, g.inner, tt)));
        }
        var d = cubicPath(g.edge);
        for (var k = 0; k < p.edges.length; k++) p.edges[k].setAttribute('d', d);
      });
    }
    function frame(now) {
      if (!running) return;
      elapsed += lastTick ? Math.min(now - lastTick, 100) : 0;
      lastTick = now;
      if (elapsed - lastMorph >= MORPH_MS) { lastMorph = elapsed; apply(elapsed / 1000); }
      pos.x += (pointer.x - pos.x) * 0.06;
      pos.y += (pointer.y - pos.y) * 0.06;
      svg.style.transform = 'translate3d(' + pos.x.toFixed(2) + 'px,' + pos.y.toFixed(2) + 'px,0) scale(' + OVERSCAN + ')';
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running || reduceMotion.matches || !inView || document.hidden) return;
      running = true;
      lastTick = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }
    function reset() { stop(); elapsed = 0; lastMorph = -Infinity; apply(0); svg.style.transform = ''; }

    window.addEventListener('pointermove', function (e) {
      if (!finePointer.matches) return;
      pointer.x = -(e.clientX / window.innerWidth - 0.5) * 2 * room.x;
      pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2 * room.y;
    }, { passive: true });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    reduceMotion.addEventListener('change', function () { if (reduceMotion.matches) reset(); else start(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }).observe(svg);
    }
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(svg);
    measure();
    svg.style.willChange = 'transform';
    start();
  }

  document.querySelectorAll('svg').forEach(function (svg) {
    if (svg.querySelector('[data-part="edge"]') && svg.querySelector('.motion-reduce\\:hidden')) startRibbon(svg);
  });

  /* ------------------------------------------------------------------
     5. Contact form
        - Not connected (default): validates, then opens the visitor's email
          app with the message pre-filled. Never claims anything was sent.
        - Connected: set data-endpoint="https://formspree.io/f/…" on the <form>.
          Shows "received" only after the endpoint returns a 2xx response.
     ------------------------------------------------------------------ */
  var form = document.querySelector('form[data-contact-form]');
  if (form) setUpForm(form);

  function setUpForm(form) {
    var EMAIL = 'ram@jpandcotech.com';
    var endpoint = (form.getAttribute('data-endpoint') || '').trim();
    var SERVICES = {
      'ai-workflow-automation': 'AI & Workflow Automation',
      'product-design-ux': 'Product Design & UX',
      'saas-software-engineering': 'SaaS & Software Engineering',
      'product-strategy': 'Product Strategy',
    };
    var ORDER = ['name', 'email', 'business', 'projectType', 'details'];
    var field = function (n) { return document.getElementById('contact-' + n); };
    var status = form.querySelector('[aria-live]');
    var submit = form.querySelector('button[type="submit"]');
    var submitLabel = submit.querySelector('span');

    // Pre-select the project type from /contact/?service=<id> (links on the Services page).
    var preset = SERVICES[new URLSearchParams(location.search).get('service')];
    if (preset) field('projectType').value = preset;

    // Connected mode: adjust the copy that describes "not connected" behaviour.
    if (endpoint) {
      var note = document.getElementById('contact-form-note');
      if (note) note.remove();
      form.removeAttribute('aria-describedby');
      submit.removeAttribute('aria-describedby');
      submitLabel.textContent = 'Send Enquiry';
      var privacy = form.querySelector('[data-privacy-extra]');
      if (privacy) {
        // Say who processes the submission once a sending service is connected.
        privacy.textContent = /formspree\.io/.test(endpoint)
          ? 'Submissions are delivered to us by Formspree, our form-handling service, and are not used for marketing.'
          : 'Submissions are delivered to us by our form-handling service and are not used for marketing.';
      }
    }

    function values() {
      var v = {};
      ORDER.concat('hpField').forEach(function (n) { v[n] = (form.elements[n] && form.elements[n].value) || ''; });
      return v;
    }

    function validate(v) {
      var e = {};
      if (!v.name.trim()) e.name = 'Please enter your name.';
      if (!v.email.trim()) e.email = 'Please enter your email address.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address, for example name@company.com.';
      if (!v.projectType) e.projectType = 'Please choose the type of project.';
      if (v.details.trim().length < 20) e.details = 'Please add a few sentences about your project (at least 20 characters).';
      if (v.details.length > 5000) e.details = 'Please keep project details under 5,000 characters.';
      return e;
    }

    function setFieldError(n, msg) {
      var input = field(n);
      if (!input) return;
      var errId = 'contact-' + n + '-error';
      var existing = document.getElementById(errId);
      if (existing) existing.remove();
      var described = (input.getAttribute('aria-describedby') || '').split(' ').filter(function (id) { return id && id !== errId; });
      input.classList.toggle('border-jp-error', !!msg);
      input.classList.toggle('border-jp-slate/80', !msg);
      if (msg) {
        input.setAttribute('aria-invalid', 'true');
        var p = document.createElement('p');
        p.id = errId;
        p.className = 'mt-2 text-sm font-medium text-jp-error';
        p.textContent = msg;
        input.insertAdjacentElement('afterend', p);
        described.push(errId);
      } else {
        input.setAttribute('aria-invalid', 'false');
      }
      if (described.length) input.setAttribute('aria-describedby', described.join(' '));
      else input.removeAttribute('aria-describedby');
    }

    function renderSummary(errors) {
      var old = document.getElementById('contact-error-summary');
      if (old) old.remove();
      var keys = ORDER.filter(function (n) { return errors[n]; });
      if (!keys.length) return null;
      var box = document.createElement('div');
      box.id = 'contact-error-summary';
      box.tabIndex = -1;
      box.setAttribute('role', 'alert');
      box.setAttribute('aria-labelledby', 'contact-error-title');
      box.className = 'border-l-2 border-jp-error bg-jp-white p-5';
      var title = document.createElement('p');
      title.id = 'contact-error-title';
      title.className = 'font-medium text-jp-ink';
      title.textContent = 'Please fix ' + (keys.length === 1 ? 'the following' : 'these ' + keys.length) + ' before continuing:';
      var ul = document.createElement('ul');
      ul.className = 'mt-2 list-disc space-y-1 pl-5 text-sm';
      keys.forEach(function (n) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'link text-jp-error';
        a.href = '#contact-' + n;
        a.textContent = errors[n];
        a.addEventListener('click', function (e) { e.preventDefault(); field(n).focus(); });
        li.appendChild(a);
        ul.appendChild(li);
      });
      box.appendChild(title);
      box.appendChild(ul);
      var anchor = form.querySelector('[data-required-note]');
      form.insertBefore(box, anchor);
      return box;
    }

    function showStatus(html, focus) {
      status.innerHTML = html;
      if (focus) status.focus();
    }

    function emailLink() {
      return '<a class="link text-jp-navy" href="mailto:' + EMAIL + '">' + EMAIL + '</a>';
    }

    // Clear a field's error as soon as it is edited.
    ORDER.forEach(function (n) {
      var input = field(n);
      if (!input) return;
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') {
          setFieldError(n, '');
          var remaining = ORDER.filter(function (k) { var el = field(k); return el && el.getAttribute('aria-invalid') === 'true'; });
          var errs = {};
          remaining.forEach(function (k) { errs[k] = document.getElementById('contact-' + k + '-error') && document.getElementById('contact-' + k + '-error').textContent; });
          renderSummary(errs);
        }
      });
    });

    function mailtoHref(v) {
      var details = v.details.trim();
      if (details.length > 1500) details = details.slice(0, 1500) + '… (truncated — please paste the rest of your message here)';
      var lines = ['Name: ' + v.name.trim(), 'Email: ' + v.email.trim()];
      if (v.business.trim()) lines.push('Business: ' + v.business.trim());
      lines.push('Project type: ' + v.projectType, '', details);
      return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Project enquiry — ' + (v.projectType || 'General')) +
        '&body=' + encodeURIComponent(lines.join('\n'));
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = values();
      var errors = validate(v);
      ORDER.forEach(function (n) { setFieldError(n, errors[n] || ''); });
      var summary = renderSummary(errors);
      if (summary) {
        showStatus('', false);
        summary.focus();
        return;
      }

      if (!endpoint) {
        window.location.href = mailtoHref(v);
        showStatus(
          '<p class="border-l-2 border-jp-navy bg-jp-white p-5 text-jp-slate">Your email app should now open with your message ready to send. If nothing happened, please email ' +
            emailLink() + ' directly.</p>',
          true,
        );
        return;
      }

      submit.disabled = true;
      submitLabel.textContent = 'Sending…';
      var controller = 'AbortController' in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (controller) controller.abort(); }, 15000);
      fetch(endpoint, {
        method: 'POST',
        signal: controller ? controller.signal : undefined,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: v.name.trim(),
          email: v.email.trim(),
          business: v.business.trim(),
          projectType: v.projectType,
          details: v.details.trim(),
          _subject: 'New enquiry via website — ' + v.projectType,
          _gotcha: v.hpField,
        }),
      })
        .then(function (res) {
          clearTimeout(timer);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          var done = document.createElement('div');
          done.tabIndex = -1;
          done.setAttribute('role', 'status');
          done.className = 'border border-jp-border bg-jp-white p-8 sm:p-10';
          done.innerHTML =
            '<h2 class="text-h3 text-jp-navy">Thank you — your enquiry has been received.</h2>' +
            '<p class="mt-4 text-jp-slate">We will reply to the email address you provided. If your enquiry is urgent, you can also email ' +
            emailLink() + '.</p>';
          form.replaceWith(done);
          done.focus();
        })
        .catch(function () {
          clearTimeout(timer);
          submit.disabled = false;
          submitLabel.textContent = 'Send Enquiry';
          showStatus(
            '<p role="alert" class="border-l-2 border-jp-error bg-jp-white p-5 text-jp-ink">Sorry — your enquiry could not be sent. Please try again, or email ' +
              emailLink() + ' directly.</p>',
            true,
          );
        });
    });
  }

  /* ------------------------------------------------------------------
     6. Footer year
     ------------------------------------------------------------------ */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  updateHeader();
})();
