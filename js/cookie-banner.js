(function () {
  var KEY = 'homa_notice_seen';
  if (localStorage.getItem(KEY)) return;

  document.addEventListener('DOMContentLoaded', function () {
    var style = document.createElement('style');
    style.textContent =
      '#priv-notice{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#2A1505;border-top:1px solid rgba(192,120,24,0.35);transform:translateY(100%);transition:transform 0.4s ease}' +
      '#priv-notice.pn-in{transform:translateY(0)}' +
      '.pn-inner{max-width:1440px;margin:0 auto;padding:14px 48px;display:flex;align-items:center;gap:20px;flex-wrap:wrap}' +
      '.pn-text{flex:1;min-width:200px;font-family:Raleway,system-ui,sans-serif;font-size:13.5px;font-weight:300;color:rgba(255,255,255,0.75);line-height:1.55}' +
      '.pn-text a{color:rgba(245,216,138,0.85);text-decoration:underline}' +
      '.pn-close{flex-shrink:0;background:none;border:none;color:rgba(255,255,255,0.45);font-size:20px;line-height:1;cursor:pointer;padding:4px 8px;transition:color 0.2s}' +
      '.pn-close:hover{color:#fff}' +
      '@media(max-width:768px){.pn-inner{padding:12px 20px;gap:12px}}';
    document.head.appendChild(style);

    var el = document.createElement('div');
    el.id = 'priv-notice';
    el.innerHTML =
      '<div class="pn-inner">' +
        '<p class="pn-text">Diese Website verzichtet auf Tracking-Cookies und nutzt YouTube ausschließlich im Datenschutzmodus (youtube-nocookie.com). Schriften werden lokal ausgeliefert. ' +
        '<a href="datenschutz.html">Datenschutzerklärung</a></p>' +
        '<button class="pn-close" aria-label="Schließen">×</button>' +
      '</div>';
    document.body.appendChild(el);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.add('pn-in'); });
    });

    el.querySelector('.pn-close').addEventListener('click', function () {
      localStorage.setItem(KEY, '1');
      el.style.transition = 'transform 0.3s ease';
      el.style.transform = 'translateY(100%)';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    });
  });

  /* Footer reset link support */
  window.resetCookieConsent = function () {
    localStorage.removeItem(KEY);
    location.reload();
  };
})();
