const UserModel = require("../models/user.model"); // Assuming you have a User model
const checkValidate = require("../ultils/checkValidate");
const { BusinessLogicError } = require("../core/error.response");
const db = require("../dbs/init.mysql");
const hash = require("../ultils/hash");
class UserService {
  async createNewUser(email) {
    const { conn } = await db.getConnection();
    try {
      const validate = checkValidate.validateGmailFormat(email);
      if (!validate) {
        throw new BusinessLogicError("Email is not valid", [], 500);
      }
      const result = UserModel.createNewUser(conn, email);
      return result;
    } catch (error) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async confirmVerifyCode(email, verifyCode) {
    const { conn } = await db.getConnection();
    try {
      const result = UserModel.confirmVerifyCode(conn, email, verifyCode);
      return result;
    } catch (error) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async resendVerifyCode(email) {
    const { conn } = await db.getConnection();
    try {
      const result = UserModel.resendVerifyCode(conn, email);
      return result;
    } catch (error) {
      throw e;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async changePassword(userId, old_password, new_password, confirm_password) {
    const { conn } = await db.getConnection();
    try {
      const user = await UserModel.getUserByUserId(conn, userId);
      if (!user) {
        throw new BusinessLogicError("User is not existed", [], 500);
      }
      const isCorrectPassword = await hash.checkPassword(
        old_password,
        user.password
      );
      if (!isCorrectPassword) {
        return new BusinessLogicError("Incorrect old password", [], 500);
      }
      if (new_password !== confirm_password) {
        return new BusinessLogicError(
          "Password and confirm password not match",
          [],
          500
        );
      }
      const hashedPassword = await hash.hashPassword(new_password);
      const result = UserModel.changePassword(conn, userId, hashedPassword);
      return {
        message: "Password updated successfully",
      };
    } catch (error) {
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async createPassword(email, new_password, confirm_password) {
    const { conn } = await db.getConnection();
    try {
      const user = await UserModel.getUserByEmail(conn, email);
      if (!user) {
        throw new BusinessLogicError("User is not existed", [], 500);
      }
      if (new_password !== confirm_password) {
        return new BusinessLogicError(
          "Password and confirm password not match",
          [],
          500
        );
      }
      const result = UserModel.changePassword(
        conn,
        user.id,
        await hash.hashPassword(new_password)
      );
      return result;
    } catch (error) {
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async updateUserStatus(id) {
    const { conn } = await db.getConnection();
    try {
      const result = UserModel.updateUserStatus(conn, id);
      return result;
    } catch (error) {
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async getUserByUserId(userId) {
    const { conn } = await db.getConnection();
    try {
      const result = UserModel.getUserByUserId(conn, userId);
      return result;
    } catch (error) {
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  async getUserByEmail(email) {
    const { conn } = await db.getConnection();
    try {
      const result = UserModel.getUserByEmail(conn, email);
      return result;
    } catch (error) {
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

module.exports = new UserService();
