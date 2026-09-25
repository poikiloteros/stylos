(function () {
  try {
    var k = localStorage.getItem('stylos-ink');
    if (k !== 'blue' && k !== 'green' && k !== 'wax') return;
    var r = document.documentElement;
    r.classList.remove('t-green', 't-wax');
    if (k !== 'blue') r.classList.add('t-' + k);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', k === 'wax' ? '#ece6d6' : k === 'green' ? '#092c2a' : '#07264c');
    var ic = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if (ic && k !== 'green') ic.setAttribute('href', './assets/icons/favicon-' + k + '.svg');
  } catch (err) {}
})();
