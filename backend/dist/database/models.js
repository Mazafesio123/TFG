"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageModel = exports.userModel = exports.ticketModel = exports.connection = void 0;

var _db = _interopRequireDefault(require("./db.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _schema = require("./schema.js");

var _config = _interopRequireDefault(require("../config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// mongoose.connect("mongodb://mongo:27017/tfg", {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });
var conn = function () {
  return new Promise( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _mongoose["default"].connect(_config["default"].MONGO, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
              });

            case 3:
              resolve(_mongoose["default"].connection);
              _context.next = 9;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              console.log("error: " + _context.t0);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 6]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
}(); // const mongo = connectDb().then( res => console.log(res) )


var connection = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return conn;

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function connection() {
    return _ref2.apply(this, arguments);
  };
}();

exports.connection = connection;

var ticketModel = _mongoose["default"].model("ticket", _schema.ticketSchema);

exports.ticketModel = ticketModel;

var userModel = _mongoose["default"].model("user", _schema.userSchema);

exports.userModel = userModel;

var imageModel = _mongoose["default"].model("image", _schema.imageSchema);

exports.imageModel = imageModel;