const loginModel = require("../models/auth.login.model");
const db = require("../dbs/init.mysql");
class LoginService {
  async login(email, password) {
    const { conn } = await db.getConnection();
    try {
      const result = await loginModel.login(conn, email, password);
      return result;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new LoginService();
