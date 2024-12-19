const {
  Api404Error,
  BaseError,
  BusinessLogicError,
  Api401Error,
  Api403Error,
} = require("../core/error.response");
const verifyToken = (req, res, next) => {
  const token = req.headers["x-mobicam-token"];
  if (!token) {
    return next(new Api401Error("No token provided"));
  }
  const user = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  if (user) {
    req.user_id = user.user_id;
    req.parent_id = user.parent_id;
    next();
  } else {
    return next(new Api401Error("Unauthorized"));
  }
};
module.exports = {
  verifyToken,
};
