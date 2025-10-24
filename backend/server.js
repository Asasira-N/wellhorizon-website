require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Resend } = require('resend');

 
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend client
const resend = new Resend({ apiKey: process.env.RESEND_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Contact POST route ----------
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Name, email and message are required.' });
    }



    // Send email via Resend
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `[Website Contact] ${subject || 'New message from website'}`,
      html: `
        <h3>New message from website contact form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || '(none)'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

   console.log('Resend response:', response);
    return res.json({ ok: true, message: 'Message sent successfully.' });

  } catch (err) {
    console.error('Error in /api/contact:', err);
    return res.status(500).json({ ok: false, error: 'Server error. Could not send message.' });
  }
});


// 🟢 FIXED fallback route — note the leading slash before *
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
