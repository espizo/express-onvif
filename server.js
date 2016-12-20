var onvif = require('onvif');
var Cam = require('onvif').Cam;
var express = require('express');
var app = express();
var RTMPPROXY_HOSTNAME = '1029.mythkast.net'
var RTMPPROXY_APP = 'live'
app.get('/search', function (req, res) {
    onvif.Discovery.probe({ timeout: 1000 }, function (err, cams) {
        if (err) { throw err; }
        var myarray = [];
        var cameraid = 0;
        if (cams.length == 0) {
            res.end();
        } else {
            cams.forEach(function (cam) {
                cam.getStreamUri({ protocol: 'RTSP' }, function (err, stream) {
                    console.log('rtsp url:' + stream.uri);
                    //generate json "{in:rtsp://xxxx,out:rtmp://xxxxx}" via RTMPPROXY_HOSTNAME and RTMPPROXY_APP
                    var result = { in: stream.uri, out: 'rtmp://' + RTMPPROXY_HOSTNAME + '/' + RTMPPROXY_APP + '/ch' + cameraid };
                    cameraid++;
                    myarray.push(result);
                    if (cameraid == cams.length)
                        res.send(JSON.stringify(myarray));
                });
            });
        }
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('listening at http://localhost:%s', port);
});