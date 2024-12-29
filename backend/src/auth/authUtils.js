const jwt = require('jsonwebtoken');
const { Api401Error } = require('../core/error.response');
const configureEnvironment = require('../config/dotenv.config');

const { ACCESS_TOKEN_SECRET } = configureEnvironment();

const authentication = async (req, res, next) => {
  try {
    // 1. Get token
    const token = req.headers.authorization;
    if (!token) {
      throw new Api401Error('Unauthorized - No Token Provided');
    }

    // 2. Verify token
    const accessToken = token.split(' ')[1];
    if (!accessToken) {
      throw new Api401Error('Unauthorized - Invalid Token Format');
    }

    // 3. Decode token
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    if (!decoded) {
      throw new Api401Error('Unauthorized - Invalid Token');
    }

    // 4. Get user info from token
    req.user = decoded;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Api401Error('Unauthorized - Token Expired');
    }
    throw error;
  }
};

module.exports = {
  authentication
}; 