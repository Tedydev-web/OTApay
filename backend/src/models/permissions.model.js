const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");
const checkData = require("../ultils/checkValidate");
const { BusinessLogicError } = require("../core/error.response");

class PermissionsModel extends DatabaseModel {
  constructor() {
    super();
  }
  async getFeaturePermissionsByName(con, name) {
    try {
      const result = await this.select(
        con,
        tableName.tablePermissions,
        "id,name,platform,status,created_at,updated_at",
        "name = ?",
        [name]
      );
      if (result.length === 0) {
        throw new BusinessLogicError("Role not found", [], 500);
      }
      return result[0];
    } catch (e) {
      throw e;
    }
  }
}
module.exports = new PermissionsModel();
