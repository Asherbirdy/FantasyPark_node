const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookieToResponse,
  checkPersmission,
} = require('../utlis');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password');

  if (!user) {
    throw new CustomError.NotFoundError(
      `No user found with id: ${req.params.id}`
    );
  }
  checkPersmission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  if (req.user.role === 'admin') {
    throw new CustomError.UnauthenticatedError('admin can not be change!!!');
  }
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide all value');
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;
  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  if (req.user.role === 'admin') {
    throw new CustomError.UnauthenticatedError('admin can not be change!!!');
  }
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPassword = await user.comparePassword(oldPassword);
  if (!isPassword) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Sucess! Password Updated' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
