const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");
const checkData = require("../ultils/checkValidate");
const { BusinessLogicError } = require("../core/error.response");
const getTime = require("../ultils/getTime");

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
  async getRoles(con, offset, limit, keyword, status) {
    try {
      let whereCount = `SELECT COUNT(*) AS total FROM ${tableName.tableRoles} WHERE 1=1`;
      let conditionsCount = [];
      if (keyword) {
        whereCount += " AND (name LIKE ? OR guard_name LIKE ?)";
        conditionsCount.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (status) {
        whereCount += " AND status = ?";
        conditionsCount.push(status);
      }
      const countQuery = con.promise().query(whereCount, conditionsCount);
      let whereData = `SELECT id,name,guard_name,description,status,created_at, updated_at FROM ${tableName.tableRoles} WHERE 1=1`;
      let conditionsData = [];
      if (keyword) {
        whereData += " AND (name LIKE ? OR guard_name LIKE ?)";
        conditionsData.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (status) {
        whereData += " AND status = ?";
        conditionsData.push(status);
      }
      whereData += " LIMIT ? OFFSET ?";
      conditionsData.push(limit, offset);
      const dataQuery = con.promise().query(whereData, conditionsData);
      const [countResult, dataResult] = await Promise.all([
        countQuery,
        dataQuery,
      ]);
      const total = countResult[0][0].total;
      const data = dataResult[0];
      const totalPages = Math.ceil(total / limit);
      return {
        totalRecord: total,
        totalPages: totalPages,
        data: data,
      };
    } catch (e) {
      throw e;
    }
  }
  async getPermissionsRoles(
    conn,
    offset,
    limit,
    keyword,
    platform,
    status,
    roleId,
    permissionId
  ) {
    try {
      let whereCount = `SELECT COUNT(*) AS total FROM ${tableName.tableRolesPermissions} RP 
      JOIN ${tableName.tablePermissions} P ON RP.permission_id = P.id   
      JOIN ${tableName.tableRoles} R ON RP.role_id = R.id 
      WHERE 1=1`;
      let conditionsCount = [];
      if (keyword) {
        whereCount += " AND (P.name LIKE ? OR P.platform LIKE ?)";
        conditionsCount.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (platform) {
        whereCount += " AND P.platform = ?";
        conditionsCount.push(platform);
      }
      if (status) {
        whereCount += " AND P.status = ?";
        conditionsCount.push(status);
      }
      if (roleId) {
        whereCount += " AND RP.role_id = ?";
        conditionsCount.push(roleId);
      }
      if (permissionId) {
        whereCount += " AND RP.permission_id = ?";
        conditionsCount.push(permissionId);
      }

      const countQuery = conn.promise().query(whereCount, conditionsCount);
      let whereData = `SELECT RP.id AS permission_role_id, role_id,R.name AS role_name,R.guard_name ,R.description AS role_description,R.status AS role_status, permission_id, P.name AS permission_name, platform, P.status AS permission_status FROM ${tableName.tableRolesPermissions} RP 
      JOIN ${tableName.tablePermissions} P ON RP.permission_id = P.id   
      JOIN ${tableName.tableRoles} R ON RP.role_id = R.id 
      WHERE 1=1`;
      let conditionsData = [];
      if (keyword) {
        whereData += " AND (P.name LIKE ? OR P.platform LIKE ?)";
        conditionsData.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (platform) {
        whereData += " AND P.platform = ?";
        conditionsData.push(platform);
      }
      if (status) {
        whereData += " AND P.status = ?";
        conditionsData.push(status);
      }
      if (roleId) {
        whereData += " AND RP.role_id = ?";
        conditionsData.push(roleId);
      }
      if (permissionId) {
        whereData += " AND RP.permission_id = ?";
        conditionsData.push(permissionId);
      }
      whereData += " LIMIT ? OFFSET ?";
      conditionsData.push(limit, offset);
      const dataQuery = conn.promise().query(whereData, conditionsData);
      const [countResult, dataResult] = await Promise.all([
        countQuery,
        dataQuery,
      ]);
      const total = countResult[0][0].total;
      const data = dataResult[0];
      const totalPages = Math.ceil(total / limit);
      return {
        totalRecord: total,
        totalPages: totalPages,
        data: data,
      };
    } catch (e) {
      throw e;
    }
  }
  async getRoleDetail(con, roleId) {
    try {
      const result = await this.select(
        con,
        tableName.tableRoles,
        "id,name,guard_name,description,status,created_at,updated_at",
        "id = ?",
        [roleId]
      );
      if (result.length === 0) {
        throw new BusinessLogicError("Role not found", [], 500);
      }
      return result[0];
    } catch (e) {
      throw e;
    }
  }
  async getPermissionDetail(con, permissionId) {
    try {
      const result = await this.select(
        con,
        tableName.tablePermissions,
        "id,name,platform,status,created_at,updated_at",
        "id = ?",
        [permissionId]
      );
      if (result.length === 0) {
        throw new BusinessLogicError("Permission not found", [], 500);
      }
      return result[0];
    } catch (e) {
      throw e;
    }
  }
  async getPermissions(con, offset, limit, keyword, platform, status) {
    try {
      let whereCount = `SELECT COUNT(*) AS total FROM ${tableName.tablePermissions} WHERE 1=1`;
      let conditionsCount = [];
      if (keyword) {
        whereCount += " AND (name LIKE ? OR platform LIKE ?)";
        conditionsCount.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (platform) {
        whereCount += " AND platform = ?";
        conditionsCount.push(platform);
      }
      if (status) {
        whereCount += " AND status = ?";
        conditionsCount.push(status);
      }
      const countQuery = con.promise().query(whereCount, conditionsCount);
      let whereData = `SELECT id,name,platform,status,created_at,updated_at FROM ${tableName.tablePermissions} WHERE 1=1`;
      let conditionsData = [];
      if (keyword) {
        whereData += " AND (name LIKE ? OR platform LIKE ?)";
        conditionsData.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (platform) {
        whereData += " AND platform = ?";
        conditionsData.push(platform);
      }
      if (status) {
        whereData += " AND status = ?";
        conditionsData.push(status);
      }
      whereData += " LIMIT ? OFFSET ?";
      conditionsData.push(limit, offset);
      const dataQuery = con.promise().query(whereData, conditionsData);
      const [countResult, dataResult] = await Promise.all([
        countQuery,
        dataQuery,
      ]);
      const total = countResult[0][0].total;
      const data = dataResult[0];
      const totalPages = Math.ceil(total / limit);
      return {
        totalRecord: total,
        totalPages: totalPages,
        data: data,
      };
    } catch (e) {
      throw e;
    }
  }
  async updateRoleStatus(con, roleId) {
    try {
      const role = await this.getRoleDetail(con, roleId);
      if (!role) {
        throw new BusinessLogicError("Role not found", [], 500);
      }
      const currentTime = getTime.currenUnix();
      let status = 1;
      if (role.status === 1) {
        status = 0;
      } else {
        status = 1;
      }
      const result = await this.update(
        con,
        tableName.tableRoles,
        { status: status, updated_at: currentTime },
        "id",
        [roleId]
      );
      return {
        message: "Update role status successfully",
      };
    } catch (e) {
      throw e;
    }
  }
  async updatePermissionStatus(con, permissionId) {
    try {
      const permission = await this.getPermissionDetail(con, permissionId);
      if (!permission) {
        throw new BusinessLogicError("Permission not found", [], 500);
      }
      const currentTime = getTime.currenUnix();
      let status = 1;
      if (permission.status === 1) {
        status = 0;
      } else {
        status = 1;
      }
      const result = await this.update(
        con,
        tableName.tablePermissions,
        { status: status, updated_at: currentTime },
        "id",
        [permissionId]
      );
      return {
        message: "Update permission status successfully",
      };
    } catch (e) {
      throw e;
    }
  }
  async rolePermissionUpdate(conn, roleIDs, permissionIDs) {
    try {
      let pairs = [];
      for (const roleId of roleIDs) {
        for (const permissionId of permissionIDs) {
          pairs.push([roleId, permissionId]);
        }
      }
      const result = await new Promise((resolve, reject) => {
        conn.query(
          `INSERT INTO ${tableName.tableRolesPermissions} (role_id,permission_id) VALUES ?`,
          [pairs],
          (err, dataRes) => {
            if (err) {
              console.log(err);
              return reject({ msg: err });
            }
            return resolve(dataRes);
          }
        );
      });
      return {
        message: "Update successfully!",
      };
    } catch (e) {
      throw e;
    }
  }
  async rolePermissionDelete(conn, ids) {
    try {
      const result = await new Promise((resolve, reject) => {
        conn.query(
          `DELETE FROM ${tableName.tableRolesPermissions} WHERE id IN (?)`,
          [ids],
          (err, dataRes) => {
            if (err) {
              console.log(err);
              return reject({ msg: err });
            }
            return resolve(dataRes);
          }
        );
      });
      return {
        message: "Delete sucessfully!",
      };
    } catch (e) {
      throw e;
    }
  }
}
module.exports = new PermissionsModel();
