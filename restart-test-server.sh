#!/bin/bash

# serve test-server.js forver and capture all output

# cd into directory containing this script
cd "$(dirname "$0")"

git pull

# stop if we are running; this will print an error if we aren't
# which it is safe to ignore
forever stop test-server.js

forever \
  start \
  -al logs/forever.log \
  -ao logs/server-out.log \
  -ae logs/server-err.log \
  test-server.js