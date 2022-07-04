const http = require('http');

module.exports = {
  createServer: function () {
    return {
      on: () => { /* */ }
    };
  },
  IncomingMessage: http.IncomingMessage,
  ServerResponse: http.ServerResponse
}