var http = require('http');

const PORT = 8080; 

function handleRequest(request, response){
    console.log('REQUEST: %s: %s', new Date(), request.url);
    response.end('It Works!! Path Hit: ' + request.url);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});