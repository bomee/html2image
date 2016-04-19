var page = require('webpage').create();
var system = require('system');
page.content=system.args[1];
page.render(system.args[2]);
phantom.exit();
