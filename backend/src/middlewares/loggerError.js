const {
  Api404Error,
  BaseError,
  BusinessLogicError,
  Api401Error,
  Api403Error,
} = require("../core/error.response");
const db = require("../dbs/init.mysql");
const loggerModel = require("../models/logger.model");
const getTime = require("../ultils/getTime");
const loggerSchema = require("../models/schema/logger.schema");

const LoggerError = async (err, req, res, next) => {
  const { conn } = await db.getConnection();
  try {
    const originalJson = res.json;
    const originalSend = res.send;

    let responseBody = null;

    res.json = function (body) {
      responseBody = body;
      return originalJson.call(this, body);
    };

    res.send = function (body) {
      responseBody = body;
      return originalSend.call(this, body);
    };
    res.on("finish", async () => {
      if (typeof responseBody === "string") {
        responseBody = JSON.parse(responseBody);
      }
      if (responseBody) {
        const loggerSchemaData = new loggerSchema();
        loggerSchemaData.timestamp = getTime.currenUnix();
        loggerSchemaData.method = req.method;
        loggerSchemaData.user_id = req.user?.id || null;
        loggerSchemaData.ip_address = req.ip;
        loggerSchemaData.url = req.originalUrl;
        loggerSchemaData.user_agent = req.headers["user-agent"];
        loggerSchemaData.status_code = res.statusCode;
        loggerSchemaData.level =
          res.statusCode >= 100 && res.statusCode < 299
            ? "INFO"
            : res.statusCode >= 300 && res.statusCode < 399
            ? "WARNING"
            : res.statusCode >= 400 && res.statusCode < 499
            ? "ERROR"
            : "SERVER ERROR";
        if (res.statusCode >= 400) {
          loggerSchemaData.error_message = responseBody?.message;
        } else {
          loggerSchemaData.message = responseBody?.message;
        }
        loggerSchemaData.metadata = JSON.stringify(responseBody || {});
        loggerSchemaData.context = JSON.stringify(req.headers);

        if (err?.stack) {
          const stackLines = err.stack.split("\n");
          const match = stackLines[1]?.match(/\((.*):(\d+):(\d+)\)/);
          if (match) {
            loggerSchemaData.file_name = match[1];
            loggerSchemaData.line_number = parseInt(match[2], 10);
          }
          loggerSchemaData.stack_trace = err.stack;
        }

        await loggerModel.write(conn, loggerSchemaData);
      }
    });
    if (err) {
      next(err);
    }
    next();
  } catch (e) {
    console.error("Logger middleware error:", e);
    next(e);
  } finally {
    if (conn) {
      try {
        conn.release();
      } catch (releaseError) {
        console.error("Failed to release connection:", releaseError);
      }
    }
  }
};

module.exports = LoggerError;
