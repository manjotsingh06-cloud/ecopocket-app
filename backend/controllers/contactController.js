const ContactMessage = require('../models/ContactMessage');
const sendEmail = require('../utils/sendEmail');

async function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    const doc = await ContactMessage.create({ name, email, subject, message });

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New contact message: ${subject || 'General enquiry'}`,
      html: `<p><b>${name}</b> (${email}) wrote:</p><p>${message}</p>`,
    });

    res.status(201).json({ success: true, message: "Message sent — we'll reply within 2 business days.", id: doc._id });
  } catch (err) {
    next(err);
  }
}

async function getMessages(req, res, next) {
  try {
    const messages = await ContactMessage.find().sort('-createdAt');
    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
}

async function updateMessageStatus(req, res, next) {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: msg });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitContact, getMessages, updateMessageStatus };
