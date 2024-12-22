const LoginResponseSchma = require("./schema/loginResponse.schema");
const DatabaseModel = require("./database.model");
const { BusinessLogicError } = require("../core/error.response");
const configureEnvironment = require("../config/dotenv.config");
const userModel = require("./user.model");
const hash = require("../ultils/hash");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = configureEnvironment();
const jwt = require("jsonwebtoken");
class LoginModel extends DatabaseModel {
  constructor() {
    super();
  }

  async generateAccessToken(username, email, role) {
    try {
      const accessToken = jwt.sign(
        {
          username: username,
          email: email,
          role: role,
        }, // Payload
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );
      return accessToken;
    } catch (e) {
      throw e;
    }
  }
  async generateRefreshToken(username, email, role) {
    try {
      const refreshToken = jwt.sign(
        {
          username: username,
          email: email,
          role: role,
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );
      return refreshToken;
    } catch (e) {
      throw e;
    }
  }
  async login(con, email, password) {
    try {
      const user = await userModel.getUserByEmail(con, email);
      if (!user) {
        throw new BusinessLogicError("User not found", [], 500);
      }
      const checkPassword = await hash.checkPassword(password, user.password);
      if (!checkPassword) {
        throw new BusinessLogicError("Password incorrect", [], 500);
      }
      if (user.status == 0) {
        throw new BusinessLogicError("User is disabled", [], 500);
      }
      if (user.is_verify == 0) {
        throw new BusinessLogicError("User is not verify email", [], 500);
      }
      const userResponse = new LoginResponseSchma();
      const accessToken = await this.generateAccessToken(
        user.username,
        user.email,
        user.role
      );
      const refreshToken = await this.generateRefreshToken(
        user.username,
        user.email,
        user.role
      );
      userResponse.id = user.id;
      userResponse.username = user.username;
      userResponse.email = user.email;
      userResponse.role = user.role;
      userResponse.is_verify = user.is_verify;
      userResponse.accessToken = accessToken;
      userResponse.refreshToken = refreshToken;
      return userResponse;
    } catch (e) {
      throw e;
    }
  }
}
module.exports = new LoginModel();
