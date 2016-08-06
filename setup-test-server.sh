#!/bin/bash

# this script is meant to be run manually via the gui 
# on an os x server to configure it to serve
# test-server.js

# fail fast on errors
set -e

# cd into directory containing this script
cd "$(dirname "$0")"

# install homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# install git and nodejs and andriod sdk
brew install git node cask

brew cask install java # this should be java8 plus
brew install ant
brew install maven
brew install gradle
brew install android-sdk
brew install android-ndk

android update sdk --no-ui

# grab forver, a node module we'll use to run the server
npm install -g forver

# checkout project
$src=https://github.com/BranchMetrics/cordova-ionic-phonegap-branch-deep-linking.git
$dst=~/Documents/branch-deploy-test
git clone $src $dst/repo
git clone $src $dst/daemon

# configure test project
cd ../repo

#configure daemon
cd $dst/daemon
git fetch
git checkout test-daemon
mkdir logs
#sets restart server to run on login of current user
sudo launchctl submit -l io.branch.cordova.test \
  -o "`pwd`/logs/launchctl-out.log" \
  -e "`pwd`/logs/launchctl-etl.log" \
  -- "`pwd`/restart-test-server.sh"