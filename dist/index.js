
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./candle-view.cjs.production.min.js')
} else {
  module.exports = require('./candle-view.cjs.development.js')
}
