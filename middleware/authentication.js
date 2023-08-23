const CustomError = require('../errors');
const { isTokenValid } = require('../utlis');

const authenticateUser = async (req, res, next) => {
  // const token = req.signedCookies.token;

  // if (!token) {
  //   throw new CustomError.UnauthenticatedError('Authentication Invalid');
  // }

  const { refreshToken, accessToken } = req.signedCookies;

  try {
    // const { name, userId, role } = isTokenValid({ token });
    // req.user = { name, userId, role };
    // next();
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

const authorizePermission = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      throw new CustomError.UnauthenticatedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermission };
