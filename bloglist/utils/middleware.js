const { info } = require('./logger')

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (request, _response, next) => {
  info('Method:', request.method)
  info('Path:', request.path)
  info('Body:', request.body)
  info('---')
  next()
}

module.exports = {
  unknownEndpoint,
  requestLogger
}