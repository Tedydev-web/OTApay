const db = require("../dbs/init.mysql");
const { BusinessLogicError } = require("../core/error.response");
const permissionsModel = require("../models/permissions.model");
const checkValidate = require("../ultils/checkValidate");
const tableName = require("../constants/tableName.constant");
class PermissionsService {
  async getRoles(offset, limit, keyword, status) {
    const { conn } = await db.getConnection();
    try {
      const result = await permissionsModel.getRoles(
        conn,
        offset,
        limit,
        keyword,
        status
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
  async getPermissionsRoles(
    offset,
    limit,
    keyword,
    platform,
    status,
    roleId,
    permissionId
  ) {
    const { conn } = await db.getConnection();
    try {
      const result = await permissionsModel.getPermissionsRoles(
        conn,
        offset,
        limit,
        keyword,
        platform,
        status,
        roleId,
        permissionId
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
  async getRoleDetail(roleId) {
    const { conn } = await db.getConnection();
    try {
      const result = await permissionsModel.getRoleDetail(conn, roleId);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async getPermissionDetail(permissionId) {
    const { conn } = await db.getConnection();
    try {
      const result = await permissionsModel.getPermissionDetail(
        conn,
        permissionId
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
  getPermissions = async (offset, limit, keyword, platform, status) => {
    const { conn } = await db.getConnection();
    try {
      const result = await permissionsModel.getPermissions(
        conn,
        offset,
        limit,
        keyword,
        platform,
        status
      );
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  };
  async updateRoleStatus(roleId) {
    const { conn } = await db.getConnection();
    try {
      const result = await permissionsModel.updateRoleStatus(conn, roleId);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async updatePermissionStatus(permissionId) {
    const { conn } = await db.getConnection();
    try {
      const result = await permissionsModel.updatePermissionStatus(
        conn,
        permissionId
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
  async rolePermissionUpdate(roleIDs, permissionIDs) {
    const { conn } = await db.getConnection();
    try {
      for (const index of permissionIDs) {
        const permission = permissionsModel.getPermissionDetail(conn, index);
        if (!permission) {
          throw new BusinessLogicError(
            `Permission not found: ${index}`,
            [],
            500
          );
        }
      }
      for (const index of roleIDs) {
        const role = await permissionsModel.getRoleDetail(conn, index);
        if (!role) {
          throw new BusinessLogicError(`Role not found: ${index}`, [], 500);
        }
      }
      const result = await permissionsModel.rolePermissionUpdate(
        conn,
        roleIDs,
        permissionIDs
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
  async rolePermissionDelete(ids) {
    const { conn } = await db.getConnection();
    try {
      for (const index of ids) {
        const isExist = await checkValidate.checkIsExist(
          conn,
          tableName.tableRolesPermissions,
          "id",
          index
        );
        if (!isExist) {
          throw new BusinessLogicError(
            `Role Permission not found: ${index}`,
            [],
            500
          );
        }
      }
      const result = await permissionsModel.rolePermissionDelete(conn, ids);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async roleCreate(name, guard_name, description) {
    const { conn } = await db.getConnection();
    try {
      const result = await permissionsModel.roleCreate(
        conn,
        name,
        guard_name,
        description
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

module.exports = new PermissionsService();
