require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const accountRoutes = require('./routes/accountRoutes');
const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static('public'));
app.use(express.json());
app.use('/api/accounts', accountRoutes);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
