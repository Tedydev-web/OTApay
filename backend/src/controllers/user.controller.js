const userService = require("../services/user.service");
const { GET, CREATED, UPDATE, DELETE } = require("../core/success.response");
const catchAsync = require("../helper/catchAsync.helper");
class UserService {
  createNewUser = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const result = await userService.createNewUser(email);
    CREATED(res, result);
  });
  confirmVerifyCode = catchAsync(async (req, res, next) => {
    const { email, verifyCode } = req.body;
    const result = await userService.confirmVerifyCode(email, verifyCode);
    GET(res, result);
  });
  resendVerifyCode = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const result = await userService.resendVerifyCode(email);
    GET(res, result);
  });
  changePassword = catchAsync(async (req, res, next) => {
    const { email, old_password, new_password, confirm_password } = req.body;
    const result = await userService.changePassword(
      email,
      old_password,
      new_password,
      confirm_password
    );
    UPDATE(res, result);
  });
  createPassword = catchAsync(async (req, res, next) => {
    const { email, new_password, confirm_password } = req.body;
    const result = await userService.createPassword(
      email,
      new_password,
      confirm_password
    );
    CREATED(res, result);
  });
}
module.exports = new UserService();
