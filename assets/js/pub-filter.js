document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('pub-list');
  if (!container) return;

  var originalHTML = container.innerHTML;
  var entries = Array.prototype.slice.call(container.querySelectorAll('.pub-entry'));
  var buttons = document.querySelectorAll('.pub-filter-btn');

  function setActive(activeBtn) {
    buttons.forEach(function (b) { b.classList.remove('active'); });
    activeBtn.classList.add('active');
  }

  function showDefault() {
    container.innerHTML = originalHTML;
  }

  function showFirstAuthorOnly() {
    container.innerHTML = '';
    var shown = 0;
    entries.forEach(function (e) {
      if (e.getAttribute('data-first') === 'true') {
        container.appendChild(e.cloneNode(true));
        shown++;
      }
    });
    if (!shown) {
      var p = document.createElement('p');
      p.className = 'pub-meta';
      p.textContent = 'No entries to show.';
      container.appendChild(p);
    }
  }

  function showByYear() {
    container.innerHTML = '';
    var groups = {};
    var order = [];
    entries.forEach(function (e) {
      var y = e.getAttribute('data-year') || 'inprep';
      if (!groups[y]) {
        groups[y] = [];
        order.push(y);
      }
      groups[y].push(e);
    });
    order.sort(function (a, b) {
      if (a === 'inprep') return -1;
      if (b === 'inprep') return 1;
      return Number(b) - Number(a);
    });
    order.forEach(function (y) {
      var label = document.createElement('p');
      label.className = 'pub-group-label';
      label.textContent = (y === 'inprep') ? 'In Preparation & Submitted' : y;
      container.appendChild(label);
      groups[y].forEach(function (e) { container.appendChild(e.cloneNode(true)); });
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActive(btn);
      var mode = btn.getAttribute('data-mode');
      if (mode === 'first') showFirstAuthorOnly();
      else if (mode === 'year') showByYear();
      else showDefault();
    });
  });
});
