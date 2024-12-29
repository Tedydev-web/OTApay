const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");

class RolesPermissions extends DatabaseModel {
  constructor() {
    super();
  }
  async findRolePermissionsByRoleAndFeature(con, roleId, featureID) {
    try {
      let query = `SELECT role_id, permission_id FROM ${tableName.tableRolesPermissions} WHERE role_id = ? AND permission_id = ?`;
      let data = [roleId, featureID];
      const result = await new Promise((resolve, reject) => {
        con.query(query, data, (err, dataRes) => {
          if (err) {
            return reject(err);
          }
          resolve(dataRes);
        });
      });
      if (result.length === 0) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new RolesPermissions();
