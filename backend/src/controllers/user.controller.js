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
    const userId = req.user.id;
    const { old_password, new_password, confirm_password } = req.body;
    const result = await userService.changePassword(
      userId,
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
  updateUserStatus = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await userService.updateUserStatus(id);
    UPDATE(res, result);
  });
  getUserByUserId = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const result = await userService.getUserByUserId(userId);
    delete result.password;
    GET(res, result);
  });
  getUserByToken = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await userService.getUserByUserId(userId);
    delete result.password;
    GET(res, result);
  });
  getUserByEmail = catchAsync(async (req, res, next) => {
    const email = req.params.email;
    const result = await userService.getUserByEmail(email);
    delete result.password;
    GET(res, result);
  });
  getListUser = catchAsync(async (req, res, next) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const keyword = req.query.keyword || "";
    const role = req.query.role || "user";
    const status = req.query.status || "1";
    const result = await userService.getListUser(
      keyword,
      offset,
      limit,
      role,
      status
    );
    GET(res, result.data, result.totalPages, result.totalRecord);
  });
}
module.exports = new UserService();
