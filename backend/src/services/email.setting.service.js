const db = require("../dbs/init.mysql");
const emailSettingModel = require("../models/email.setting.model");
const userModel = require("../models/user.model");
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
  async update(
    mail_from_name,
    mail_from_address,
    mail_host,
    mail_port,
    mail_username,
    mail_password
  ) {
    const { conn } = await db.getConnection();
    try {
      const result = await emailSettingModel.updateMail(
        conn,
        mail_from_name,
        mail_from_address,
        mail_host,
        mail_port,
        mail_username,
        mail_password
      );
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
