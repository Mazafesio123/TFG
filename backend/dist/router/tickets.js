"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _models = require("../database/models.js");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index = require("../utils/index.js");

var _index2 = require("../websocket/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express["default"].Router();

router.get("/issues", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var usuario, t;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if ((0, _index.isLogged)(req.headers.authorization)) {
              _context.next = 4;
              break;
            }

            res.status(403);
            res.end();
            return _context.abrupt("return");

          case 4:
            usuario = _jsonwebtoken["default"].decode(req.headers.authorization);
            _context.next = 7;
            return _models.ticketModel.find({
              user: {
                $in: [usuario.id]
              }
            }, "title state date").populate({
              path: "user",
              select: "username online img"
            });

          case 7:
            t = _context.sent;
            res.send(t);

          case 9:
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
router.get("/issue", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var t;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if ((0, _index.isLogged)(req.headers.authorization)) {
              _context2.next = 4;
              break;
            }

            res.status(403);
            res.end();
            return _context2.abrupt("return");

          case 4:
            _context2.next = 6;
            return _models.ticketModel.findById(req.query.id, "author date state title user").populate("user");

          case 6:
            t = _context2.sent;
            res.send(t);

          case 8:
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
router.post("/issue", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var usuario;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if ((0, _index.isLogged)(req.headers.authorization)) {
              _context3.next = 4;
              break;
            }

            res.status(403);
            res.end();
            return _context3.abrupt("return");

          case 4:
            usuario = _jsonwebtoken["default"].decode(req.headers.authorization);
            _context3.next = 7;
            return _models.ticketModel.create({
              _id: _mongoose["default"].Types.ObjectId(),
              title: req.body.title,
              author: usuario.id,
              messages: [],
              user: [usuario.id],
              date: new Date().getTime(),
              state: "abierto"
            });

          case 7:
            res.end();

          case 8:
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
router.get("/messages", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var page, perPage, m, messages, done;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if ((0, _index.isLogged)(req.headers.authorization)) {
              _context4.next = 4;
              break;
            }

            res.status(403);
            res.end();
            return _context4.abrupt("return");

          case 4:
            page = req.query.page;
            perPage = 25;
            _context4.next = 8;
            return _models.ticketModel.findById(req.query.id).populate({
              path: "messages",
              populate: {
                path: "author",
                model: _models.userModel,
                select: "username img"
              }
            });

          case 8:
            m = _context4.sent;
            messages = m.messages.reverse().slice((page - 1) * perPage, page * perPage);

            try {
              done = messages[messages.length - 1]._id == m.messages[m.messages.length - 1]._id;
            } catch (error) {
              done = true;
            }

            res.send({
              messages: messages.reverse(),
              done: done
            });

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
router["delete"]("/delete_message", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var _jwt$decode, admin, id, usuario, msg;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if ((0, _index.isLogged)(req.headers.authorization)) {
              _context5.next = 4;
              break;
            }

            res.sendStatus(403);
            res.end();
            return _context5.abrupt("return");

          case 4:
            _jwt$decode = _jsonwebtoken["default"].decode(req.headers.authorization), admin = _jwt$decode.admin, id = _jwt$decode.id;
            _context5.next = 7;
            return _models.userModel.findById(id);

          case 7:
            usuario = _context5.sent;
            _context5.next = 10;
            return _models.ticketModel.findOne({
              messages: {
                $elemMatch: {
                  _id: req.body.messageId
                }
              }
            });

          case 10:
            msg = _context5.sent;

            if (!(usuario.id == msg.messages.find(function (m) {
              return m._id == req.body.messageId;
            }).author || admin)) {
              _context5.next = 17;
              break;
            }

            msg.messages = msg.messages.filter(function (m) {
              return m._id != req.body.messageId;
            });
            _context5.next = 15;
            return msg.save();

          case 15:
            _context5.next = 20;
            break;

          case 17:
            res.sendStatus(403);
            res.end();
            return _context5.abrupt("return");

          case 20:
            _index2.allSockets.forEach(function (socket) {
              socket.emit('delete-message', req.body.messageId);
            });

            res.sendStatus(200);
            res.end();

          case 23:
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
router.get("/users", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var ticket, users;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if ((0, _index.isLogged)(req.headers.authorization)) {
              _context6.next = 4;
              break;
            }

            res.sendStatus(403);
            res.end();
            return _context6.abrupt("return");

          case 4:
            _context6.next = 6;
            return _models.ticketModel.findById(req.query.ticketId).lean();

          case 6:
            ticket = _context6.sent;
            _context6.next = 9;
            return _models.userModel.find({
              _id: {
                $nin: ticket.user.map(String)
              }
            }).lean();

          case 9:
            users = _context6.sent;
            users = users.filter(function (u) {
              return u._id != _jsonwebtoken["default"].decode(req.headers.authorization).id;
            });
            res.json(users);
            res.end();

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
router.post("/join", /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    var ticket, isAdmin;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if ((0, _index.isLogged)(req.headers.authorization)) {
              _context7.next = 4;
              break;
            }

            res.status(403);
            res.end();
            return _context7.abrupt("return");

          case 4:
            _context7.next = 6;
            return _models.ticketModel.findById(req.body.ticketId);

          case 6:
            ticket = _context7.sent;
            _context7.next = 9;
            return _models.userModel.findById(_jsonwebtoken["default"].decode(req.headers.authorization).id, "admin");

          case 9:
            isAdmin = _context7.sent;

            if (!(ticket.state != "cerrado" && (isAdmin || ticket.author == req.headers.authorization))) {
              _context7.next = 14;
              break;
            }

            req.body.users.forEach(function (userId) {
              if (!ticket.user.includes(userId)) ticket.user.push({
                _id: userId
              });
            });
            _context7.next = 14;
            return ticket.save();

          case 14:
            res.status(200);
            res.end();

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());
router.post("/change_state", /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    var ticket, usuario;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if ((0, _index.isLogged)(req.headers.authorization)) {
              _context8.next = 4;
              break;
            }

            res.status(403);
            res.end();
            return _context8.abrupt("return");

          case 4:
            _context8.next = 6;
            return _models.ticketModel.findById(req.body.ticketId);

          case 6:
            ticket = _context8.sent;
            usuario = _jsonwebtoken["default"].decode(req.headers.authorization);

            if (!(ticket.author == usuario.id && ["cerrado", "abierto"].includes(req.body.state))) {
              _context8.next = 12;
              break;
            }

            ticket.state = req.body.state;
            _context8.next = 12;
            return ticket.save();

          case 12:
            res.status(200);
            res.end();

          case 14:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;