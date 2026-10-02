require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://medposadmin:furyisop56@cluster0.2ejaczs.mongodb.net/medical_store_pos?appName=Cluster0');

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Routes
const authRouter = require('./routes/auth');
const medicinesRouter = require('./routes/medicines');
const salesRouter = require('./routes/sales');
const { protect } = require('./middleware/auth');

app.use('/api/auth', authRouter);
app.use('/api/medicines', protect, medicinesRouter);
app.use('/api/sales', protect, salesRouter);

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
