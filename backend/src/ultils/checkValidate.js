class checkValidateData {
  static async checkUnique(con, tableName, field, value, exceptedId) {
    let query = `SELECT id FROM ${tableName} WHERE ${field}`;
    let data = value;
    if (exceptedId) {
      query += ` AND id!=?`;
      data.push(exceptedId);
    }
    const result = await new Promise((resolve, reject) => {
      con.query(query, data, (err, dataRes) => {
        if (err) {
          console.log(err);
          return reject({ msg: ERROR });
        }
        resolve(dataRes);
      });
    });
    if (result.length === 0) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = checkValidateData;
