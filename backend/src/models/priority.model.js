const { tableConnectionType } = require("../constants/tableName.constant");
const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");
const PrioritySchema = require("./schema/priority.schema");
const checkData = require("../ultils/checkValidate");
const { BusinessLogicError } = require("../core/error.response");

class PorityModel extends DatabaseModel {
  constructor() {
    super();
  }

  async getAllRows(con, status, keyword, offset, limit) {
    const countQuery = `SELECT COUNT(*) AS total FROM ${tableName.tablePriorityTask} WHERE is_deleted = ? AND name LIKE ?`;
    const countValues = [status, `%${keyword}%`];
    const totalRecords = await new Promise((resolve, reject) => {
      con.query(countQuery, countValues, (err, dataRes) => {
        if (err) {
          console.log(err);
          return reject({ msg: err });
        }
        return resolve(dataRes[0].total);
      });
    });

    const totalPages = Math.ceil(totalRecords / limit);

    const dataQuery = `SELECT * FROM ${tableName.tablePriorityTask} WHERE is_deleted = ? AND name LIKE ? LIMIT ? OFFSET ?`;
    const dataValues = [status, `%${keyword}%`, limit, offset];
    const data = await new Promise((resolve, reject) => {
      con.query(dataQuery, dataValues, (err, dataRes) => {
        if (err) {
          console.log(err);
          return reject({ msg: err });
        }
        return resolve(dataRes);
      });
    });
    return {
      totalRecords,
      totalPages,
      data,
    };
  }

  async post(con, name, des, level) {
    const checkDataPriority = await checkData.checkUnique(
      con,
      tableName.tablePriorityTask,
      "name = ?",
      [name]
    );
    if (checkDataPriority === false)
      throw new BusinessLogicError("Name đã tồn tại", [], 500);
    const data = new PrioritySchema({
      name: name,
      des: des,
      level: level || 0,
      is_deleted: 0,
      created_at: Date.now(),
    });
    const res = await this.insertUnique(
      con,
      tableName.tablePriorityTask,
      data,
      "name"
    );
    return res;
  }
  async getById(con, id, statusCodes) {
    let where = `id =?`;
    let conditions = [id];
    if (statusCodes !== null && statusCodes !== undefined) {
      where += ` AND is_deleted = ?`;
      conditions.push(statusCodes);
    }
    const selectData = `*`;
    const result = await this.select(
      con,
      tableName.tablePriorityTask,
      selectData,
      where,
      conditions
    );
    return result;
  }
  async updateById(con, id, name, des, level) {
    let query = `UPDATE ${tableName.tablePriorityTask} SET `;
    let data = [];

    if (name !== undefined && name !== null) {
      const checkDataUnique = await checkData.checkUnique(
        con,
        tableName.tablePriorityTask,
        "name = ?",
        [name],
        id
      );
      if (!checkDataUnique)
        throw new BusinessLogicError("Name đã tồn tại", [], 500);
      query += `name = ? `;
      data.push(name);
    }
    if (des !== undefined && des !== null) {
      if (data.length > 0) query += `, `;
      query += `des = ?`;
      data.push(des);
    }
    if (level !== undefined && level !== null) {
      if (data.length > 0) query += `, `;
      query += `level =?`;
      data.push(level);
    }
    if (data.length > 0) query += `, `;
    query += `updated_at = ?`;
    data.push(Date.now());

    query += ` WHERE id = ?`;
    data.push(id);

    if (data.length > 0) {
      return await new Promise((resolve, reject) => {
        con.query(query, data, (err, dataRes) => {
          if (err) {
            console.log(err);
            return reject({ msg: ERROR });
          }
          if (dataRes.affectedRows > 0) {
            return resolve([]);
          } else {
            return resolve({ msg: "No rows updated" });
          }
        });
      });
    }
    return null;
  }
  async deleteById(con, id) {
    const getCurrentStatusQuery = `SELECT is_deleted FROM ${tableName.tablePriorityTask} WHERE id = ?`;

    try {
      const currentStatus = await new Promise((resolve, reject) => {
        con.query(getCurrentStatusQuery, [id], (err, result) => {
          if (err) {
            console.log(err);
            return reject({ msg: ERROR });
          }
          if (result.length > 0) {
            return resolve(result[0].is_deleted);
          }
          return reject({ msg: "Not found" });
        });
      });

      const newStatus = currentStatus === 0 ? 1 : 0;

      const updateStatusQuery = `UPDATE ${tableName.tablePriorityTask} SET is_deleted = ?, updated_at = ? WHERE id = ?`;

      const result = await new Promise((resolve, reject) => {
        con.query(
          updateStatusQuery,
          [newStatus, Date.now(), id],
          (err, dataRes) => {
            if (err) {
              console.log(err);
              return reject({ msg: ERROR });
            }
            if (dataRes.affectedRows > 0) {
              return resolve([]);
            } else {
              return resolve({ msg: "No rows updated" });
            }
          }
        );
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new PorityModel();
