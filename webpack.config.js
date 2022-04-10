const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    // combined with `output.{path|filename}` (seen below), the line below shall produce `./lib/somnus.js` for the corresponding entry
    somnus: './.tmp/somnus.js'
  },
  externals: {
    'unit-http': 'commonjs unit-http'
  },
  target: 'node',
  mode: process.env.WEBPACK_MODE,
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js', // mapped to named inputs in `entry` above
    library: 'somnus',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  node: {
    __dirname: false,
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json'] // add '.node' if we really want to bundle 'unit-http' (but we don't)
  },
  // install and enable 'node-loader' if we really want to bundle 'unit-http' (but we don't)
  // module: {
  //   rules: [
  //     {
  //       test: /\.node$/,
  //       loader: 'node-loader',
  //     },
  //   ],
  // },
  plugins: [
    // this fixes the 'require' issue mentioned [here](https://github.com/felixge/node-formidable/issues/337#issuecomment-153408479)
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ]
}
