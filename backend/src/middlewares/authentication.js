const {
  Api404Error,
  BaseError,
  BusinessLogicError,
  Api401Error,
  Api403Error,
} = require("../core/error.response");
const jwt = require("jsonwebtoken");
const configureEnvironment = require("../config/dotenv.config");
const { ACCESS_TOKEN_SECRET } = configureEnvironment();
const db = require("../dbs/init.mysql");
const userTokens = require("../models/userTokens.model");

const authenticate = async (req, res, next) => {
  const { conn } = await db.getConnection();
  try {
    const token = req.headers["x-otapay"];
    if (!token) {
      return new next(new Api401Error("Invalid token"));
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          await userTokens.deleteByToken(conn, token);
          return next(
            new Api403Error("Token has expired and has been removed.", [], 403)
          );
        } else {
          return next(new Api403Error("Invalid token"));
        }
      }
      const tokenInfor = await userTokens.getTokenByUserIdAndToken(
        conn,
        decoded.userId,
        token
      );
      if (tokenInfor.status !== 0) {
        return next(new Api401Error("Token has been revoked", [], 401));
      }
      req.user = {
        id: decoded.userId,
        role: decoded.role,
        name: decoded.name,
      };
      next();
    });
  } catch (err) {
    return next(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports = authenticate;
