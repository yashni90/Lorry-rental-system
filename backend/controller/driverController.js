const driverService = require('../service/driverService');

// Create driver
const addDriver = async (req, res) => {
  try {
    const driver = await driverService.createDriver(req.body);
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getDrivers();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get driver by ID
const getDriver = async (req, res) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update driver
const updateDriver = async (req, res) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete driver
const deleteDriver = async (req, res) => {
  try {
    const driver = await driverService.deleteDriver(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json({ message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addDriver,
  getAllDrivers,
  getDriver,
  updateDriver,
  deleteDriver,
};
