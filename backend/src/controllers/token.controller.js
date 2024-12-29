const tokenService = require("../services/tokens.service");
const { GET, CREATED, UPDATE, DELETE } = require("../core/success.response");
const catchAsync = require("../helper/catchAsync.helper");

class TokenController {
  refreshToken = catchAsync(async (req, res, next) => {
    const { token } = req.body;
    const result = await tokenService.refreshToken(token);
    GET(res, result);
  });
  logout = catchAsync(async (req, res, next) => {
    const token = req.headers["x-otapay"];
    const result = await tokenService.logout(token);
    UPDATE(res, result);
  });
}
module.exports = new TokenController();
