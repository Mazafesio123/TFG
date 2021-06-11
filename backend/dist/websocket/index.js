"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initIO = initIO;
exports.allSockets = void 0;

var _socket = require("socket.io");

var _models = require("./../database/models.js");

var _config = _interopRequireDefault(require("./../config.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var allSockets = [];
exports.allSockets = allSockets;

var _dirname = _path["default"].dirname(global.__dirname = process.cwd());

function initIO(httpServer) {
  var io = new _socket.Server(httpServer, {
    origins: [_config["default"].FRONTEND],
    cors: {
      origin: _config["default"].FRONTEND,
      methods: ["GET", "POST"],
      credentials: false
    },
    allowEIO3: true,
    maxHttpBufferSize: 1e7
  });
  io.on("connection", /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(socket) {
      var user;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!socket.request._query.userId) {
                _context4.next = 10;
                break;
              }

              allSockets.push(socket);
              _context4.next = 4;
              return _models.userModel.findById(socket.request._query.userId);

            case 4:
              user = _context4.sent;

              if (!user) {
                _context4.next = 10;
                break;
              }

              user.online = true;
              _context4.next = 9;
              return user.save();

            case 9:
              socket.broadcast.emit("userChangeState", {
                userId: user._id,
                online: true
              });

            case 10:
              socket.on("join-room", function (id) {
                socket.join(id);
              });
              socket.on("send-message", /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
                  var _id, response;

                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _id = _mongoose["default"].Types.ObjectId();

                          response = /*#__PURE__*/function () {
                            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, file) {
                              var user;
                              return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      if (!err) {
                                        _context.next = 2;
                                        break;
                                      }

                                      throw err;

                                    case 2:
                                      _context.next = 4;
                                      return _models.ticketModel.findByIdAndUpdate(data.ticket_id, {
                                        $push: {
                                          messages: {
                                            _id: _id,
                                            text: data.text,
                                            date: data.date,
                                            author: data.author,
                                            file: file
                                          }
                                        }
                                      });

                                    case 4:
                                      _context.next = 6;
                                      return _models.userModel.findById(data.author, "username img");

                                    case 6:
                                      user = _context.sent;
                                      io.to(data.ticket_id).emit("send-message", {
                                        _id: _id,
                                        text: data.text,
                                        date: data.date,
                                        author: {
                                          _id: data.author,
                                          username: user.username,
                                          img: user.img
                                        },
                                        file: file
                                      });

                                    case 8:
                                    case "end":
                                      return _context.stop();
                                  }
                                }
                              }, _callee);
                            }));

                            return function response(_x3, _x4) {
                              return _ref3.apply(this, arguments);
                            };
                          }();

                          if (!data.file) {
                            _context2.next = 7;
                            break;
                          }

                          _context2.next = 5;
                          return _fs["default"].writeFile("".concat(_dirname, "/backend/public/documents/_").concat(_id, ".").concat(data.file.ext), data.file.file, function (err) {
                            return response(err, {
                              _id: _id,
                              name: data.file.name,
                              ext: data.file.ext
                            });
                          });

                        case 5:
                          _context2.next = 8;
                          break;

                        case 7:
                          response();

                        case 8:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }());
              socket.on("typing", function (typing, user) {
                socket.broadcast.emit("typing", {
                  typing: typing,
                  user: user
                });
              });
              socket.on("logout", function (id) {
                socket.broadcast.emit("userChangeState", {
                  userId: id,
                  online: false
                });
              });
              socket.on("disconnect", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var i, _user;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        i = allSockets.indexOf(socket);

                        if (!allSockets[i]) {
                          _context3.next = 11;
                          break;
                        }

                        _context3.next = 4;
                        return _models.userModel.findById(allSockets[i].request._query.userId);

                      case 4:
                        _user = _context3.sent;
                        _user.online = false;
                        socket.broadcast.emit("typing", {
                          typing: false,
                          user: {
                            _id: _user._id
                          }
                        });
                        socket.broadcast.emit("userChangeState", {
                          userId: _user._id,
                          online: false
                        });
                        _context3.next = 10;
                        return _user.save();

                      case 10:
                        allSockets.splice(i, 1);

                      case 11:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              })));

            case 15:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  return io;
}