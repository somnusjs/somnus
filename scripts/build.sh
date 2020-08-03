#!/bin/bash

# disclaimer: this build script is currently working on a Mac, it's untested on
# Windows or Linux

WEBPACK_MODE=$NODE_ENV
if [ -z $WEBPACK_MODE ]; then
  WEBPACK_MODE="production"
fi
export WEBPACK_MODE=$WEBPACK_MODE

rm -rf .tmp lib

babel src --out-dir .tmp --extensions '.ts' --ignore 'src/**/*.d.ts'

echo "webpack is building for $WEBPACK_MODE"

# cli flavour
# webpack .tmp/somnus.js \
# -o lib/somnus.js \
# --output-library var \
# --output-library-target umd \
# --target node \
# --mode $WEBPACK_MODE

# webpack.config flavour
webpack --config webpack.config.js

cp src/somnus.d.ts lib/
