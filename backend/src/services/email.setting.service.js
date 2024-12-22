const db = require("../dbs/init.mysql");
const emailSettingModel = require("../models/email.setting.model");

class EmailSettingService {
  async getEmailSetting() {
    const { conn } = await db.getConnection();
    try {
      const result = await emailSettingModel.getEmailSetting(conn);
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
module.exports = new EmailSettingService();
