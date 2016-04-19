var page = require('webpage').create();
var system = require('system');
page.content=system.args[1];

var w = parseInt(system.args[3]);
var h = parseInt(system.args[4]);
if(w && h){
    page.clipRect = { top: 0, left: 0, width: w, height: h };
}

page.render(system.args[2]);
phantom.exit();
