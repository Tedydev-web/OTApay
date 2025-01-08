const router = require("express").Router();
const {
  VALIDATE_DATA,
  NOT_EMPTY,
  INVALID_IS_DELETED,
} = require("../constants/msg.constant");
const { body, query, param } = require("express-validator");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const moduleName = require("../constants/moduleName.constant");
const emailSettingController = require("../controllers/email.setting.controller");
module.exports = (app) => {
  router.get(
    "/",
    [],
    authentication,
    authorization(moduleName.emailSettingGet),
    emailSettingController.get
  );
  router.patch(
    "/update",
    [
      body("mail_from_name", VALIDATE_DATA)
        .optional()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("mail_from_address", VALIDATE_DATA)
        .optional()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("mail_host", VALIDATE_DATA)
        .optional()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("mail_port", VALIDATE_DATA)
        .optional()
        .isNumeric()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("mail_username", VALIDATE_DATA)
        .optional()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("mail_password", VALIDATE_DATA)
        .optional()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
    ],
    authentication,
    authorization(moduleName.emailSettingUpdate),
    emailSettingController.update
  );
  router.post(
    "/test-send-mail",
    [
      body("email", VALIDATE_DATA)
        .optional()
        .isEmail()
        .withMessage(VALIDATE_DATA)
        .escape(),
    ],
    authentication,
    authorization(moduleName.emailTestSendMail),
    emailSettingController.emailTestSendMail
  );
  app.use("/api/v1/email-setting", router);
};
