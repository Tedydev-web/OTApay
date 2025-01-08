const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");
const checkData = require("../ultils/checkValidate");
const { BusinessLogicError } = require("../core/error.response");
const getTime = require("../ultils/getTime");
const featureSchema = require("./schema/feature.schema");
class FeatureModel extends DatabaseModel {
  constructor() {
    super();
  }
  async getFeature(con, offset, limit, keyword, platform, status) {
    try {
      let whereCount = `SELECT COUNT(*) AS total FROM ${tableName.tableFeatures} WHERE 1=1`;
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
      let whereData = `SELECT id,name,platform,description,status,created_at,updated_at FROM ${tableName.tableFeatures} WHERE 1=1`;
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
  async getFeatureDetail(con, id) {
    try {
      const result = await this.select(
        con,
        tableName.tableFeatures,
        "id,name, description,platform,status,created_at,updated_at",
        "id",
        id
      );
      return result[0];
    } catch (e) {
      throw e;
    }
  }
  async createFeature(conn, name, description, platform) {
    try {
      const current = getTime.currenUnix();
      const feature = new featureSchema();
      feature.name = name;
      feature.description = description;
      feature.platform = platform;
      feature.status = 1;
      feature.created_at = current;
      const result = await this.insert(conn, tableName.tableFeatures, feature);
      return {
        message: "Insert Successfully!",
      };
    } catch (e) {
      throw e;
    }
  }
  async featureUpdate(conn, id, name, description, platform) {
    try {
      const feature = await this.getFeatureDetail(conn, id);
      if (!feature) {
        throw new BusinessLogicError("Feature not found", [], 500);
      }
      const updates = {};
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (platform !== undefined) updates.platform = platform;

      if (Object.keys(updates).length === 0) {
        throw new BusinessLogicError("No fields to update", [], 400);
      }
      const fields = Object.keys(updates)
        .map((field) => `${field} = ?`)
        .join(", ");
      const values = Object.values(updates);

      values.push(id);

      const result = await new Promise((resolve, reject) => {
        conn.query(
          `UPDATE ${tableName.tableFeatures} SET ${fields} WHERE id = ?`,
          values,
          (err, dataRes) => {
            if (err) {
              throw err;
            }
            resolve(dataRes);
          }
        );
      });
      return {
        message: "Update Successfully",
      };
    } catch (e) {
      throw e;
    }
  }
  async featureUpdateStatus(conn, id) {
    try {
      const feature = await this.getFeatureDetail(conn, id);
      if (!feature) {
        throw new BusinessLogicError("Feature not found", [], 500);
      }
      let status = 0;
      if (feature.status === 0) {
        status = 1;
      } else {
        status = 0;
      }
      const currentTime = getTime.currenUnix();
      const result = await this.update(
        conn,
        tableName.tableFeatures,
        {
          status: status,
          updated_at: currentTime,
        },
        "id",
        [id]
      );
      return {
        message: "Update status successfully!",
      };
    } catch (e) {
      throw e;
    }
  }
  async featureDelete(conn, id) {
    try {
      const result = await this.delete(conn, tableName.tableFeatures, "id", [
        id,
      ]);
      return {
        message: "Delete successfully",
      };
    } catch (e) {
      throw e;
    }
  }
  async featurePermissionCreate(conn, feature_ids, permission_ids) {
    try {
      let pairs = [];
      for (const feature of feature_ids) {
        for (const permission of permission_ids) {
          pairs.push([feature, permission]);
        }
      }
      const result = await new Promise((resolve, reject) => {
        conn.query(
          `INSERT INTO ${tableName.tableFeaturePermission} (feauture_id,permission_id) VALUES ?`,
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
        message: "Create successfully!",
      };
    } catch (e) {
      throw e;
    }
  }
  async featurePerrmissionGetByFeatureId(conn, id) {
    try {
      let query = `SELECT permission_id, feauture_id, P.name, P.platform, P.status, P.created_at, P.updated_at FROM ${tableName.tableFeaturePermission} FP 
      JOIN ${tableName.tablePermissions} P ON FP.permission_id = P.id 
      WHERE feauture_id = ?`;
      const result = await new Promise((resolve, reject) => {
        conn.query(query, [id], (err, dataRes) => {
          if (err) {
            console.log(err);
            return reject({ msg: err });
          }
          return resolve(dataRes);
        });
      });
      return result;
    } catch (e) {
      throw e;
    }
  }
  async featurePerrmissionGetByPermissionId(conn, id) {
    try {
      let query = `SELECT permission_id, feauture_id, F.name, F.description ,F.platform, F.status, F.created_at, F.updated_at FROM ${tableName.tableFeaturePermission} FP 
      JOIN ${tableName.tableFeatures} F ON FP.feauture_id = F.id 
      WHERE permission_id = ?`;
      const result = await new Promise((resolve, reject) => {
        conn.query(query, [id], (err, dataRes) => {
          if (err) {
            console.log(err);
            return reject({ msg: err });
          }
          return resolve(dataRes);
        });
      });
      return result;
    } catch (e) {
      throw e;
    }
  }
  async featureRoleCreate(conn, feature_ids, role_ids) {
    try {
      let pairs = [];
      for (const feature of feature_ids) {
        for (const role of role_ids) {
          pairs.push([feature, role]);
        }
      }
      const result = await new Promise((resolve, reject) => {
        conn.query(
          `INSERT INTO ${tableName.tableFeatureRole} (feauture_id,role_id) VALUES ?`,
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
        message: "Create successfully!",
      };
    } catch (e) {
      throw e;
    }
  }
  async featureRoleGetByFeatureId(conn, id) {
    try {
      let query = `SELECT role_id, feauture_id, R.name, R.guard_name,R.description , R.status, R.created_at, R.updated_at FROM ${tableName.tableFeatureRole} FP 
      JOIN ${tableName.tableRoles} R ON FP.role_id = R.id 
      WHERE feauture_id = ?`;
      const result = await new Promise((resolve, reject) => {
        conn.query(query, [id], (err, dataRes) => {
          if (err) {
            console.log(err);
            return reject({ msg: err });
          }
          return resolve(dataRes);
        });
      });
      return result;
    } catch (e) {
      throw e;
    }
  }
  async featurePerrmissionGetByRoleId(conn, id) {
    try {
      let query = `SELECT role_id, feauture_id, F.name, F.description ,F.platform, F.status, F.created_at, F.updated_at FROM ${tableName.tableFeatureRole} FP 
      JOIN ${tableName.tableFeatures} F ON FP.feauture_id = F.id 
      WHERE role_id = ?`;
      const result = await new Promise((resolve, reject) => {
        conn.query(query, [id], (err, dataRes) => {
          if (err) {
            console.log(err);
            return reject({ msg: err });
          }
          return resolve(dataRes);
        });
      });
      return result;
    } catch (e) {
      throw e;
    }
  }
  async featurePermissionDelete(con, ids) {
    try {
      const result = await new Promise((resolve, reject) => {
        con.query(
          `DELETE FROM ${tableName.tableFeaturePermission} WHERE id IN (?)`,
          [ids],
          (err, dataRes) => {
            if (err) {
              throw err;
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
  async featurePermissionDelete(con, ids) {
    try {
      const result = await new Promise((resolve, reject) => {
        con.query(
          `DELETE FROM ${tableName.tableFeaturePermission} WHERE id IN (?)`,
          [ids],
          (err, dataRes) => {
            if (err) {
              throw err;
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
  async featureRoleDelete(con, ids) {
    try {
      const result = await new Promise((resolve, reject) => {
        con.query(
          `DELETE FROM ${tableName.tableFeatureRole} WHERE id IN (?)`,
          [ids],
          (err, dataRes) => {
            if (err) {
              throw err;
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

module.exports = new FeatureModel();
