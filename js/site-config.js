// Shared site config — update here, applies everywhere
var HOMAHOF = {
  paypalUrl: 'https://www.paypal.com/donate/?hosted_button_id=KXFDM88VBHQKC',
  iban: 'DE39690517250002042356',
  bic: 'SOLADES1SAL',
  bank: 'Sparkasse Salem-Heiligenberg',

  spendenInner: function() {
    return [
      '<div class="spenden-inner">',
        '<div class="fade-in">',
          '<div class="spenden-eyebrow">Unterstütze uns</div>',
          '<h2 class="spenden-title">Deine Spende trägt das <em style="font-style:italic;color:var(--gold-light)">Feuer weiter.</em></h2>',
          '<p class="spenden-text">Der Homa-Hof ist ein gemeinnütziger Verein – ermöglicht durch Menschen, die diese Arbeit nicht nur von Herzen, sondern vor allem tatkräftig unterstützen.</p>',
          '<ul class="spenden-bullets">',
            '<li>Tägliche Agnihotra-Zeremonien am Hof</li>',
            '<li>Einführungsabende und Seminare</li>',
            '<li>Pflege und Erhalt des Kraftorts bei Heiligenberg</li>',
          '</ul>',
          '<p class="spenden-text" style="font-size:14px;margin-top:12px;opacity:0.85">Spenden sind steuerabzugsfähig, wobei bis zu einem Betrag von 300 € der Einzahlungsbeleg als Nachweis gilt. Bei höheren Beträgen senden wir dir auf Anfrage gerne eine Bescheinigung zu.</p>',
          '<div class="spenden-buttons">',
            '<a href="' + HOMAHOF.paypalUrl + '" data-paypal target="_blank" rel="noopener" class="btn btn-gold">Jetzt per PayPal spenden</a>',
            '<button onclick="HOMAHOF.scrollToBank()" class="btn btn-outline" type="button">Banküberweisung</button>',
          '</div>',
        '</div>',
        '<div class="spenden-bank fade-in" id="bankverbindung" style="transition-delay:0.15s">',
          '<div class="spenden-bank-title">Bankverbindung</div>',
          '<div class="bank-row"><span class="bank-label">Empfänger</span><span class="bank-value">Homa-Hof Heiligenberg e.V.</span></div>',
          '<div class="bank-row"><span class="bank-label">IBAN</span>',
            '<span class="bank-value" id="iban-value" title="Klicken zum Kopieren" style="cursor:pointer" onclick="HOMAHOF.copyIBAN()">',
              'DE39 6905 1725 0002 0423 56',
              ' <span id="iban-copy-hint" style="font-size:11px;opacity:0.6;margin-left:6px">📋 kopieren</span>',
            '</span></div>',
          '<div class="bank-row"><span class="bank-label">BIC</span><span class="bank-value">' + HOMAHOF.bic + '</span></div>',
          '<div class="bank-row"><span class="bank-label">Bank</span><span class="bank-value">' + HOMAHOF.bank + '</span></div>',
          '<div class="bank-row" style="margin-bottom:0"><span class="bank-label">Verwendungszweck</span><span class="bank-value">Spende Homa-Hof</span></div>',
        '</div>',
      '</div>',
    ].join('');
  },

  newsletterInner: function() {
    return [
      '<div class="newsletter-wrap">',
        '<div class="eyebrow fade-in">Newsletter</div>',
        '<h2 class="section-title fade-in">Impulse vom <em>Homa-Hof</em></h2>',
        '<p class="fade-in">Veranstaltungen, Neuigkeiten und Impulse vom Homa-Hof – direkt in dein Postfach. Kostenlos und jederzeit kündbar.</p>',
        '<form id="newsletter-form" class="newsletter-form fade-in" onsubmit="HOMAHOF.submitNewsletter(event)">',
          '<div style="display:flex;gap:12px">',
            '<input type="text" id="nl-firstname" name="firstname" class="newsletter-input" placeholder="Vorname (optional)" style="flex:1;min-width:0">',
            '<input type="text" id="nl-lastname" name="lastname" class="newsletter-input" placeholder="Nachname (optional)" style="flex:1;min-width:0">',
          '</div>',
          '<input type="email" id="nl-email" name="email" class="newsletter-input" placeholder="Deine E-Mail-Adresse *" required>',
          '<div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden">',
            '<label>Dieses Feld bitte leer lassen <input type="text" id="nl-ref" name="hp_ref" tabindex="-1" autocomplete="off"></label>',
          '</div>',
          '<button type="submit" class="btn btn-gold" id="nl-submit-btn">Jetzt anmelden</button>',
        '</form>',
        '<p class="newsletter-note" id="nl-success" style="display:none;color:var(--gold);font-weight:500">✓ Fast geschafft! Bitte bestätige deine Anmeldung in deiner E-Mail.</p>',
        '<p class="newsletter-note" id="nl-error" style="display:none;color:var(--copper)">Fehler beim Absenden – bitte direkt schreiben: <a href="mailto:info@homa-hof-heiligenberg.de">info@homa-hof-heiligenberg.de</a></p>',
        '<p class="newsletter-note fade-in">Kein Spam. Jederzeit abmeldbar. Datenschutzkonform.</p>',
      '</div>',
    ].join('');
  },

  scrollToBank: function() {
    var bank = document.getElementById('bankverbindung');
    if (!bank) return;
    bank.scrollIntoView({ behavior: 'smooth', block: 'center' });
    bank.style.transition = 'box-shadow 0.3s, outline 0.3s';
    bank.style.outline = '2px solid var(--gold)';
    bank.style.boxShadow = '0 0 0 6px rgba(192,120,24,0.15)';
    setTimeout(function() { bank.style.outline = ''; bank.style.boxShadow = ''; }, 2000);
  },

  copyIBAN: function() {
    navigator.clipboard.writeText(HOMAHOF.iban).then(function() {
      var hint = document.getElementById('iban-copy-hint');
      if (hint) {
        hint.textContent = '✓ kopiert';
        setTimeout(function() { hint.textContent = '📋 kopieren'; }, 2000);
      }
    });
  },

  // Formular-Zeitpunkt, gegen Bots die sofort abschicken
  _formOpened: Date.now(),

  // true = menschlich. Honeypot gefuellt oder unter 3 s abgeschickt = Bot.
  // Nimmt die id des Honeypot-Feldes oder das Formular, in dem es steckt.
  passesBotCheck: function(target) {
    var hp = typeof target === 'string'
      ? document.getElementById(target)
      : (target && target.querySelector ? target.querySelector('[name=hp_ref]') : null);
    if (hp && hp.value.trim() !== '') return false;
    if (Date.now() - HOMAHOF._formOpened < 3000) return false;
    return true;
  },

  submitRepermission: function(e) {
    e.preventDefault();
    var emailVal = document.getElementById('rp-email').value.trim();
    if (!emailVal) return;
    var btn = document.getElementById('rp-submit');
    var firstNameVal = (document.getElementById('rp-firstname').value || '').trim();
    var lastNameVal  = (document.getElementById('rp-lastname').value  || '').trim();

    // Bots sehen dieselbe Bestaetigung, es wird aber nichts gesendet
    if (!HOMAHOF.passesBotCheck('rp-ref')) { HOMAHOF._repermissionDone(); return; }

    btn.disabled = true;
    btn.textContent = 'Einen Moment …';
    fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'form-name': 'newsletter-anmeldung', firstname: firstNameVal, lastname: lastNameVal, email: emailVal }).toString()
    }).then(function() {
      return subscribeToBrevo(emailVal, firstNameVal, lastNameVal, 'Repermission 2026');
    }).then(function() {
      HOMAHOF._repermissionDone();
    }).catch(function() {
      btn.disabled = false;
      btn.textContent = 'Ja, ich bleibe dabei';
      document.getElementById('rp-error').style.display = 'block';
    });
  },

  _repermissionDone: function() {
    var form = document.getElementById('rp-form');
    if (form) form.style.display = 'none';
    var hint = document.getElementById('rp-hint');
    if (hint) hint.style.display = 'none';
    var intro = document.getElementById('rp-intro');
    if (intro) {
      intro.innerHTML = 'Fast geschafft. Wir haben dir eine Mail geschickt \u2014 bitte klicke den ' +
        'Bestätigungslink darin, dann bleibst du im Verteiler. Schau notfalls auch im Spam-Ordner nach.';
    }
    var title = document.querySelector('.thank-title');
    if (title) title.innerHTML = 'Nur noch <em>ein Klick</em>';
  },

  submitNewsletter: function(e) {
    e.preventDefault();
    var firstNameVal = (document.getElementById('nl-firstname').value || '').trim();
    var lastNameVal  = (document.getElementById('nl-lastname').value  || '').trim();
    var emailVal     = document.getElementById('nl-email').value.trim();
    if (!emailVal) return;
    if (!HOMAHOF.passesBotCheck('nl-ref')) { window.location.href = '/danke-newsletter'; return; }
    var btn = document.getElementById('nl-submit-btn');
    btn.disabled = true;
    var interests = [];
    document.querySelectorAll('#newsletter-form input[name="interesse"]:checked').forEach(function(cb) {
      interests.push(cb.value);
    });
    fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'form-name': 'newsletter-anmeldung', firstname: firstNameVal, lastname: lastNameVal, email: emailVal }).toString()
    }).then(function() {
      return subscribeToBrevo(emailVal, firstNameVal, lastNameVal, 'Newsletter-Formular', interests);
    }).then(function() {
      window.location.href = '/danke-newsletter';
    }).catch(function() {
      btn.disabled = false;
      document.getElementById('nl-error').style.display = 'block';
    });
  },
};

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-paypal]').forEach(function(el) {
    el.href = HOMAHOF.paypalUrl;
  });

  var spendenEl = document.getElementById('spenden');
  if (spendenEl) spendenEl.innerHTML = HOMAHOF.spendenInner();

  var newsletterEl = document.getElementById('newsletter');
  if (newsletterEl) newsletterEl.innerHTML = HOMAHOF.newsletterInner();

  // Repermission: Adresse kommt im Fragment, damit sie nicht in Server-Logs landet
  var rpEmail = document.getElementById('rp-email');
  if (rpEmail && window.location.hash) {
    try {
      var hp = new URLSearchParams(window.location.hash.slice(1));
      if (hp.get('e')) {
        rpEmail.value = hp.get('e').trim();
        if (hp.get('v')) document.getElementById('rp-firstname').value = hp.get('v').trim();
        if (hp.get('n')) document.getElementById('rp-lastname').value  = hp.get('n').trim();
      }
      history.replaceState(null, '', window.location.pathname);
    } catch (err) {}
  }
  HOMAHOF._formOpened = Date.now();

  // Re-observe fade-in elements in dynamically injected sections
  if (window._fadeObserver) {
    ['#spenden .fade-in', '#newsletter .fade-in'].forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        window._fadeObserver.observe(el);
      });
    });
  }
});

// Brevo DOI opt-in — gibt Promise zurück damit submitNewsletter warten kann
function subscribeToBrevo(email, firstName, lastName, source, interests) {
  if (!email) return Promise.resolve();
  return fetch('/.netlify/functions/brevo-subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      firstName: firstName || '',
      lastName: lastName || '',
      source: source || 'Website',
      interests: interests || [],
    }),
  }).catch(function() {});
}
