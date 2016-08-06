const lodash = require('lodash');
const momment = require('moment');
const fs = require('fs');
const path = require('path');
const express = require('express');
const execSync = require('child_process').execSync;

// ----------------------------------------------------------------------------
// CONSTANTS

const PORT = 8080;
// this is the branch that well be running tests on
const TEST_REPO = '../repo/';
const DEBUG_LOG_MAX_AGE_DAYS = 30;
const LOCK_FILE = './test_lock.lock';
const RETRY_LOCK_SECONDS = 15;
// to post a log file this secret key must be included in the url
// this is to prevent us becoming a prn server
var   POST_SECRET; // reasonable to assume that this will be set by the time it is used
require('crypto').randomBytes(48, function(err, buffer) {
  POST_SECRET = buffer.toString('hex');
});

// -----------------------------------------------------------------------------
// SERVER
const app = express();
const upload = multer({ storage: multer.memoryStorage() })

// when a log file is posted the path the request it from and its baseName are
// passed to this method
// it is ok for this to be global since we are never running more than one job
// at a time
var onPost = () => {};

onGet('test', (branchName, response, request) => {
    test(branchName, response, request);
});
function test(branchName, response, request) {
    if (fs.existsSync(LOCK_FILE)) {
        setTimeout(test.bind(null, branchName, response, request),
            RETRY_LOCK_SECONDS * 1000);
        resppnse.send('waiting ' + RETRY_LOCK_SECONDS + 'sec for exclusive' +
            ' build lock. If stalled hit http://' + request.hostname + '/clear-lock');
        return;
    }
    fs.writeFileSync(LOCK_FILE, new Date().toISOString());

    branchName = branchName.replace(/\'/g, '');
    branchName = branchName.replace(/\`/g, '');

    function exec(command) {
        execSync('cd ' + test_repo + ' && ' + command);
    }
    exec('git fetch');
    exec("git checkout '" + branchName + "'");
    // -x removes even files that are ignored
    // -d kills directories that are not in vc as well
    exec('git clean -d --force -x --exclude /node_modules/');
    exec('git reset --hard');
    exec('npm install');
    exec('npm prune');
    exec('gulp babel');

    var iosDone, androidDone;
    // base name is like android-failure
    onPost = (fileName, baseName) => {
        baseName = baesName.split('-');
        response.send('**' + baseName + '**');
        const href = 'http://' + request.hostname + fileName;
        response.send('wrote test report to: ' + href);
        if (baseName[1] == 'android') {
            androidDone = true;
        }
        else { // ios
            iosDone = true;
        }
        if (iosDone && androidDone) {
            fs.unlinkFileSync(LOCK_FILE);
            response.sendStatus(200);
            response.end();
        }
    }
    execSync('cordova run android --emulator');
    execSync('cordova run ios --emulator');
}

app.post('/log/:secret/:baseName', (request, response) => {
    if (request.params.secret !== POST_SECRET) {
        throw new Error('invalid key');
    }
    var body = [];
    request.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body);
        const timestamp = new Date().toISOString().replace(':', '.');
        const fileName = '/logs/post-' + request.params.baseName + '-' +
            timestamp + '.html';
        fs.writeFileSync('.' + fileName, body);
        onPost(fileName, baseName);
    });
});

// if the server crashed kill the lock file
onGet('clear-lock', () => {
    fs.unlinkSync(LOCK_FILE);
    response.sendStatus(200);
    response.end();
});

// on get return ./logs/<log file name>
onGet('log', (fileName, response) => {
    // santize fileName to prevent arbitrary access
    fileName = fileName.replace(/\//g, '');
    respons.header('Content-Type', 'text/html');
    response.send(fs.readFileSync('./logs/' + fileName));
    response.sendStatus(200);
    response.end();
});



app.listen(PORT, () => {
  console.log('Listening on port %s.', PORT);
});

// ----------------------------------------------------------------------------
// UTILITIES

function deleteFilesInOlderThan(dir, maxAgeDays) {
    const filesNames = fs.readdirSync(dir);
    for (aFileName of fileNames) {
        const filePath = path.join(dir, aFileName);
        const modTime = moment(fs.statSync(filePath).mtime);
        if (modTime.isBefore(moment().subtract(maxAgeDays, 'days'))) {
            fs.unlinkSync(filePath);
        }
    }
}

// on a get request to app with path /basePath/:subPath run callback(:subPath, response)
// returns a 200 unless an exception is raised in which case a 500 is substituted
function onGet(app, basePath, callback) {
    app.get('GET', '/' + basePath + '/:subPath', (request, response) => {
        const subPath = request.params.subPath;
        log('requests', [ 'GET', basePath, subPath ].join());
        try {
            callback(subPath, response, request);
        } catch (e) {
            response.sendStatus(500);
            e = e.stack || e; // capture stack trace if this is an Error object
            e = e + ''; // stringify
            log('requests', 'ERROR: ' + e);
            response.send(e);
            response.end();
        }
    });
}

// append text to logs/<fileName>.txt prefixed by timestamp
function log(fileName, text) {
    fs.appendFileSync('./logs/' + fileName + '.html', new Date().toISOString() +
        ' ' + text + '');
}
