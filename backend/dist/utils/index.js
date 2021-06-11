"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLogged = isLogged;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isLogged(token) {
  try {
    _jsonwebtoken["default"].verify(token, process.env.SECRET);

    return true;
  } catch (error) {
    return false;
  }
}