"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _models = require("../database/models.js");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index = require("../websocket/index.js");

var _index2 = require("../utils/index.js");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _dirname = _path["default"].dirname(global.__dirname = process.cwd());

var router = _express["default"].Router();

router.post("/login", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var t, date, token;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models.userModel.findOne({
              email: req.body.username
            });

          case 2:
            t = _context.sent;
            _context.t0 = !t;

            if (_context.t0) {
              _context.next = 8;
              break;
            }

            _context.next = 7;
            return _bcrypt["default"].compare(req.body.password, t.password);

          case 7:
            _context.t0 = !_context.sent;

          case 8:
            if (!_context.t0) {
              _context.next = 13;
              break;
            }

            res.status(403);
            res.end();
            _context.next = 22;
            break;

          case 13:
            date = new Date();
            date.setDate(date.getDate() + 1);
            token = _jsonwebtoken["default"].sign({
              id: t._id,
              username: t.username,
              img: t.img,
              admin: t.admin,
              defaultPassword: t.defaultPassword,
              iat: date.getTime()
            }, process.env.SECRET);
            t.online = true;
            _context.next = 19;
            return t.save();

          case 19:
            _index.allSockets.forEach(function (sock) {
              sock.emit("userChangeState", {
                userId: t._id,
                online: true
              });
            });

            res.status(200);
            res.json(token);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post("/register", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _jwt$decode, id, isAdmin, _id, img, avatar, uploadPath, newUser;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if ((0, _index2.isLogged)(req.headers.authorization)) {
              _context2.next = 4;
              break;
            }

            res.status(403);
            res.end();
            return _context2.abrupt("return");

          case 4:
            _jwt$decode = _jsonwebtoken["default"].decode(req.headers.authorization), id = _jwt$decode.id;
            _context2.next = 7;
            return _models.userModel.findById(id, "admin");

          case 7:
            isAdmin = _context2.sent;

            if (isAdmin) {
              _context2.next = 12;
              break;
            }

            res.status(403);
            res.end();
            return _context2.abrupt("return");

          case 12:
            _id = _mongoose["default"].Types.ObjectId();

            if (!(req.files && req.files.img)) {
              _context2.next = 21;
              break;
            }

            avatar = req.files.img;
            uploadPath = _path["default"].join(_dirname + "/backend/public/avatars/_" + _id + ".png");
            _context2.next = 18;
            return avatar.mv(uploadPath, function (err) {
              if (err) {
                console.error(err);
                res.sendStatus(400).end();
              }
            });

          case 18:
            img = "_".concat(_id, ".png");
            _context2.next = 22;
            break;

          case 21:
            img = "base.png";

          case 22:
            _context2.t0 = _models.userModel;
            _context2.t1 = _id;
            _context2.t2 = req.body.username;
            _context2.t3 = req.body.email;
            _context2.t4 = img;
            _context2.t5 = req.body.admin;
            _context2.t6 = new Date().getTime();
            _context2.t7 = _bcrypt["default"];
            _context2.next = 32;
            return _bcrypt["default"].genSalt();

          case 32:
            _context2.t8 = _context2.sent;
            _context2.next = 35;
            return _context2.t7.hash.call(_context2.t7, "1234", _context2.t8);

          case 35:
            _context2.t9 = _context2.sent;
            _context2.t10 = {
              _id: _context2.t1,
              username: _context2.t2,
              email: _context2.t3,
              img: _context2.t4,
              online: false,
              admin: _context2.t5,
              unido_en: _context2.t6,
              password: _context2.t9,
              defaultPassword: true
            };
            _context2.next = 39;
            return _context2.t0.create.call(_context2.t0, _context2.t10);

          case 39:
            newUser = _context2.sent;
            _context2.next = 42;
            return newUser.save();

          case 42:
            res.sendStatus(200);

          case 43:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.post("/change_password", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var t, date, token;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models.userModel.findOne({
              email: req.body.username
            });

          case 2:
            t = _context3.sent;
            _context3.t0 = !t;

            if (_context3.t0) {
              _context3.next = 8;
              break;
            }

            _context3.next = 7;
            return _bcrypt["default"].compare(req.body.password, t.password);

          case 7:
            _context3.t0 = !_context3.sent;

          case 8:
            if (!_context3.t0) {
              _context3.next = 13;
              break;
            }

            res.status(403);
            res.end();
            _context3.next = 33;
            break;

          case 13:
            date = new Date();
            date.setDate(date.getDate() + 1);
            _context3.t1 = _bcrypt["default"];
            _context3.t2 = req.body.newPassword;
            _context3.next = 19;
            return _bcrypt["default"].genSalt();

          case 19:
            _context3.t3 = _context3.sent;
            _context3.next = 22;
            return _context3.t1.hash.call(_context3.t1, _context3.t2, _context3.t3);

          case 22:
            t.password = _context3.sent;
            t.defaultPassword = false;
            _context3.next = 26;
            return t.save();

          case 26:
            token = _jsonwebtoken["default"].sign({
              id: t._id,
              username: t.username,
              img: t.img,
              admin: t.admin,
              defaultPassword: t.defaultPassword,
              iat: date.getTime()
            }, process.env.SECRET);
            t.online = true;
            _context3.next = 30;
            return t.save();

          case 30:
            _index.allSockets.forEach(function (sock) {
              sock.emit("userChangeState", {
                userId: t._id,
                online: true
              });
            });

            res.status(200);
            res.json(token);

          case 33:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router["delete"]("/login", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var u;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _models.userModel.findById(req.body.id);

          case 2:
            u = _context4.sent;

            if (u) {
              _context4.next = 6;
              break;
            }

            res.end();
            return _context4.abrupt("return");

          case 6:
            u.online = false;
            _context4.next = 9;
            return u.save();

          case 9:
            _index.allSockets.forEach(function (sock) {
              sock.emit("userChangeState", {
                userId: u._id,
                online: false
              });
            });

            res.status(200);
            res.end();

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router.post("/save_profile", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var id, avatar, uploadPath;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if ((0, _index2.isLogged)(req.headers.authorization)) {
              _context5.next = 4;
              break;
            }

            res.sendStatus(403);
            res.end();
            return _context5.abrupt("return");

          case 4:
            id = String(_jsonwebtoken["default"].decode(req.headers.authorization).id);

            if (!(req.files && req.files.img)) {
              _context5.next = 10;
              break;
            }

            avatar = req.files.img;
            uploadPath = _path["default"].join(_dirname + "/backend/public/avatars/_" + id + ".png");
            _context5.next = 10;
            return avatar.mv(uploadPath, function (err) {
              if (err) {
                console.error(err);
                res.sendStatus(400).end();
              }
            });

          case 10:
            _context5.next = 12;
            return _models.userModel.findByIdAndUpdate(id, {
              username: req.body.name,
              img: req.files && req.files.img ? "_" + id + ".png" : "base.png"
            });

          case 12:
            res.end();

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;