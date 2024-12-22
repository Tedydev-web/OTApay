class checkValidateData {
  static async checkIsExist(con, tableName, field, value, exceptedId) {
    try {
      if (!tableName || !field || !value) {
        throw new Error("Invalid parameters.");
      }

      let query = `SELECT id FROM ?? WHERE ?? = ?`;
      let data = [tableName, field, value];

      if (exceptedId) {
        query += ` AND id != ?`;
        data.push(exceptedId);
      }
      try {
        const result = await new Promise((resolve, reject) => {
          con.query(query, data, (err, dataRes) => {
            if (err) {
              console.log(err);
              return reject({ msg: "Database error: " + err.message });
            }
            resolve(dataRes);
          });
        });

        if (result.length === 0) {
          return false;
        } else {
          return true;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    } catch (e) {
      throw e;
    }
  }
  static async validateGmailFormat(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
}

module.exports = checkValidateData;
