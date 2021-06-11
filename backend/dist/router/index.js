"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tickets = _interopRequireDefault(require("./tickets.js"));

var _login = _interopRequireDefault(require("./login.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = [_tickets["default"], _login["default"]];
exports["default"] = _default;