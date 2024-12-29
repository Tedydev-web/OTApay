const router = require("express").Router();
const {
  VALIDATE_DATA,
  NOT_EMPTY,
  INVALID_IS_DELETED,
} = require("../constants/msg.constant");
const UserController = require("../controllers/user.controller");
const { body, query, param } = require("express-validator");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const moduleName = require("../constants/moduleName.constant");

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
    authentication,
    authorization(moduleName.userCreate),
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
    authentication,
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
        .isString()
        .withMessage(VALIDATE_DATA)
        .isLength({ min: 6, max: 16 })
        .withMessage("Password length is minimum 6 and maximum 16"),
      body("confirm_password", NOT_EMPTY)
        .notEmpty()
        .isString()
        .withMessage(VALIDATE_DATA)
        .isLength({ min: 6, max: 16 })
        .withMessage("Password length is minimum 6 and maximum 16"),
    ],
    UserController.createPassword
  );
  router.put(
    "/update-user-status/:id",
    [],
    authentication,
    authorization(moduleName.userUpdateStatus),
    UserController.updateUserStatus
  );
  router.get(
    "/get-user-by-id/:id",
    [],
    authentication,
    authorization(moduleName.userGet),
    UserController.getUserByUserId
  );
  router.get(
    "/get-user-by-token",
    [],
    authentication,
    UserController.getUserByToken
  );
  router.get(
    "/get-user-by-email/:email",
    [],
    authentication,
    authorization(moduleName.userGet),
    UserController.getUserByEmail
  );
  // router.get("/get-list-user");
  // router.patch("/update-user");
  app.use("/api/v1/user", router);
};
