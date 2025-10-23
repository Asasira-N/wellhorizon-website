require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

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

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Mail options
    const mailOptions = {
      from: process.env.FROM_EMAIL || email,
      to: process.env.TO_EMAIL,
      subject: `[Website Contact] ${subject || 'New message from website'}`,
      text:
        `You have a new message from the website contact form:\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Subject: ${subject || '(none)'}\n\n` +
        `Message:\n${message}\n`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

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
