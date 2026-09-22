const Newsletter = require('../models/Newsletter');

async function subscribe(req, res, next) {
  try {
    const { email } = req.body;
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      existing.active = true;
      await existing.save();
      return res.json({ success: true, message: 'You are already subscribed — welcome back!' });
    }
    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed! Welcome to the pocket.' });
  } catch (err) {
    next(err);
  }
}

async function unsubscribe(req, res, next) {
  try {
    await Newsletter.findOneAndUpdate({ email: req.body.email }, { active: false });
    res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (err) {
    next(err);
  }
}

async function getSubscribers(req, res, next) {
  try {
    const subscribers = await Newsletter.find().sort('-createdAt');
    res.json({ success: true, count: subscribers.length, subscribers });
  } catch (err) {
    next(err);
  }
}

module.exports = { subscribe, unsubscribe, getSubscribers };
