/* stamp&seal — interactive bits.
   Model data is injected from index.html as window.STAMP_MODELS. */

(function () {
  'use strict';

  var PX_PER_MM = 3.78; // roughly life size on a standard screen
  var models = window.STAMP_MODELS || [];

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- catalogue filters ---------- */
  var chips = document.querySelectorAll('.chip');
  var groups = document.querySelectorAll('.group');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var want = chip.dataset.filter;
      chips.forEach(function (c) { c.classList.toggle('is-on', c === chip); });
      groups.forEach(function (g) {
        g.hidden = !(want === 'all' || g.dataset.group === want);
      });
    });
  });

  /* ---------- stamp builder ---------- */
  var textEl   = document.getElementById('stampText');
  var modelEl  = document.getElementById('stampModel');
  var stampEl  = document.getElementById('impression');
  var innerEl  = document.getElementById('impressionInner');
  var scaleEl  = document.getElementById('toolScale');
  var hintEl   = document.getElementById('toolHint');
  var quoteEl  = document.getElementById('quoteLink');

  if (!textEl || !modelEl || !stampEl) return;

  // Fill the model dropdown, grouped the same way as the catalogue.
  var groupNames = {
    self: 'Self-inking stamps',
    hb: 'HB stamps',
    trodat: 'Trodat stamps',
    dater: 'Trodat daters'
  };
  var seen = {};
  models.forEach(function (m) {
    var key = groupKey(m.id);
    if (!seen[key]) {
      seen[key] = document.createElement('optgroup');
      seen[key].label = groupNames[key] || 'Stamps';
      modelEl.appendChild(seen[key]);
    }
    var opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.id + ' — ' + m.size;
    seen[key].appendChild(opt);
  });

  function groupKey(id) {
    if (/^HB/i.test(id)) return 'hb';
    if (/^Trodat 4(810|850|750|727)/i.test(id)) return 'dater';
    if (/^Trodat/i.test(id)) return 'trodat';
    return 'self';
  }

  modelEl.value = 'Trodat 4913';

  function currentModel() {
    return models.filter(function (m) { return m.id === modelEl.value; })[0] || models[0];
  }

  function currentInk() {
    var checked = document.querySelector('input[name="ink"]:checked');
    return checked ? checked.value : '#1E1A17';
  }

  function render() {
    var m = currentModel();
    if (!m) return;

    var lines = textEl.value.split('\n').map(function (s) { return s.trim(); })
                            .filter(function (s) { return s.length; });
    if (!lines.length) lines = ['Your text here'];

    // Long side runs horizontally, the way the die is normally set.
    var wideMm = Math.max(m.w, m.h);
    var tallMm = Math.min(m.w, m.h);
    if (m.shape === 'round') { wideMm = m.w; tallMm = m.w; }

    // Fit the drawing inside the stage if the real size is wider than the panel.
    var stageW = stampEl.parentElement.clientWidth - 24;
    var ppm = PX_PER_MM;
    if (wideMm * ppm > stageW) ppm = stageW / wideMm;

    var w = Math.round(wideMm * ppm);
    var h = Math.round(tallMm * ppm);

    stampEl.style.width = w + 'px';
    stampEl.style.height = h + 'px';
    stampEl.dataset.shape = m.shape;
    stampEl.style.setProperty('--ink-color', currentInk());

    // Usable text box: round dies lose the corners.
    var boxW = m.shape === 'round' ? w * 0.66 : w - 10;
    var boxH = m.shape === 'round' ? h * 0.66 : h - 8;

    var longest = lines.reduce(function (a, b) { return a.length > b.length ? a : b; }).length;
    var byHeight = boxH / (lines.length * 1.25);
    var byWidth  = boxW / (longest * 0.56);
    var size = Math.max(4, Math.min(byHeight, byWidth, 22));

    innerEl.style.fontSize = size.toFixed(2) + 'px';
    innerEl.innerHTML = '';
    lines.forEach(function (line) {
      var span = document.createElement('span');
      span.textContent = line;
      innerEl.appendChild(span);
    });

    var atSize = Math.abs(ppm - PX_PER_MM) < 0.01;
    scaleEl.textContent = atSize
      ? 'Shown at roughly life size — ' + m.size
      : 'Scaled down to fit — actual die is ' + m.size;

    hintEl.textContent = lines.length > linesAllowed(m.lines)
      ? m.id + ' is rated for ' + m.lines.toLowerCase() + '. You have ' + lines.length +
        ' — it will still fit, but the text gets small. A larger model reads better.'
      : m.id + ' is rated for ' + m.lines.toLowerCase() + '.';
  }

  function linesAllowed(label) {
    var nums = label.match(/\d+/g);
    return nums ? Math.max.apply(null, nums.map(Number)) : 99;
  }

  ['input', 'change'].forEach(function (evt) {
    textEl.addEventListener(evt, render);
    modelEl.addEventListener(evt, render);
  });
  document.querySelectorAll('input[name="ink"]').forEach(function (r) {
    r.addEventListener('change', render);
  });
  window.addEventListener('resize', render);

  /* Copy the spec so it can be pasted straight into a message. */
  if (quoteEl) {
    quoteEl.addEventListener('click', function () {
      var m = currentModel();
      var inkName = document.querySelector('input[name="ink"]:checked')
        .parentElement.textContent.trim();
      var spec = 'Stamp enquiry\nModel: ' + m.id + ' (' + m.size + ')\nInk: ' + inkName +
                 '\nWording:\n' + textEl.value.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(spec).then(function () {
          quoteEl.textContent = 'Copied — paste it into the message';
          setTimeout(function () {
            quoteEl.textContent = 'Send this to us for a quote';
          }, 4000);
        }).catch(function () { /* clipboard blocked; the link still opens */ });
      }
    });
  }

  render();
})();
