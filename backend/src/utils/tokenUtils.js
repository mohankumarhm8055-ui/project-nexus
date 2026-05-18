'use strict';

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    issuer: 'nexus-intellect',
    audience: 'nexus-client',
  });

const generateRefreshToken = (payload) =>
  jwt.sign({ ...payload, jti: uuidv4() }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    issuer: 'nexus-intellect',
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'nexus-intellect',
    audience: 'nexus-client',
  });

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    issuer: 'nexus-intellect',
  });

const decodeToken = (token) => jwt.decode(token);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};
