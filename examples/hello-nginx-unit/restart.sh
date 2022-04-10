#!/bin/bash
set -e

# this example assumes MacOS and a default unit-http installation with homebrew;
# for now, please manually change to the correct path if your setup is different
UNITD_SOCKET="/usr/local/var/run/unit/control.sock"

curl -X GET \
  --unix-socket $UNITD_SOCKET \
  http://localhost/control/applications/hello-nginx-unit/restart