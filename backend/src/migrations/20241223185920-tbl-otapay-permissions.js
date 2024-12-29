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

const tableName = "tbl_otapay_permissions";
exports.up = async function (db) {
  try {
    await db.createTable(tableName, {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: { type: "string", length: 100, unique: true },
      platform: { type: "string", length: 10 },
      status: { type: "int", length: 45 },
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
