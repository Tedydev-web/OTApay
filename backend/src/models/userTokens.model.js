const DatabaseModel = require("./database.model");
const tableName = require("../constants/tableName.constant");
const { BusinessLogicError } = require("../core/error.response");
const userTokensSchema = require("./schema/userTokens.schema");
const getTime = require("../ultils/getTime");

class UserTokensModel extends DatabaseModel {
  constructor() {
    super();
  }
  async addNewToken(con, userId, token, expires_at, type) {
    try {
      const userToken = {
        user_id: userId,
        token: token,
        expires_at: expires_at,
        status: 0,
        token_type: type,
        created_at: getTime.currenUnix(),
      };

      const fields =
        "user_id, token, expires_at, status, token_type, created_at"; // Các trường trong bảng
      const dataInsert = [
        [
          userToken.user_id,
          userToken.token,
          userToken.expires_at,
          userToken.status,
          userToken.token_type,
          userToken.created_at,
        ],
      ];

      // Cập nhật expires_at và status nếu trùng lặp token (tùy theo yêu cầu của bạn)
      const dataUpdate = `expires_at = VALUES(expires_at), status = VALUES(status)`;

      const result = await this.insertDuplicate(
        con,
        tableName.tableUserTokens,
        fields,
        dataInsert,
        dataUpdate
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
  async getTokenByUserIdAndToken(con, userId, token) {
    try {
      const result = await this.select(
        con,
        tableName.tableUserTokens,
        "id,user_id,token,status,token_type,created_at,updated_at,expires_at",
        `user_id = ${userId} AND token = '${token}'`,
        []
      );
      if (result.length === 0) {
        throw new BusinessLogicError("Token is not found", [], 404);
      }
      return result[0];
    } catch (error) {
      throw error;
    }
  }
  async deleteByToken(con, token) {
    try {
      const timestamp = getTime.currenUnix();
      let query = `UPDATE ${tableName.tableUserTokens} SET status = ?, updated_at = ? WHERE token = ?`;
      let data = [1, timestamp, token];

      const result = await new Promise((resolve, reject) => {
        con.query(query, data, (err, dataRes) => {
          if (err) {
            return reject(err);
          }
          resolve(dataRes);
        });
      });
      if (result.affectedRows === 0) {
        return {
          message: "Delete failed",
        };
      }
      return {
        message: "Delete successfully",
      };
    } catch (error) {
      throw error;
    }
  }
  async deleteTokenByUserId(con, id) {
    try {
      const timestamp = getTime.currenUnix();
      let query = `UPDATE ${tableName.tableUserTokens} SET status = ?, updated_at = ? WHERE user_id = ?`;
      let data = [1, timestamp, id];

      const result = await new Promise((resolve, reject) => {
        con.query(query, data, (err, dataRes) => {
          if (err) {
            console.log(err);
            return reject({ msg: "Database error: " + err.message });
          }
          resolve(dataRes); // Resolve result here
        });
      }); // Close Promise here

      if (result.affectedRows === 0) {
        return {
          message: "Delete failed",
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new UserTokensModel();
