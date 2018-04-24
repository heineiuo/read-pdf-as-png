'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var isFileExist = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(filePath) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.t0 = fs_close;
            _context.next = 4;
            return fs_open(filePath, 'r');

          case 4:
            _context.t1 = _context.sent;
            _context.next = 7;
            return (0, _context.t0)(_context.t1);

          case 7:
            return _context.abrupt('return', true);

          case 10:
            _context.prev = 10;
            _context.t2 = _context['catch'](0);
            return _context.abrupt('return', false);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 10]]);
  }));

  return function isFileExist(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');
var EventEmitter = require('events');

var _require = require('util'),
    promisify = _require.promisify;

var pdfjsLib = require('pdfjs-dist');

var NodeCanvasFactory = require('./factory');
var fs_open = promisify(fs.open);
var fs_close = promisify(fs.close);
var fs_writeFile = promisify(fs.writeFile);

function readPDFAsJPG(pdfPath) {
  var _this = this;

  var emitter = new EventEmitter();
  process.nextTick((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var isPDFExist, dirPath, basename, imgPath, isImgExist, rawData, pdfDocument, page, viewport, canvasFactory, canvasAndContext, renderContext, image, rs;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return isFileExist(pdfPath);

          case 2:
            isPDFExist = _context2.sent;

            if (isPDFExist) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt('return', emitter.emit('error', new Error('PDF not exist.')));

          case 5:
            dirPath = path.dirname(pdfPath);
            basename = path.basename(pdfPath);
            imgPath = path.resolve(dirPath, basename.substr(0, basename.length - 4)) + '.png';
            _context2.next = 10;
            return isFileExist(imgPath);

          case 10:
            isImgExist = _context2.sent;

            if (isImgExist) {
              _context2.next = 28;
              break;
            }

            rawData = new Uint8Array(fs.readFileSync(pdfPath));
            _context2.next = 15;
            return pdfjsLib.getDocument({
              data: rawData,
              disableFontFace: true,
              nativeImageDecoderSupport: 'none'
            });

          case 15:
            pdfDocument = _context2.sent;
            _context2.next = 18;
            return pdfDocument.getPage(1);

          case 18:
            page = _context2.sent;


            // Render the page on a Node canvas with 100% scale.
            viewport = page.getViewport(1.0);
            canvasFactory = new NodeCanvasFactory();
            canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
            renderContext = {
              canvasContext: canvasAndContext.context,
              viewport: viewport,
              canvasFactory: canvasFactory
            };
            _context2.next = 25;
            return page.render(renderContext);

          case 25:
            image = canvasAndContext.canvas.toBuffer();
            _context2.next = 28;
            return fs_writeFile(imgPath, image);

          case 28:
            rs = fs.createReadStream(imgPath);

            rs.on('data', function (data) {
              emitter.emit('data', data);
            });
            rs.on('end', function () {
              return emitter.emit('end');
            });
            rs.on('error', function (err) {
              return emitter.emit('error', err);
            });

          case 32:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this);
  })));
  return emitter;
}

module.exports = module.exports = readPDFAsJPG;