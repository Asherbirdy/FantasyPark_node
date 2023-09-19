const { StatusCodes } = require('http-status-codes');

const CustomError = require('../errors');

const showAllFacility = async (req, res) => {
  res.send('showAllFacility');
};

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
  showAllFacility,
  createFacility,
  updateFacilityInfo,
  deleteFacility,
};
