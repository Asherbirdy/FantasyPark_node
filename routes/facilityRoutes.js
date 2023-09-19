const express = require('express');
const router = express.Router();

const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

const {
  createFacility,
  showAllFacility,
  updateFacilityInfo,
  deleteFacility,
} = require('../controllers/facilityController');

router.post(
  '/',
  authenticateUser,
  authorizePermission('admin'),
  createFacility
);

router.get(
  '/',
  authenticateUser,
  authorizePermission('admin'),
  showAllFacility
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
