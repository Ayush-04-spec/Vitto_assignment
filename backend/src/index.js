require('dotenv').config();
const express = require('express');
const cors = require('cors');
const applicationsRouter = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api', applicationsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
