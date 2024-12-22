const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");

class EmailSettingModel extends DatabaseModel {
  constructor() {
    super();
  }

  async getEmailSetting(con) {
    try {
      const result = await this.select(
        con,
        tableName.tableEmailSetting,
        "id, mail_from_name, mail_from_address, mail_host, mail_port, mail_username,mail_password , created_at, updated_at",
        "id = 1"
      );
      return result[0];
    } catch (e) {
      throw e;
    }
  }

  async updateEmailSetting(con, emailSetting) {
    try {
      const result = await this.update(
        con,
        tableName.tableEmailSetting,
        emailSetting,
        "id = 1"
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
module.exports = new EmailSettingModel();
