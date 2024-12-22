const router = require("express").Router();
const {
  VALIDATE_DATA,
  NOT_EMPTY,
  INVALID_IS_DELETED,
} = require("../constants/msg.constant");
const UserController = require("../controllers/user.controller");
const { body, query, param } = require("express-validator");

module.exports = (app) => {
  router.post(
    "/create",
    [
      body("email", NOT_EMPTY)
        .notEmpty()
        .isEmail()
        .withMessage(VALIDATE_DATA)
        .escape(),
    ],
    UserController.createNewUser
  );
  router.post(
    "/verify-code",
    [
      body("email", NOT_EMPTY)
        .notEmpty()
        .isEmail()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("verifyCode", NOT_EMPTY)
        .notEmpty()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
    ],
    UserController.confirmVerifyCode
  );
  router.post(
    "/resend-verify-code",
    [
      body("email", NOT_EMPTY)
        .notEmpty()
        .isEmail()
        .withMessage(VALIDATE_DATA)
        .escape(),
    ],
    UserController.resendVerifyCode
  );
  router.put(
    "/change-password",
    [
      body("email", NOT_EMPTY)
        .notEmpty()
        .isEmail()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("old_password", NOT_EMPTY)
        .notEmpty()
        .isNumeric()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("new_password", NOT_EMPTY)
        .notEmpty()
        .isNumeric()
        .withMessage(VALIDATE_DATA)
        .isLength({ min: 6, max: 16 })
        .withMessage("Password length is minimum 6 and maximum 16")
        .escape(),
      body("confirm_password", NOT_EMPTY)
        .notEmpty()
        .isNumeric()
        .withMessage(VALIDATE_DATA)
        .isLength({ min: 6, max: 16 })
        .withMessage("Password length is minimum 6 and maximum 16")
        .escape(),
    ],
    UserController.changePassword
  );
  router.put(
    "/create-password",
    [
      body("email", NOT_EMPTY)
        .notEmpty()
        .isEmail()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("new_password", NOT_EMPTY)
        .notEmpty()
        .isNumeric()
        .withMessage(VALIDATE_DATA)
        .isLength({ min: 6, max: 16 })
        .withMessage("Password length is minimum 6 and maximum 16")
        .escape(),
      body("confirm_password", NOT_EMPTY)
        .notEmpty()
        .isNumeric()
        .withMessage(VALIDATE_DATA)
        .isLength({ min: 6, max: 16 })
        .withMessage("Password length is minimum 6 and maximum 16")
        .escape(),
    ],
    UserController.createPassword
  );
  app.use("/api/v1/user", router);
};
