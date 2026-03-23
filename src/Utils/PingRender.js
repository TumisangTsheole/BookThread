"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Use import instead of require (if your environment supports ES modules)
var http = require("http");
var sleep = function (ms, callback) {
    setTimeout(callback, ms);
};
var isAlive = function (url, callback) {
    var request = http.get(url, function (response) {
        if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
            sleep(1000, function () {
                callback(true);
            });
        }
        else {
            callback(false);
        }
    });
    request.on('error', function () {
        console.error('Error checking backend health');
        callback(false);
    });
    request.end();
};
isAlive("http://localhost:5164/api/Health", function (backendHealth) {
    console.log(backendHealth);
});
