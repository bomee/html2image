var express = require('express');
var app = express();
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var fs = require('fs');
var querystring = require('querystring');
var bodyParser = require('body-parser');

const hostname = '127.0.0.1';
const port = process.env.PORT || 5050;

var textParser = bodyParser.text();

app.get('/echart2png', function (req, res) {
  var fileName = 'temp_' + (new Date()).getTime() + '.png';
  var url = `http://${hostname}:${port}/echart?` + querystring.stringify(req.query);
  childProcess.execFile(binPath, ['phantomjs-url2png.js', url, fileName], function(err, stdout, stderr) {
    !err && res.sendFile(fileName, {root:__dirname}, function (err) {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      fs.unlink(fileName);
    });
  });
});

app.get('/highcharts2png', function (req, res) {
  var fileName = 'temp_' + (new Date()).getTime() + '.png';
  var url = `http://${hostname}:${port}/highcharts?` + querystring.stringify(req.query);
  childProcess.execFile(binPath, ['phantomjs-url2png.js', url, fileName], function(err, stdout, stderr) {
    !err && res.sendFile(fileName, {root:__dirname}, function (err) {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      fs.unlink(fileName);
    });
  });
});

app.all('/html2png', function (req, res) {
  var fileName = 'temp_' + (new Date()).getTime() + '.png';
  var html = req.body || req.query.html;
  //console.log(html);
  childProcess.execFile(binPath, ['phantomjs-html2png.js', html, fileName, req.query.w, req.query.h], function(err, stdout, stderr) {
    !err && res.sendFile(fileName, {root:__dirname}, function (err) {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      fs.unlink(fileName);
    });
  });
});

app.all('/html2pdf', function (req, res) {
  var fileName = 'temp_' + (new Date()).getTime() + '.pdf';
  var html = req.body || req.query.html;
  childProcess.execFile(binPath, ['phantomjs-html2pdf.js', html, fileName], function(err, stdout, stderr) {
    !err && res.sendFile(fileName, {root:__dirname}, function (err) {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      fs.unlink(fileName);
    });
  });
});

app.get('/echart', function(req, res){
  //console.log(req.query.opts);
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><script src="http://echarts.baidu.com/dist/echarts.min.js"></script></head>
      <body>
        <div id="echart" style="width:${req.query.w}px; height:${req.query.h}px;"></div>
      </body>
      <script>echarts.init(document.getElementById("echart")).setOption(${req.query.opts});</script>
    </html>`
  );
});

app.get('/highcharts', function(req, res){
  //console.log(req.query.opts);
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <script src="http://cdn.hcharts.cn/jquery/jquery-1.8.3.min.js"></script>
        <script src="http://cdn.hcharts.cn/highcharts/highcharts.js" ></script>
        <script src="http://cdn.hcharts.cn/highcharts/highcharts-more.js" ></script>
      </head>
      <body>
        <div id="container" style="width:${req.query.w}px; height:${req.query.h}px;"></div>
      </body>
      <script>
        Highcharts.setOptions({
            plotOptions: {
                series: {
                    animation: false
                }
            }
        });
        $("#container").highcharts(${req.query.opts});
    </script>
    </html>`
  );
});

console.log(`html to image server running at http://${hostname}:${port}`);
app.listen(port);
