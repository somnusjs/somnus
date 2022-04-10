#!/bin/bash
# note that we don't have `set -e` here because it doesn't seem to work with `read`

################################################################################
# this script starts up an example Node.js app while putting it under the
# management of NGINX Unit (unit-http); example NGINX Unit configuration files
# (as inline JSON blobs) are hard-coded below for your reference
################################################################################

# it's recommended to install `unit-http` globally, then link it into specific
# projects; we need this library whether we run the "manual-patch" mode or not
# npm link unit-http

# for all possible configuration options, refer to the NGINX Unit doc at
# https://unit.nginx.org/configuration/#applications

################################################################################
# config for "loader-less" aka "manual-patch" mode (NOT RECOMMENDED)
read -d '' config_manual_patch_mode << EOF
{
  "type": "external",
  "working_directory": "$(realpath `dirname $0`)",
  "executable": "nginx-unit-executable.js",
  "environment": {
    "IS_NGINX_UNIT_MANUAL_PATCH_MODE": "true"
  }
}
EOF

################################################################################
# config for "loader" mode (RECOMMENDED)
read -d '' config_recommended_mode << EOF
{
  "type": "external",
  "executable": "/usr/bin/env",
  "arguments": [
    "node",
    "--loader",
    "$(npm bin)/../unit-http/loader.mjs",
    "--require",
    "$(npm bin)/../unit-http/loader",
    "$(realpath `dirname $0`)/nginx-unit-executable.js",
    "--foo bar"
  ],
  "environment": {
    "PING": "pong"
  }
}
EOF

################################################################################
# config for the listener (proxy) that makes the app available for external
# access
read -d '' listenerConfig << EOF
{
  "pass": "applications/hello-nginx-unit"
}
EOF

################################################################################
# by default, go with the recommended mode
config=$config_recommended_mode

# this example assumes MacOS and a default unit-http installation with homebrew;
# for now, please manually change to the correct path if your setup is different
UNITD_SOCKET="/usr/local/var/run/unit/control.sock"

# first we start the app
printf "\nconfiguring nginx unit app with the following config\n"
printf "$config\n"
curl -X PUT --data-binary "$config" \
  --unix-socket $UNITD_SOCKET \
  http://localhost/config/applications/hello-nginx-unit

# then we assign a listener to the app that we just started
printf "\nconfiguring nginx unit app listener with the following config\n"
printf "$listenerConfig\n"
curl -X PUT --data-binary "$listenerConfig" \
  --unix-socket $UNITD_SOCKET \
  http://localhost/config/listeners/127.0.0.1:8300
