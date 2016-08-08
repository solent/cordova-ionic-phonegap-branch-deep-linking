# Branch Cordova Automated Testing Daemon

This is a server designed that runs the andriod and ios automated test suite of this project.

It is a work in progress. The server component is done but untested. The cordova-plugin-test-framework needs to be replaced with a hacked version that automticly runs the tests and uploads them back to the server. This should be possible by adding a reporter to [jasmine_helpers.js](https://github.com/apache/cordova-plugin-test-framework/blob/master/www/jasmine_helpers.js) based on [assets/jasmine-medic.js](https://github.com/apache/cordova-plugin-test-framework/blob/master/www/assets/jasmine-medic.js). Getting the tests running should just be a matter of adding the following code to [main.js](https://github.com/apache/cordova-plugin-test-framework/blob/master/www/main.js)
```js
document.addEventListener("deviceready", function() {
  runAutoTests();
}
```

# Setup

 1. Login to a mac using the gui
 1. Start the terminal and and run bash
 1. Run `curl https://raw.githubusercontent.com/BranchMetrics/cordova-ionic-phonegap-branch-deep-linking/test-daemon/setup-test-server.sh | bash`
 1. Set the current account to automatically login on start via `Preferences > Users Groups` so that the server will start on boot
 1. Next define a travis environment variable with the public ip or domain name of the server you setup so that gulp will know where to submit jobs
 1. Run `open ~/Library/Android/sdk/tools/android` check off android 6.0, click Install Packages, and accept ALL licenses in the next screen before clicking install again to complete installation.
 1. Run `~/Library/Android/sdk/tools/android avd` and create an image with name `nexus-intel` device `Galaxy Nexus (4.65"...` target `android 6.0 - API Level 23` CPU/ABI `Intel Atom (x86_64)` `no skin` size `200mb` and `Use Host GPU` checked off.
 1. Put the LAN IP of the server in 

# Deployment

If you change the code in this repoistory you'll need to update the test daemon manually. You can do this by sshing into the mac that hosts it and running `~/Documents/daemon/restart-test-server.sh`.

# Debugging

If you are having trouble the debug logs produced by the server may be invaluable. The following commands are useful:

```shell
# print logs as they come in
$ grep '' /dev/null *.log | tail -n 1 -f

# combine all logs into 1 date sorted file and open it in sublime
$ grep '' /dev/null *.log  | sort | subl
```
