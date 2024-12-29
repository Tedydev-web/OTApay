const loginController = require("../../controllers/login.controller");
const router = require("express").Router();
const { body } = require("express-validator");
const { NOT_EMPTY, VALIDATE_DATA } = require("../../constants/msg.constant");

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
