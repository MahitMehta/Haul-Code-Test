const express = require('express');
const path = require('path');
const routes = require('./Routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '/client/build')));

app.use('/api', routes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});