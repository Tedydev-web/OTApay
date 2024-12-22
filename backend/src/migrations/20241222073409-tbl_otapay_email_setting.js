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
const tableName = "tbl_otapay_email_setting";
exports.up = async function (db) {
  try {
    await db.createTable(tableName, {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      mail_from_name: { type: "string", length: 255 },
      mail_from_address: { type: "string", length: 255 },
      mail_host: { type: "string", length: 255 },
      mail_port: { type: "int" },
      mail_username: { type: "string", length: 255 },
      mail_password: { type: "string", length: 255 },
      created_at: { type: "bigint", defaultValue: getTime.currenUnix() },
      updated_at: { type: "bigint" },
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
