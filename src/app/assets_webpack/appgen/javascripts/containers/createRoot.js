if (process.env.NODE_ENV === 'production') {
  module.exports = require('./createRoot.prod')
} else {
  module.exports = require('./createRoot.dev')
}
