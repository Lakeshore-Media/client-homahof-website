// Shared site config — update here, applies everywhere
var HOMAHOF = {
  paypalUrl: 'https://www.paypal.com/donate?token=gz4U8careXbDl8W_N6fNKGuRi90bScKiMu5bZ9o7qAGFw0WwVKfDtkw0pfWKgF_OmPYle51z0ajAOr0b&locale.x=DE',
  iban: 'DE39690517250002042356',
  bic: 'SOLADES1KNZ',
  bank: 'Sparkasse Bodensee',
};

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-paypal]').forEach(function(el) {
    el.href = HOMAHOF.paypalUrl;
  });
});

// Brevo newsletter opt-in — feuert still im Hintergrund, blockiert nie den Form-Submit
function subscribeToBrevo(email, firstName, lastName, source) {
  if (!email) return;
  fetch('/.netlify/functions/brevo-subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      firstName: firstName || '',
      lastName: lastName || '',
      source: source || 'Website',
    }),
  }).catch(function() {}); // fail silent — Netlify-Formular hat bereits gespeichert
}
