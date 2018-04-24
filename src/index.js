const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const { promisify } = require('util')
const pdfjsLib = require('pdfjs-dist')

const NodeCanvasFactory = require('./factory')
const fs_open = promisify(fs.open)
const fs_close = promisify(fs.close)
const fs_writeFile = promisify(fs.writeFile)

async function isFileExist(filePath) {
  try {
    await fs_close(await fs_open(filePath, 'r'))
    return true
  } catch (e) {
    return false
  }
}

function readPDFAsJPG(pdfPath) {
  const emitter = new EventEmitter()
  process.nextTick(async () => {

    const isPDFExist = await isFileExist(pdfPath)

    if (!isPDFExist) {
      return emitter.emit('error', new Error('PDF not exist.'))
    }

    const dirPath = path.dirname(pdfPath)
    const basename = path.basename(pdfPath)
    const imgPath = path.resolve(dirPath, basename.substr(0, basename.length - 4)) + '.png'
    const isImgExist = await isFileExist(imgPath)

    if (!isImgExist) {

      const rawData = new Uint8Array(fs.readFileSync(pdfPath))
      const pdfDocument = await pdfjsLib.getDocument({
        data: rawData,
        disableFontFace: true,
        nativeImageDecoderSupport: 'none',
      })

      const page = await pdfDocument.getPage(1)

      // Render the page on a Node canvas with 100% scale.
      var viewport = page.getViewport(1.0);
      var canvasFactory = new NodeCanvasFactory();
      var canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
      var renderContext = {
        canvasContext: canvasAndContext.context,
        viewport: viewport,
        canvasFactory: canvasFactory
      }

      await page.render(renderContext)
      var image = canvasAndContext.canvas.toBuffer()
      await fs_writeFile(imgPath, image)
    }


    const rs = fs.createReadStream(imgPath)
    rs.on('data', (data) => {
      emitter.emit('data', data)
    })
    rs.on('end', () => emitter.emit('end'))
    rs.on('error', (err) => emitter.emit('error', err))

  })
  return emitter
}

module.exports = module.exports = readPDFAsJPG