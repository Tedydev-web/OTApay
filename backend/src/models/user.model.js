const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");
const { BusinessLogicError } = require("../core/error.response");
const userSchema = require("./schema/user.schema");
const crypto = require("crypto");
const getTime = require("../ultils/getTime");
const emailService = require("../ultils/email");
class UserModel extends DatabaseModel {
  constructor() {
    super();
  }
  async getUserByEmail(con, email) {
    try {
      const result = await this.select(
        con,
        tableName.tableUser,
        "id, username, email, password, role, verify_token, expired_time, is_verify, status, created_at, updated_at",
        "email = ?",
        [email]
      );
      return result[0];
    } catch (e) {
      throw e;
    }
  }
  async getUserByUserId(con, userId) {
    try {
      const result = await this.select(
        con,
        tableName.tableUser,
        "id, username, email, password, role, verify_token, expired_time, is_verify, status, created_at, updated_at",
        "id = ?",
        [userId]
      );
      return result[0];
    } catch (e) {
      throw e;
    }
  }
  async generateRandomString(length = 6) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomBytes = crypto.randomBytes(length);
    let result = "";
    for (let i = 0; i < randomBytes.length; i++) {
      result += characters[randomBytes[i] % characters.length];
    }
    return result;
  }
  async createNewUser(con, email) {
    try {
      const user = await this.getUserByEmail(con, email);
      if (user) {
        throw new BusinessLogicError("User is existed", [], 500);
      }
      const token = await this.generateRandomString(6);
      const currentTime = getTime.currenUnix();
      const expired_time = currentTime + 30 * 1000;
      const userSchemaData = new userSchema();
      userSchemaData.email = email;
      userSchemaData.verify_token = token;
      userSchemaData.is_verify = 0;
      userSchemaData.expired_time = expired_time;
      userSchemaData.role = "user";
      userSchemaData.status = 1;
      userSchemaData.created_at = currentTime;
      const result = await this.insert(
        con,
        tableName.tableUser,
        userSchemaData
      );
      await emailService.sendAccountInformation(email, token);
      if (result.affectedRows === 0) {
        throw new BusinessLogicError("Failed to create user", [], 500);
      }
      return {
        message: "User created successfully",
      };
    } catch (e) {
      throw e;
    }
  }
  async confirmVerifyCode(con, email, verifyCode) {
    try {
      const currentTime = getTime.currenUnix();
      const user = await this.getUserByEmail(con, email);
      if (!user) {
        throw new BusinessLogicError("User not found", [], 500);
      }
      if (user.verify_token !== verifyCode) {
        throw new BusinessLogicError("Verify code is not correct", [], 500);
      }
      if (user.expired_time < currentTime) {
        throw new BusinessLogicError("Verify code is expired", [], 500);
      }
      const result = await this.update(
        con,
        tableName.tableUser,
        {
          is_verify: 1,
          updated_at: currentTime,
        },
        "email",
        [email]
      );
      if (result.affectedRows === 0) {
        throw new BusinessLogicError("Failed to verify user", [], 500);
      }
      return {
        message: "User verified successfully",
      };
    } catch (e) {
      throw e;
    }
  }
  async resendVerifyCode(con, email) {
    try {
      const user = await this.getUserByEmail(con, email);
      if (!user) {
        throw new BusinessLogicError("User not found", [], 500);
      }
      const token = await this.generateRandomString(6);
      const currentTime = getTime.currenUnix();
      const expired_time = currentTime + 30 * 1000;
      const result = await this.update(
        con,
        tableName.tableUser,
        {
          verify_token: token,
          expired_time: expired_time,
          updated_at: currentTime,
        },
        "email",
        [email]
      );
      await emailService.sendAccountInformation(email, token);
      if (result.affectedRows === 0) {
        throw new BusinessLogicError("Failed to resend verify code", [], 500);
      }
      return {
        message: "Resend verify code successfully",
      };
    } catch (e) {
      throw e;
    }
  }
  async changePassword(con, id, password) {
    try {
      const result = await this.update(
        con,
        tableName.tableUser,
        {
          password: password,
          updated_at: getTime.currenUnix(),
        },
        "id",
        [id]
      );
      return {
        message: "Password updated successfully",
      };
    } catch (e) {
      throw e;
    }
  }
  async updateUserStatus(con, id) {
    try {
      const user = await this.getUserByUserId(con, id);
      if (!user) {
        throw new BusinessLogicError("User not found", [], 404);
      }
      if (user.role === "admin") {
        throw new BusinessLogicError("Cannot update status of admin", [], 500);
      }
      let status = 0;
      if (user.status === 1) {
        status = 0;
      } else {
        status = 1;
      }
      const result = await this.update(
        con,
        tableName.tableUser,
        {
          status: status,
          updated_at: getTime.currenUnix(),
        },
        "id",
        [id]
      );
      return {
        message: "User status updated successfully",
      };
    } catch (e) {
      throw e;
    }
  }
  async getListUser(conn, keyword, offset, limit, role, status) {
    try {
      let whereCount = `SELECT COUNT(*) AS total FROM ${tableName.tableUser} WHERE 1=1`;
      let conditionsCount = [];
      if (keyword) {
        whereCount += " AND (username LIKE ? OR email LIKE ?)";
        conditionsCount.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (role) {
        whereCount += " AND role = ?";
        conditionsCount.push(role);
      }
      if (status !== undefined) {
        whereCount += " AND status = ?";
        conditionsCount.push(status);
      }
      const countQuery = conn.promise().query(whereCount, conditionsCount);

      let whereData = `SELECT id,username,email,verify_token,expired_time,is_verify,role,status,created_at, updated_at FROM ${tableName.tableUser} WHERE 1=1`;
      let conditionsData = [];

      if (keyword) {
        whereData += " AND (username LIKE ? OR email LIKE ?)";
        conditionsData.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (role) {
        whereData += " AND role = ?";
        conditionsData.push(role);
      }
      if (status !== undefined) {
        whereData += " AND status = ?";
        conditionsData.push(status);
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
}
module.exports = new UserModel();
