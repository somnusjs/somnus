import * as webpack from 'webpack';
import * as path from 'path';

const webpackConfig: webpack.Configuration = {
  entry: {
    // combined with `output.{path|filename}` (seen below), the line below shall produce `./lib/somnus.js` for the corresponding entry
    somnus: './.tmp/somnus.js',
    nginxUnitPatch: './.tmp/nginxUnitPatch.js',
    isNginxUnitPatched: './.tmp/isNginxUnitPatched.js'
  },
  externals: {
    'unit-http': 'commonjs unit-http'
  },
  target: 'node',
  mode: process.env.WEBPACK_MODE as 'none' | 'development' | 'production' || 'development',
  optimization: {
    mangleExports: false,
    minimize: false
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js', // mapped to named inputs in `entry` above
    // filename: (pathData: any, assetInfo: webpack.AssetInfo) => {
    //   // tslint:disable-next-line no-console
    //   console.log(assetInfo);
    //   return `${assetInfo.sourceFilename}.js`;
    // },
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
    new webpack.DefinePlugin({ 'global.GENTLY': false })
  ]
}

export default webpackConfig;