const router = require('express').Router();
const dataRoutes = require('./routes/dataRoutes.js');

router.use('/data', dataRoutes);

module.exports = router; 