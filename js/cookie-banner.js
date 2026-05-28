(function () {
  var KEY = 'homa_cookie_consent';
  var consent = localStorage.getItem(KEY);

  /* ── YouTube helpers ── */
  function activateYouTube() {
    document.querySelectorAll('[data-yt-src]').forEach(function (wrap) {
      var src = wrap.getAttribute('data-yt-src');
      var title = wrap.getAttribute('data-yt-title') || 'Homa-Hof Heiligenberg';
      wrap.innerHTML =
        '<iframe src="' + src + '" width="100%" height="100%" frameborder="0" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        'allowfullscreen loading="lazy" title="' + title + '"></iframe>';
    });
  }

  function blockYouTube() {
    document.querySelectorAll('[data-yt-src]').forEach(function (wrap) {
      wrap.innerHTML =
        '<div class="yt-blocked">' +
          '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
          '<p>Dieses Video wird von YouTube bereitgestellt.<br>Zum Abspielen YouTube-Cookies akzeptieren.</p>' +
          '<button onclick="homaCookieAcceptAll()">Akzeptieren &amp; Video laden</button>' +
        '</div>';
    });
  }

  /* ── Global API ── */
  window.homaCookieAcceptAll = function () {
    localStorage.setItem(KEY, 'accepted');
    activateYouTube();
    var banner = document.getElementById('cookie-banner');
    if (banner) dismiss(banner);
  };

  window.resetCookieConsent = function () {
    localStorage.removeItem(KEY);
    location.reload();
  };

  /* ── On DOM ready: apply stored state ── */
  document.addEventListener('DOMContentLoaded', function () {
    if (consent === 'accepted') { activateYouTube(); }
    else { blockYouTube(); }
    if (!consent) { injectBanner(); }
  });

  /* ── Banner ── */
  function dismiss(el) {
    el.style.transition = 'transform 0.35s ease';
    el.style.transform = 'translateY(100%)';
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 380);
  }

  function injectBanner() {
    var style = document.createElement('style');
    style.textContent =
      '#cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#FFFCF5;border-top:1px solid #EDD9A8;box-shadow:0 -4px 28px rgba(42,21,5,0.1);transform:translateY(100%);transition:transform 0.4s ease}' +
      '#cookie-banner.cb-in{transform:translateY(0)}' +
      '.cb-inner{max-width:1440px;margin:0 auto;padding:18px 48px;display:flex;align-items:center;gap:28px;flex-wrap:wrap}' +
      '.cb-text{flex:1;min-width:200px;font-family:Raleway,system-ui,sans-serif;font-size:14px;font-weight:300;color:#5A3A18;line-height:1.6}' +
      '.cb-text a{color:#C07818;text-decoration:underline}' +
      '.cb-actions{display:flex;gap:10px;flex-shrink:0}' +
      '.cb-btn{font-family:Raleway,system-ui,sans-serif;font-size:14px;font-weight:500;border-radius:50px;padding:10px 22px;cursor:pointer;white-space:nowrap;transition:all 0.2s}' +
      '.cb-decline{background:#fff;color:#5A3A18;border:1.5px solid #c8b48a}' +
      '.cb-decline:hover{border-color:#C07818;color:#C07818}' +
      '.cb-accept{background:#C07818;color:#fff;border:1.5px solid #C07818}' +
      '.cb-accept:hover{background:#8A2A08;border-color:#8A2A08}' +
      '.yt-blocked{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;height:100%;min-height:200px;background:#f5ede0;color:#5A3A18;font-family:Raleway,system-ui,sans-serif;text-align:center;padding:32px 24px}' +
      '.yt-blocked svg{opacity:.45}' +
      '.yt-blocked p{font-size:14.5px;font-weight:300;line-height:1.65;max-width:360px}' +
      '.yt-blocked button{font-family:Raleway,system-ui,sans-serif;font-size:14px;font-weight:500;color:#fff;background:#C07818;border:none;border-radius:50px;padding:10px 24px;cursor:pointer;transition:background 0.2s}' +
      '.yt-blocked button:hover{background:#8A2A08}' +
      '@media(max-width:768px){.cb-inner{padding:16px 20px;gap:12px}.cb-actions{width:100%}.cb-btn{flex:1;text-align:center}}';
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML =
      '<div class="cb-inner">' +
        '<p class="cb-text">Diese Website verwendet Cookies und bindet externe Inhalte (YouTube) ein. ' +
        'Technisch notwendige Cookies sind immer aktiv. ' +
        '<a href="datenschutz.html">Datenschutzerklärung</a></p>' +
        '<div class="cb-actions">' +
          '<button class="cb-btn cb-decline" id="cb-decline">Ablehnen</button>' +
          '<button class="cb-btn cb-accept" id="cb-accept">Alle akzeptieren</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { banner.classList.add('cb-in'); });
    });

    document.getElementById('cb-accept').addEventListener('click', function () {
      localStorage.setItem(KEY, 'accepted');
      activateYouTube();
      dismiss(banner);
    });
    document.getElementById('cb-decline').addEventListener('click', function () {
      localStorage.setItem(KEY, 'declined');
      dismiss(banner);
    });
  }
})();
