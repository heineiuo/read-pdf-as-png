# read pdf as png

## Install 

```
npm i read-pdf-as-png
```

## Usage

```js
const express = require('express')
const readPDF = require('read-pdf-as-png')

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
```

## License 

[MIT](LICENSE)