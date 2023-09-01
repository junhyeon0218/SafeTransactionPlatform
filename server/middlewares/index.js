const isAuth = require("./isAuth");
const uploader = require("./uploader");
const secure = require("./secure");
const validateRequest = require("./validation");
const { errorConvert, globalErrorHandler } = require("./error");

module.exports = {
  isAuth,
  uploader,
  secure,
  errorConvert,
  globalErrorHandler,
  validateRequest,
};
