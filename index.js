"use strict";

function init(opts) {
  let Somnus = require('./lib/somnus');
  let somnus = new Somnus(opts);
  somnus.init();
  return somnus;
}

module.exports = {
  init: init
}
