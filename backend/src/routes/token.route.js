const router = require("express").Router();
const {
  VALIDATE_DATA,
  NOT_EMPTY,
  INVALID_IS_DELETED,
} = require("../constants/msg.constant");
const { body, query, param } = require("express-validator");
const TokenController = require("../controllers/token.controller");
const authentication = require("../middlewares/authentication");

module.exports = (app) => {
  router.post(
    "/refresh-token",
    [body("token", NOT_EMPTY).notEmpty().isString().withMessage(VALIDATE_DATA)],
    TokenController.refreshToken
  );
  router.put("/refresh-token", authentication, TokenController.logout);
  app.use("/api/v1/token", router);
};
