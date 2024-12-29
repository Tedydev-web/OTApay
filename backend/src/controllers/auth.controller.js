const { OK } = require("../core/success.response");
const catchAsync = require("../helper/catchAsync.helper");
const { getRedis } = require("../dbs/init.redis");

class AuthController {
  logout = catchAsync(async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        // Lưu token vào blacklist với thời gian hết hạn
        const redis = getRedis().instanceConnect;
        if (redis) {
          await redis.set(`bl_${token}`, 'true', {
            EX: 24 * 60 * 60 // 24 giờ
          });
        }
      }
    } catch (error) {
      console.error('Redis error:', error);
      // Tiếp tục xử lý logout ngay cả khi có lỗi Redis
    }
    
    OK(res, {}, {}, "Logout successfully");
  });
}

module.exports = new AuthController(); 