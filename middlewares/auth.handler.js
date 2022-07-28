const boom = require('@hapi/boom');
const {config}=require('../config/config');

function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];
  if (apiKey !== config.apiKey) {
    throw boom.unauthorized('Invalid API key');
  }
  next();
}

function checkRoles(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      next();
    } else{
      throw boom.forbidden('You are not authorized');
    }
  }
}

module.exports = {checkApiKey, checkRoles};