const db = require("../dbs/init.mysql");
const priority = require("../models/priority.model");
const { BusinessLogicError } = require("../core/error.response");
const validateModel = require("../models/validate.model");
const { tableConnectionType } = require("../constants/tableName.constant");

class PriorityService {
  async getAll(status, keyword, offset, limit) {
    try {
      const { conn } = await db.getConnection();
      try {
        const result = await priority.getAllRows(
          conn,
          status,
          keyword,
          offset,
          limit
        );
        return result;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async post(name, des, level) {
    try {
      const { conn } = await db.getConnection();
      try {
        const result = await priority.post(conn, name, des, level);
        return result;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
  async updateById(id, name, des, level) {
    try {
      const { conn } = await db.getConnection();
      const priorityReusult = await priority.getById(conn, id);
      if (priorityReusult.length === 0) {
        throw new BusinessLogicError("Không tìm thấy priority id", [], 500);
      }
      const updatedPriority = await priority.updateById(
        conn,
        id,
        name,
        des,
        level
      );
      return updatedPriority;
    } catch (error) {
      throw error;
    }
  }
  async getById(id, status) {
    try {
      const { conn } = await db.getConnection();
      const priorityResult = await priority.getById(conn, id, status);
      // if (priorityResult.length === 0) {
      //   throw new BusinessLogicError("Priority not found", [], 500);
      // }
      return priorityResult;
    } catch (error) {
      throw error;
    }
  }
  async deleteById(id) {
    try {
      const { conn } = await db.getConnection();
      const priorityCheck = await priority.getById(conn, id);
      if (priorityCheck.length === 0) {
        throw new BusinessLogicError("Priority not found", [], 500);
      }
      const result = await priority.deleteById(conn, id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PriorityService();
