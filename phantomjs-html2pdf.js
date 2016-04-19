var page = require('webpage').create();
var system = require('system');

page.paperSize ={
  format:'A4'
};
page.content=system.args[1];
page.render(system.args[2], {format:'pdf'});
phantom.exit();
