const jwt = require('jsonwebtoken');
// https://jwt.io/introduction

// 創造 JWT
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

// 認證 JWT
const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

// 將使用者資料 存在 cookie // user是tokenUser
const attachCookieToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

module.exports = { createJWT, isTokenValid, attachCookieToResponse };
