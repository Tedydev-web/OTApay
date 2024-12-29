const DatabaseModel = require("./database.model");
const { BusinessLogicError } = require("../core/error.response");
const jwt = require("jsonwebtoken");
const authLogin = require("./auth.login.model");
const LoginResponseSchema = require("./schema/loginResponse.schema");
const getTime = require("../ultils/getTime");
const userTokens = require("./userTokens.model");
const userModel = require("./user.model");
class AuthToken extends DatabaseModel {
  constructor() {
    super();
  }
  async refreshToken(con, token) {
    try {
      await con.promise().beginTransaction();
      const decodedToken = jwt.decode(token);
      if (!decodedToken) {
        throw new BusinessLogicError("Invalid token format", [], 401);
      }
      if (!decodedToken.userId) {
        throw new BusinessLogicError("Invalid token format", [], 401);
      }
      const tokenInfor = await userTokens.getTokenByUserIdAndToken(
        con,
        decodedToken.userId,
        token
      );
      if (!tokenInfor) {
        throw new BusinessLogicError("Invalid token", [], 401);
      }
      if (tokenInfor.status !== 0) {
        throw new BusinessLogicError("Token has been revoked", [], 401);
      }
      // Kiểm tra thời gian hết hạn
      const user = await userModel.getUserByUserId(con, decodedToken.userId);
      if (!user) {
        throw new BusinessLogicError("User not found", [], 404);
      }
      const currentTime = getTime.currenUnix();
      if (decodedToken.exp * 1000 < currentTime) {
        await userTokens.deleteByToken(con, token);
        throw new BusinessLogicError("Token has expired", [], 401);
      }
      const userResponse = new LoginResponseSchema();
      const accessToken = await authLogin.generateAccessToken(
        con,
        user.id,
        user.username,
        user.email,
        user.role
      );
      const refreshToken = await authLogin.generateRefreshToken(
        con,
        user.id,
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
      await con.promise().commit();
      return userResponse;
    } catch (e) {
      await con.promise().rollback();
      throw e;
    }
  }
}
module.exports = new AuthToken();
