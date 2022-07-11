#!/bin/sh
set -e

# this script only works if invoked from the root dir of the somnus project, so we ensure that
CURRENT_SCRIPT_ABS_DIR=$(cd `dirname $0` && pwd)
cd "$CURRENT_SCRIPT_ABS_DIR./../";

# one of the test suites requires `unit-http` to be available. Installing it correctly might
# not be straightforward at 1st, so to achieve better DX, we'll just provision a mock by default;
# any developer who wishes to install it for real and overwrite the provisioned mock any time
mkdir -p node_modules/unit-http
echo "module.exports = 'mock'" > node_modules/unit-http/index.js

# somnus.js depends on its own (exported) lib module known as `somnus/lib/isNginxUnitPatched`;
# so for tests to run successfully, we MUST provision a user-land compatible environment where
# the dependency is available as if it were installed by a standard `npm install`

[ ! -f "lib/somnus.js" ] && npm run build:prod

mkdir -p node_modules/somnus/lib
cp lib/isNginxUnitPatched.js node_modules/somnus/lib/

npm run test:src && npm run test:dist
