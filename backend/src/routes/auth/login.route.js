const loginController = require("../../controllers/login.controller");
const router = require("express").Router();
const {
  VALIDATE_DATA,
  NOT_EMPTY,
  INVALID_IS_DELETED,
} = require("../../constants/msg.constant");
const { body, query, param } = require("express-validator");
module.exports = (app) => {
  router.post(
    "/login",
    [
      body("email", NOT_EMPTY)
        .notEmpty()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("password", NOT_EMPTY)
        .notEmpty()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
    ],
    loginController.login
  );
  app.use("/api/v1/user/auth", router);
};
