const express = require('express');
const router = express.Router();

const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

const {
  createFacility,
  updateFacilityInfo,
  deleteFacility,
} = require('../controllers/facilityController');

router.post(
  '/',
  authenticateUser,
  authorizePermission('admin'),
  createFacility
);

router.patch(
  '/',
  authenticateUser,
  authorizePermission('admin'),
  updateFacilityInfo
);

router.delete(
  '/',
  authenticateUser,
  authorizePermission('admin'),
  deleteFacility
);

module.exports = router;
