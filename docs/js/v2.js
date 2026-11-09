/* Contact form. Delegated from document because pages swap in by AJAX. */
(function () {
  var ENDPOINT = 'https://formsubmit.co/ajax/hello@allears.nz';

  function show(form, html) {
    var box = document.createElement('div');
    box.className = 'v2-form-msg';
    box.setAttribute('role', 'status');
    box.innerHTML = html;
    form.innerHTML = '';
    form.appendChild(box);
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.id !== 'enquiry-form') return;
    e.preventDefault();

    var thanks = '<h4>Thanks, we\'ve got it.</h4><p>We\'ll get back to you as soon as we can.</p>';
    var failed = '<h4>That didn\'t send.</h4><p>Sorry about that. Please email ' +
      '<a href="mailto:hello@allears.nz">hello@allears.nz</a> or call ' +
      '<a href="tel:+64211780355">021 178 0355</a> and we\'ll sort you out.</p>';

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    if (data._honey) { show(form, thanks); return; }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); }).then(function (res) {
      var ok = res && (res.success === true || res.success === 'true');
      show(form, ok ? thanks : failed);
    }).catch(function () { show(form, failed); });
  });
})();
