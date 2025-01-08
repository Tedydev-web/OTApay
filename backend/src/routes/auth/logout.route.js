const authController = require("../../controllers/auth.controller");
const router = require("express").Router();
const authentication = require("../middlewares/authentication");
module.exports = (app) => {
  router.post("/logout", [], authentication, authController.logout);

  app.use("/api/v1/user/auth", router);
};
