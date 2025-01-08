const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");
const emailService = require("../ultils/email");
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

  async updateMail(
    conn,
    mail_from_name,
    mail_from_address,
    mail_host,
    mail_port,
    mail_username,
    mail_password
  ) {
    try {
      const updates = {};
      if (mail_from_name !== undefined) updates.mail_from_name = mail_from_name;
      if (mail_from_address !== undefined)
        updates.mail_from_address = mail_from_address;
      if (mail_host !== undefined) updates.mail_host = mail_host;
      if (mail_port !== undefined) updates.mail_port = mail_port;
      if (mail_username !== undefined) updates.mail_username = mail_username;
      if (mail_password !== undefined) updates.mail_password = mail_password;

      if (Object.keys(updates).length === 0) {
        throw new BusinessLogicError("No fields to update", [], 400);
      }

      const fields = Object.keys(updates)
        .map((field) => `${field} = ?`)
        .join(", ");
      const values = Object.values(updates);

      const result = await new Promise((resolve, reject) => {
        conn.query(
          `UPDATE ${tableName.tableEmailSetting} SET ${fields}`,
          values,
          (err, dataRes) => {
            if (err) {
              return reject(err);
            }
            resolve(dataRes);
          }
        );
      });

      return {
        message: "Update Successfully",
        affectedRows: result.affectedRows,
      };
    } catch (e) {
      throw e;
    }
  }
}
module.exports = new EmailSettingModel();
