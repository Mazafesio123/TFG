"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dirname = _path["default"].resolve(_path["default"].dirname(''));

_dotenv["default"].config({
  path: _dirname + '\\src\\.env'
});

var _default = {
  PORT: process.env.APP_PORT,
  MONGO: process.env.MONGO_URL,
  SECRET: process.env.SECRET,
  FRONTEND: process.env.APP_FRONTEND
};
exports["default"] = _default;