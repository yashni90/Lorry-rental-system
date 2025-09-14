const express = require('express');
const router = express.Router();
const driverController = require('../controller/driverController');


router.post('/', driverController.addDriver);
router.get('/', driverController.getAllDrivers);
router.get('/:id', driverController.getDriver);
router.put('/:id', driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);

module.exports = router;
