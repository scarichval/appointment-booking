const Appointment = require('../models/Appointment')
const express = require('express');
const router = express.Router();

// POST to create an appointment slot
router.post('/', async (req, res) => {
  const io = req.app.get('io');
  const { datetime, clientName } = req.body;
  if (!datetime) return res.status(400).json({ message: "Date is required" });
  if (!clientName) return res.status(400).json({ message: "clientName is required" });

  const existing = await Appointment.findOne({ datetime });
  if (existing) {
    return res.status(409).json({ message: "Time slot already booked" });
  }
  const newApptmnt = new Appointment({ datetime, clientName });

  try {
    await newApptmnt.save();
    io.emit('new-appointment', newApptmnt);
    res.status(201).json(newApptmnt);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
});


// GET all appointments
router.get('/', async (req, res) => {
  try {
    const appointment = await Appointment.find().sort({ datetime: 1 });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});


// Update appointments

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Appointment.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      const io = req.app.get('io');
      io.emit('appointment-deleted', id); 
      return res.sendStatus(204); // No Content
    } else {
      return res.status(404).json({ message: "Appointment not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error deleting", error: error.message });
  }
});


// PUT to book/unbook an appointment

module.exports = router;