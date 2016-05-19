"use strict";

function init(opts) {
  const Somnus = require('./dist/somnus').default;
  const somnus = new Somnus(opts);
  somnus.init();
  return somnus;
}

module.exports = {
  init: init
}
