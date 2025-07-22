const express = require('express');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admins only' });
  }
  next();
}

router.post('/', auth, isAdmin, async (req, res) => {
  const { title, description, date, price } = req.body;
  try {
    const event = new Event({ title, description, date, price, createdBy: req.user.id });
    await event.save();
    res.json(event);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).send('Server error');
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'username');
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).send('Server error');
  }
});

router.post('/:id/book', auth, async (req, res) => {
  try {
    const existing = await Booking.findOne({ user: req.user.id, event: req.params.id });
    if (existing) return res.status(400).json({ msg: 'Already booked' });
    const booking = new Booking({ user: req.user.id, event: req.params.id });
    await booking.save();
    res.json({ msg: 'Event booked' });
  } catch (err) {
    console.error('Error booking event:', err);
    res.status(500).send('Server error');
  }
});

router.get('/booked', auth, async (req, res) => {
  console.log('GET /booked route hit');
  try {
    console.log('User ID:', req.user.id);
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    console.log('Bookings found:', bookings);
    res.json(bookings.map(b => b.event));
  } catch (err) {
    console.error('Error in /booked:', err);
    res.status(500).send('Server error');
  }
});

router.delete('/:id/book', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ user: req.user.id, event: req.params.id });
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    res.json({ msg: 'Booking deleted' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'username');
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('Error fetching event by id:', err);
    res.status(500).send('Server error');
  }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;