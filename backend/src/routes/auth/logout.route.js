const authController = require("../../controllers/auth.controller");
const router = require("express").Router();

module.exports = (app) => {
  router.post("/logout", authController.logout);
  
  app.use("/api/v1/user/auth", router);
}; 