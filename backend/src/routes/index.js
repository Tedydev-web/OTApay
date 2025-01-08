module.exports = (app) => {
  require("./auth/login.route")(app);
  require("./user.route")(app);
  require("./token.route")(app);
  require("./permissions.route")(app);
  require("./feature.route")(app);
  require("./email.setting.route")(app);
};
