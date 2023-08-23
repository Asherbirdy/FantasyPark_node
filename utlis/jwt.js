const jwt = require('jsonwebtoken');
// https://jwt.io/introduction

// 創造 JWT
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

// 認證 JWT
const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

// 將使用者資料 存在 cookie // user是tokenUser
const attachCookieToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: 1000 * 60 * 15,
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });
};

module.exports = { createJWT, isTokenValid, attachCookieToResponse };
