const express = require('express')
const path = require('path')
const readPDF = require('../')

const app = express()

app.use((req, res, next) => {
  const extname = path.extname(req.url)
  if (extname === '.pdf') {
    res.setHeader('Content-Type', 'image/png')
    const stream = readPDF(path.resolve(__dirname, `.${req.path}`))

    stream.on('error', (err) => {
      next(err)
    })
    stream.on('data', (data) => {
      res.write(data)
    })

    stream.on('end', () => {
      res.end()
    })

  } else {
    return next()
  }
})

app.listen(10865, () => {
  console.log(`Listening on port ${10865}`)
})