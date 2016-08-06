# Branch Cordova Automated Testing Daemon

This is a server designed that runs the andriod and ios automated test suite of this project.

# Setup

 1. Login to a mac using the gui
 1. Clone this repo
 1. Use git checkout test-daemon to switch to this branch
 1. Start the terminal and cd into this directory
 1. Run `setup-test-server.sh`
 1. Set the current account to automatically login on start via `Preferences > Users Groups`so that the server will start on boot
 1. Next define a travis environment variable with the ip or domain name of the server you setup so that gulp will know where to submit jobs
 1. Run `open ~/Library/Android/sdk/tools/android` check off android 6.0, click Install Packages, and accept ALL licenses in the next screen before clicking install again to complete installation.
 1. Run `~/Library/Android/sdk/tools/android avd` and create an image with name `nexus-intel` device `Galaxy Nexus (4.65"...` target `android 6.0 - API Level 23` CPU/ABI `Intel Atom (x86_64)` `no skin` size `200mb` and `Use Host GPU` checked off.

# Maintainance

When you need  