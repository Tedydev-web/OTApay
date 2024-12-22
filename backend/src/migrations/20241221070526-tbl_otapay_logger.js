"use strict";
const getTime = require("../ultils/getTime");
var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const tableName = "tbl_otapay_logger";
exports.up = async function (db) {
  try {
    await db.createTable(tableName, {
      id: { type: "bigint", primaryKey: true, autoIncrement: true },
      timestamp: { type: "bigint", defaultValue: getTime.currenUnix() },
      method: { type: "varchar", length: 10 },
      user_id: { type: "int" },
      level: { type: "varchar", length: 100 },
      ip_address: { type: "varchar", length: 45 },
      url: { type: "text" },
      user_agent: { type: "text" },
      status_code: { type: "int" },
      message: { type: "text" },
      error_message: { type: "text" },
      metadata: { type: "json" },
      context: { type: "text" },
      file_name: { type: "varchar", length: 225 },
      line_number: { type: "int" },
      stack_trace: { type: "text" },
    });
    console.log(`Table ${tableName} created successfully.`);
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
    throw error;
  }
};

exports.down = async function (db) {
  try {
    await db.dropTable(tableName);
    console.log(`Table ${tableName} dropped successfully.`);
  } catch (error) {
    console.error(`Error dropping table ${tableName}:`, error);
    throw error;
  }
};

exports._meta = {
  version: 1,
};
