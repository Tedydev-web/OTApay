const { ERROR, ALREADY_EXITS } = require("../constants/msg.constant");

const DatabaseModel = require("./database.model");

class ValidateModel extends DatabaseModel {
  constructor() {
    super();
  }

  async checkExitValue(
    conn,
    table,
    field,
    condition,
    msgError,
    param,
    id = null
  ) {
    let where = `${field} = ? AND is_deleted = ?`;
    const conditions = [condition, 0];

    if (id) {
      where += ` AND id <> ?`;
      conditions.push(id);
    }

    const dataCheck = await this.select(conn, table, "id", where, conditions);

    if (dataCheck.length > 0)
      throw {
        msg: ERROR,
        errors: [
          {
            value: condition,
            msg: `${msgError} ${ALREADY_EXITS}`,
            param,
          },
        ],
      };

    return [];
  }
}

module.exports = new ValidateModel();
