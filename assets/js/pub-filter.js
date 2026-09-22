document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('pub-list');
  if (!container) return;

  var originalHTML = container.innerHTML;
  var entries = Array.prototype.slice.call(container.querySelectorAll('.pub-entry'));
  var allBtn = document.querySelector('.pub-filter-btn[data-mode="default"]');
  var firstBtn = document.querySelector('.pub-filter-btn[data-mode="first"]');
  var yearSelect = document.getElementById('pub-year-select');

  // Collect the real years present (excluding "in preparation / submitted"
  // entries, which have no year yet), newest first, and populate the
  // dropdown with them.
  var years = [];
  entries.forEach(function (e) {
    var y = e.getAttribute('data-year');
    if (y && y !== 'inprep' && years.indexOf(y) === -1) years.push(y);
  });
  years.sort(function (a, b) { return Number(b) - Number(a); });

  if (yearSelect) {
    years.forEach(function (y) {
      var opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    });
  }

  function showEmptyMessage() {
    var p = document.createElement('p');
    p.className = 'pub-meta';
    p.textContent = 'No entries to show.';
    container.appendChild(p);
  }

  function clearActive() {
    document.querySelectorAll('.pub-filter-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    if (yearSelect) yearSelect.classList.remove('active');
  }

  function showDefault() {
    clearActive();
    if (allBtn) allBtn.classList.add('active');
    if (yearSelect) yearSelect.value = '';
    container.innerHTML = originalHTML;
  }

  // First-author-only view excludes in-preparation/submitted entries: those
  // haven't been through peer review / author-order finalization yet.
  function showFirstAuthorOnly() {
    clearActive();
    if (firstBtn) firstBtn.classList.add('active');
    if (yearSelect) yearSelect.value = '';
    container.innerHTML = '';
    var shown = 0;
    entries.forEach(function (e) {
      if (e.getAttribute('data-first') === 'true' && e.getAttribute('data-year') !== 'inprep') {
        container.appendChild(e.cloneNode(true));
        shown++;
      }
    });
    if (!shown) showEmptyMessage();
  }

  // Single-year view: also naturally excludes in-preparation/submitted
  // entries, since those carry data-year="inprep" and never match a real
  // year value.
  function showYear(year) {
    clearActive();
    if (yearSelect) {
      yearSelect.value = year;
      yearSelect.classList.add('active');
    }
    container.innerHTML = '';
    var shown = 0;
    entries.forEach(function (e) {
      if (e.getAttribute('data-year') === year) {
        container.appendChild(e.cloneNode(true));
        shown++;
      }
    });
    if (!shown) showEmptyMessage();
  }

  if (allBtn) allBtn.addEventListener('click', showDefault);
  if (firstBtn) firstBtn.addEventListener('click', showFirstAuthorOnly);
  if (yearSelect) {
    yearSelect.addEventListener('change', function () {
      if (yearSelect.value) showYear(yearSelect.value);
      else showDefault();
    });
  }
});
