const { BusinessLogicError } = require("../core/error.response");
const db = require("../dbs/init.mysql");
const featureModel = require("../models/feature.model");
const permissionModel = require("../models/permissions.model");
const checkValidate = require("../ultils/checkValidate");
const tableName = require("../constants/tableName.constant");

class FeatureService {
  async getFeature(offset, limit, keyword, platform, status) {
    const { conn } = await db.getConnection();
    try {
      const result = featureModel.getFeature(
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
  }
  async createFeature(name, description, platform) {
    const { conn } = await db.getConnection();
    try {
      const result = await featureModel.createFeature(
        conn,
        name,
        description,
        platform
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
  async featureUpdate(id, name, description, platform) {
    const { conn } = await db.getConnection();
    try {
      const result = await featureModel.featureUpdate(
        conn,
        id,
        name,
        description,
        platform
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
  async featureUpdateStatus(id) {
    const { conn } = await db.getConnection();
    try {
      const result = await featureModel.featureUpdateStatus(conn, id);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async featureGetDetail(id) {
    const { conn } = await db.getConnection();
    try {
      const result = featureModel.getFeatureDetail(conn, id);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async featureDelete(id) {
    const { conn } = await db.getConnection();
    try {
      const feature = await featureModel.getFeatureDetail(conn, id);
      if (!feature) {
        throw new BusinessLogicError("Feature not found", [], 500);
      }
      const featurePermission =
        await featureModel.featurePerrmissionGetByFeatureId(conn, id);
      if (featurePermission) {
        throw new BusinessLogicError(
          "Feature is existing with feature permission",
          [],
          500
        );
      }
      const featureRole = await featureModel.featureRoleGetByFeatureId(
        conn,
        id
      );
      if (featureRole) {
        throw new BusinessLogicError(
          "Feature is existing with feature role",
          [],
          500
        );
      }
      const result = await featureModel.featureDelete(conn, id);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async featurePermissionCreate(feature_ids, permission_ids) {
    const { conn } = await db.getConnection();
    try {
      for (const index of feature_ids) {
        const feature = await featureModel.getFeatureDetail(conn, index);
        if (!feature) {
          throw new BusinessLogicError(`Feature not found: ${index}`, [], 500);
        }
      }
      for (const index of permission_ids) {
        const permission = await permissionModel.getPermissionDetail(
          conn,
          index
        );
        if (!permission) {
          throw new BusinessLogicError(
            `Permission not found: ${index}`,
            [],
            500
          );
        }
      }
      const result = await featureModel.featurePermissionCreate(
        conn,
        feature_ids,
        permission_ids
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
  async featurePerrmissionGetByFeatureId(id) {
    const { conn } = await db.getConnection();
    try {
      const feature = await featureModel.getFeatureDetail(conn, id);
      if (!feature) {
        throw new BusinessLogicError("Feature not found", [], 500);
      }
      const result = await featureModel.featurePerrmissionGetByFeatureId(
        conn,
        id
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
  async featurePerrmissionGetByPermissionId(id) {
    const { conn } = await db.getConnection();
    try {
      const permission = await permissionModel.getPermissionDetail(conn, id);
      if (!permission) {
        throw new BusinessLogicError("Permission not found", [], 500);
      }
      const result = await featureModel.featurePerrmissionGetByPermissionId(
        conn,
        id
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
  async featurePermissionDelete(ids) {
    const { conn } = await db.getConnection();
    try {
      for (const index of ids) {
        const existing = await checkValidate.checkIsExist(
          conn,
          tableName.tableFeaturePermission,
          "id",
          index
        );
        if (!existing) {
          throw new BusinessLogicError(`Id not found : ${index}`, [], 500);
        }
      }
      const result = await featureModel.featurePermissionDelete(conn, ids);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async featureRoleCreate(feature_ids, role_ids) {
    const { conn } = await db.getConnection();
    try {
      for (const index of feature_ids) {
        const feature = await featureModel.getFeatureDetail(conn, index);
        if (!feature) {
          throw new BusinessLogicError(`Feature not found: ${index}`, [], 500);
        }
      }
      for (const index of role_ids) {
        const role = await permissionModel.getRoleDetail(conn, index);
        if (!role) {
          throw new BusinessLogicError(`Role not found: ${index}`, [], 500);
        }
      }
      const result = await featureModel.featureRoleCreate(
        conn,
        feature_ids,
        role_ids
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
  async featureRoleGetByFeatureId(id) {
    const { conn } = await db.getConnection();
    try {
      const feature = await featureModel.getFeatureDetail(conn, id);
      if (!feature) {
        throw new BusinessLogicError("Feature not found", [], 500);
      }
      const result = await featureModel.featureRoleGetByFeatureId(conn, id);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async featurePerrmissionGetByRoleId(id) {
    const { conn } = await db.getConnection();
    try {
      const role = await permissionModel.getRoleDetail(conn, id);
      if (!role) {
        throw new BusinessLogicError("Role not found", [], 500);
      }
      const result = await featureModel.featurePerrmissionGetByRoleId(conn, id);
      return result;
    } catch (e) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async featureRoleDelete(ids) {
    const { conn } = await db.getConnection();
    try {
      for (const index of ids) {
        const existing = await checkValidate.checkIsExist(
          conn,
          tableName.tableFeatureRole,
          "id",
          index
        );
        if (!existing) {
          throw new BusinessLogicError(`Id not found : ${index}`, [], 500);
        }
      }
      const result = await featureModel.featureRoleDelete(conn, ids);
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

module.exports = new FeatureService();
