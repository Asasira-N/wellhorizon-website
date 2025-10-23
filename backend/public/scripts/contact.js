document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // basic client validation
    if (!name || !email || !message) {
      showMessage('Please fill name, email and message.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        showMessage('🎉 Message sent. We will reply soon.', 'success');
        contactForm.reset();
      } else {
        showMessage(data.error || 'Failed to send message.', 'error');
      }
    } catch (err) {
      console.error('Contact submit error', err);
      showMessage('Unable to send message. Try again later.', 'error');
    }
  });

  function showMessage(text, type = 'info') {
    // create/replace inline message at top of form
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = `form-message ${type}`;
    msg.textContent = text;
    const form = contactForm;
    form.insertBefore(msg, form.firstChild);
    setTimeout(() => msg.remove(), 6000);
  }
});

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const subject = document.querySelector('#subject').value.trim();
  const message = document.querySelector('#message').value.trim();
  const statusEl = document.querySelector('#form-status');

  statusEl.textContent = "Sending...";
  statusEl.style.color = "orange";

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await res.json();
    if (data.ok) {
      statusEl.textContent = "✅ Message sent successfully!";
      statusEl.style.color = "green";
      e.target.reset();
    } else {
      statusEl.textContent = "❌ " + (data.error || "Could not send message.");
      statusEl.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = "❌ Network or server error. Try again.";
    statusEl.style.color = "red";
  }
});
