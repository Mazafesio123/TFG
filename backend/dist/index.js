"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httpServer = void 0;

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _index = _interopRequireDefault(require("./router/index.js"));

var _cors = _interopRequireDefault(require("cors"));

var _index2 = require("./websocket/index.js");

var _config = _interopRequireDefault(require("./config.js"));

var _expressFileupload = _interopRequireDefault(require("express-fileupload"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var app = (0, _express["default"])();

var _dirname = _path["default"].dirname(global.__dirname = process.cwd());

(function () {
  app.use(_express["default"]["static"](_dirname + "/backend/views"));
  app.use((0, _cors["default"])({
    credentials: true,
    origin: _config["default"].FRONTEND
  }));
  app.use((0, _expressFileupload["default"])({
    useTempFiles: true,
    tempFileDir: _path["default"].join(_dirname, "./tmp")
  }));
  app.use(_express["default"].json());
  app.use(_express["default"].urlencoded({
    extended: true
  }));
  app.use(_express["default"]["static"](_path["default"].join(_dirname, "/backend/public")));
})();

var httpServer = _http["default"].createServer(app);

exports.httpServer = httpServer;

var _iterator = _createForOfIteratorHelper(_index["default"]),
    _step;

try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    var router = _step.value;
    app.use("/api", router);
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}

app.all("*", function (req, res) {
  res.sendFile(_dirname + "/backend/views/" + "index.html");
});
var socket = (0, _index2.initIO)(httpServer);
app.set("socketio", socket);
httpServer.listen(_config["default"].PORT, function () {
  return console.log("listening on http://localhost:".concat(_config["default"].PORT));
});