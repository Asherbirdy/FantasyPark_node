const CustomError = require("../errors");
const { isTokenValid, attachCookieToResponse } = require("../utlis");

const authenticateUser = async (req, res, next) => {
  let token = null;

  if (process.env.ENV === "PROD") {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      token = authHeader.split(" ")[1];
    }
  } 

  if(process.env.ENV === "DEV"){
    const { refreshToken, accessToken } = req.signedCookies;
    if (accessToken) {
      token = accessToken;
    }
  }

  try {
    if (token) {
      const payload = isTokenValid(token);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
    attachCookieToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermission = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      throw new CustomError.UnauthenticatedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermission };
