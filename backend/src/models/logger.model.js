const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");
const { BusinessLogicError } = require("../core/error.response");
const loggerSchema = require("./schema/logger.schema");
class LoggerModel extends DatabaseModel {
  constructor() {
    super();
  }
  async write(con, loggerSchema) {
    try {
      const result = await this.insert(
        con,
        tableName.tableLogger,
        loggerSchema
      );
      let message;
      if (result.affectedRows === 0) {
        message = "Failed to write log";
      } else {
        message = "Log written successfully";
      }
      return {
        message: message,
      };
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new LoggerModel();
