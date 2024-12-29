const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");
const { BusinessLogicError } = require("../core/error.response");

class RolesModel extends DatabaseModel {
  constructor() {
    super();
  }
  async getRolesByName(con, name) {
    try {
      const result = await this.select(
        con,
        tableName.tableRoles,
        "id,name,guard_name,description,status,created_at,updated_at",
        "name = ?",
        [name]
      );
      if (result.length === 0) {
        throw new BusinessLogicError("Role not found", [], 404);
      }
      return result[0];
    } catch (err) {
      throw err;
    }
  }
}
module.exports = new RolesModel();
