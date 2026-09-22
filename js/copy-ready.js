document.documentElement.classList.add('js', 'intro-locked');

window.COPY_READY = (function () {
  var settle, done = false;
  var p = new Promise(function (r) { settle = r; });
  window.__copyDone = function (v) { if (!done) { done = true; settle(v || null); } };
  setTimeout(function () { window.__copyDone(null); }, 2200);
  return p;
})();
