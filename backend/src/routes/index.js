const loginRoute = require("./auth/login.route");
const logoutRoute = require("./auth/logout.route");
const userRoute = require("./user.route");

function route(app) {
  loginRoute(app);
  logoutRoute(app);
  userRoute(app);
}

module.exports = route;
