const CustomError = require('../errors');
const checkPersmission = (requestUser, resourceUserId) => {
  //   console.log(requestUser);
  //   console.log(resourceUserId);
  //   console.log(typeof resourceUserId);

  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.userId) return;

  throw new CustomError.UnauthenticatedError(
    'Not authorized to access this route'
  );
};
module.exports = checkPersmission;
