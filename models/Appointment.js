const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    datetime: {type: Date, required: true},
    clientName: {type: String, required: true},
    phone: {type: String},
    isBooked: {type: Boolean, default: false},
    isCompleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Appointment', AppointmentSchema);