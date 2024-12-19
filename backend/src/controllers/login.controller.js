const loginService = require("../services/login.service");
const { GET, CREATED, UPDATE, DELETE } = require("../core/success.response");
const catchAsync = require("../helper/catchAsync.helper");
class LoginService {
  login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const result = await loginService.login(email, password);
    GET(res, result);
  });
}
module.exports = new LoginService();
