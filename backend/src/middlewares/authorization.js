const {
  Api404Error,
  BaseError,
  BusinessLogicError,
  Api401Error,
  Api403Error,
} = require("../core/error.response");
const authModel = require("../models/rolesPermissions.model");
const db = require("../dbs/init.mysql");
const roles = require("../models/roles.model");
const permissions = require("../models/permissions.model");

const authorization = (featureName) => {
  return async (req, res, next) => {
    const { conn } = await db.getConnection();
    try {
      const roleName = req.user.role;
      const roleInfor = await roles.getRolesByName(conn, roleName);
      const featuresInfor = await permissions.getFeaturePermissionsByName(
        conn,
        featureName
      );
      const permission = await authModel.findRolePermissionsByRoleAndFeature(
        conn,
        roleInfor.id,
        featuresInfor.id
      );
      if (!permission) {
        return next(new Api403Error("Permission denied", [], 403));
      }
      next();
    } catch (error) {
      return next(error);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  };
};

module.exports = authorization;
