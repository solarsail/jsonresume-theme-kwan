#!/usr/bin/env node
//
// This script will run a local development server. This is useful when
// developing the theme.
//
// Usage:
// `serve.js` to use the default JSONResume example
// `serve.js <filename>` to open a particular resume file 

var http = require("http");
var theme = require("./index.js");
var fs = require('fs');
var args = require('optimist').argv;
var url = require('url');
var path = require('path');

var port = 8888;
http.createServer(function(req, res) {
    var request = url.parse(req.url, true);
    var action = request.pathname;
    if (action === "/") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(render());
        return;
    }
    var filePath = path.join(__dirname, action);
    fs.exists(filePath, function (exists) {
        if (!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        var ext = path.extname(filePath);
        var contentType = 'text/plain';
        if (ext === ".png") {
            var contentType = 'image/png';
        }
        if (ext === ".jpg") {
            var contentType = 'image/jpg';
        }
        var img = fs.readFileSync(filePath);
        res.writeHead(200, {'Content-Type': contentType });
        res.end(img, 'binary');
        return;
    });
}).listen(port);

console.log("Preview: http://localhost:8888/");
console.log("Serving..");

function render() {
    try {
        var resume = args._.length? JSON.parse(fs.readFileSync(args._[0], 'utf8')) : require("resume-schema").resumeJson;
        return theme.render(resume);
    } catch (e) {
        console.log(e.message);
        return "";
    }
}
