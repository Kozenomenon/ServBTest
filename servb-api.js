'use strict';

var http = require('http');
var fs = require('fs');
const dateFormat = require('dateformat');

class ServBApi{
    constructor(){
        
    }

    processWebRequest(req, res) {
        if (req.url == '/servb') { //check the URL of the current request
                    
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string
            });

            req.on('end', () => {
                console.log(`Received body len >>>`,body.length);
                var logFile = fs.createWriteStream(`.\\Results_${dateFormat(new Date(),'yyyymmddHHMMss')}.txt`, { flags: 'a' });
                logFile.write(body);
                logFile.close();

                res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.write(`{"success":true}`);
                res.end();
            });
        }
    }

    begin() {
        this._server = http.createServer(this.processWebRequest);
        this._server.listen(5555, 'localhost', () => {
            setTimeout(() => {
                console.log('ServBApi opened server on >>> ', this._server.address());
            }, 100);
         });
    }
}

var servBApi = new ServBApi();
servBApi.begin();