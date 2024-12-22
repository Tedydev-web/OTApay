module.exports = (app) => {
  require("./auth/login.route")(app);
  require("./user.route")(app);
};
