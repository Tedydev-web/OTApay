const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const configureEnvironment = require("../config/dotenv.config");
const {
  APP_KEY
} = configureEnvironment();
const db = require("../dbs/init.mysql");
const { BusinessLogicError } = require("../core/error.response");
const validateModel = require("../models/validate.model");
const { tableConnectionType, tableAIUserChat } = require("../constants/tableName.constant");

class Hash {
  // Hàm mã hóa mật khẩu
  async hashPassword(password) {
    try {
      // Tạo salt với 10 vòng (rounds)
      const salt = await bcrypt.genSalt(10);
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (err) {
      console.error("Error hashing password:", err);
      throw new Error("Error hashing password");
    }
  }

  async checkPassword(enteredPassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
      return isMatch;
    } catch (err) {
      console.error("Error comparing passwords:", err);
      throw new Error("Error comparing passwords");
    }
  }

  async encrypt(value) {
    try {
      const getPartAppKey = APP_KEY.split(":")[1];
      const enAppKey = Buffer.from(getPartAppKey, 'base64');
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', enAppKey, iv);
      let encrypted = cipher.update(value, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      return `${iv.toString('base64')}:${encrypted}`;
    } catch (e) {
      throw e;
    }
  }

  async decrypt(encryptedValue) {
    try {
      const getPartAppKey = APP_KEY.split(":")[1];
      const enAppKey = Buffer.from(getPartAppKey, 'base64');
      const [ivBase64, encryptedData] = encryptedValue.split(':');
      if (!ivBase64 || !encryptedData) {
        throw new BusinessLogicError("Invalid encrypted value format", [], 500);
      }
      const iv = Buffer.from(ivBase64, 'base64');
      if (iv.length !== 16) {
        throw new BusinessLogicError("Invalid initialization vector (IV) length", [], 500);
      }

      const decipher = crypto.createDecipheriv('aes-256-cbc', enAppKey, iv);
      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      throw e;
    }
  }

}
module.exports = new Hash();