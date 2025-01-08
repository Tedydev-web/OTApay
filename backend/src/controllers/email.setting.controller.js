const { GET, CREATED, UPDATE, DELETE } = require("../core/success.response");
const catchAsync = require("../helper/catchAsync.helper");
const emailSettingService = require("../services/email.setting.service");
const userService = require("../services/user.service")
class EmailSettingController {
  get = catchAsync(async (req, res, next) => {
    const result = await emailSettingService.getEmailSetting();
    GET(res, result);
  });
  update = catchAsync(async (req, res, next) => {
    const {
      mail_from_name,
      mail_from_address,
      mail_host,
      mail_port,
      mail_username,
      mail_password,
    } = req.body;
    const result = await emailSettingService.update(
      mail_from_name,
      mail_from_address,
      mail_host,
      mail_port,
      mail_username,
      mail_password
    );
    UPDATE(res, result);
  });
  emailTestSendMail = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const result = await userService.emailTestSendMail(email);
    CREATED(res, result);
  });
}
module.exports = new EmailSettingController();
