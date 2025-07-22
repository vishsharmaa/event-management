const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admins only' });
  }
  next();
}

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    const role = username.trim().toLowerCase() === 'admin' ? 'admin' : 'user';
    user = new User({ username, password: await bcrypt.hash(password, 10), role });
    await user.save();
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, username: user.username, role: user.role });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    let role = user.role;
    if (username.trim().toLowerCase() === 'admin' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      role = 'admin';
    }
    const payload = { user: { id: user.id, role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, username: user.username, role });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'id username role');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
router.post('/feedbacks', auth, async (req, res) => {
  try {
    const feedback = new Feedback({ user: req.user.id, message: req.body.message });
    await feedback.save();
    res.json({ msg: 'Feedback submitted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});
router.get('/feedbacks', auth, isAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user', 'username').sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router; 