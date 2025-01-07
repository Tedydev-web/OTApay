const db = require("../dbs/init.mysql");
const { BusinessLogicError } = require("../core/error.response");
const permissionsModel = require("../models/permissions.model");
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
}

module.exports = new PermissionsService();
