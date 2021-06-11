"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageSchema = exports.userSchema = exports.ticketSchema = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var ticketSchema = new Schema({
  _id: _mongoose["default"].Schema.Types.ObjectId,
  title: String,
  author: _mongoose["default"].Schema.Types.ObjectId,
  messages: [{
    text: String,
    date: Number,
    author: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: 'author'
    },
    file: Object
  }],
  user: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "user"
  }],
  date: {
    type: Number,
    "default": new Date().getTime()
  },
  state: String
});
exports.ticketSchema = ticketSchema;
var userSchema = new Schema({
  _id: _mongoose["default"].Schema.Types.ObjectId,
  username: String,
  email: String,
  password: String,
  defaultPassword: Boolean,
  unido_en: Number,
  img: String,
  online: Boolean,
  admin: Boolean
});
exports.userSchema = userSchema;
var imageSchema = new Schema({
  type: String,
  data: Buffer
});
exports.imageSchema = imageSchema;