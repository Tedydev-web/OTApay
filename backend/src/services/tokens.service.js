const db = require("../dbs/init.mysql");
const { BusinessLogicError } = require("../core/error.response");
const authToken = require("../models/auth.token.model");
const userTokensModel = require("../models/userTokens.model");
class TokensService {
  async refreshToken(token) {
    const { conn } = await db.getConnection();
    try {
      const result = await authToken.refreshToken(conn, token);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async logout(token) {
    const { conn } = await db.getConnection();
    try {
      const result = await userTokensModel.deleteByToken(conn, token);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}
module.exports = new TokensService();
