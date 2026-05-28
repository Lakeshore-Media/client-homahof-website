// Shared site config — update here, applies everywhere
var HOMAHOF = {
  paypalUrl: 'https://www.paypal.com/donate?token=odLeAhP4jD14M9gNrZs5BjdVjXTxE46Ivlctw1Sl6zBK2_nrI6q-gkrecfLvFVapqgr6P_Tcags9D5Wm&locale.x=DE',
  iban: 'DE39690517250002042356',
  bic: 'SOLADES1KNZ',
  bank: 'Sparkasse Bodensee',
};

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-paypal]').forEach(function(el) {
    el.href = HOMAHOF.paypalUrl;
  });
});
