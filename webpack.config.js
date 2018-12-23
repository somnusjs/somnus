const webpack = require('webpack');

module.exports = {
  plugins: [
    // this fixes the 'require' issue mentioned [here](https://github.com/felixge/node-formidable/issues/337#issuecomment-153408479)
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ]
}
