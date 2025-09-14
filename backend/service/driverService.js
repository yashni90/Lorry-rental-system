const Driver = require('../models/Driver');

// Create
const createDriver = async (data) => {
  const driver = new Driver(data);
  return await driver.save();
};

// Read all
const getDrivers = async () => {
  return await Driver.find();
};

// Read one
const getDriverById = async (id) => {
  return await Driver.findById(id);
};

// Update
const updateDriver = async (id, data) => {
  return await Driver.findByIdAndUpdate(id, data, { new: true });
};

// Delete
const deleteDriver = async (id) => {
  return await Driver.findByIdAndDelete(id);
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
