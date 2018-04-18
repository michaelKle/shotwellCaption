var shell = require('shelljs');
var fs = require('fs');
var PhotoTemplate = require('./phototemplate.js').PhotoTemplate;

var p = {
    path: '/home/michael/Auswahl/DSC_0191.JPG',
    rectwidth: 25
};
var t = new PhotoTemplate(p);
var svg = t.generateSvg();


var exportSvgPath = './output/DSC_0191.svg';
fs.writeFileSync(exportSvgPath, svg);

shell.exec('inkscape -d 100 -z '+ exportSvgPath + ' -e output/out.png');