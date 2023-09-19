const { StatusCodes } = require('http-status-codes');

const CustomError = require('../errors');

const createFacility = async (req, res) => {
  res.send('createFacility');
};

const updateFacilityInfo = async (req, res) => {
  res.send('updateFacilityInfo');
};

const deleteFacility = async (req, res) => {
  res.send('deleteFacility');
};

module.exports = {
  createFacility,
  updateFacilityInfo,
  deleteFacility,
};
