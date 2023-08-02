const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication');

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

router
  .route('/')
  .get(authenticateUser, authorizePermission('admin', 'owner'), getAllUsers);
// 這順序很重要！ 因為showMe如果在 router.route('/:id').get(getSingleUser); 下方，會被 /:id 當作參數
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
