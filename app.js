const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

// Import routes 
const appointmentsRoutes = require('./routes/appointments.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.2.182:5173"],
        methods: ["GET", "POST"]
    } 
});

// Store io in app locals so routes can access it
app.set('io', io);

app.use(cors({
    origin: ["http://localhost:5173", "http://192.168.2.182:5173"]
}));

app.use(express.json());

// connecting to mongoose
mongoose.connect('mongodb://localhost:27017/quickslots', {})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(error => console.log('❌ MongoDB connection error: ', error));

// Use routes
app.use('/api/appointments', appointmentsRoutes);

// listen
const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
})


module.exports = app;
