var fs = require('fs');
var shell = require('shelljs');

function SVG(svgsource, shellprovider) {

    var _shell = shell;
    if (shellprovider !== undefined)
        _shell = shellprovider;

    this.queryWidth = function(objectId)
    {
        var fpath = '/tmp/svgTemp.svg';
        fs.writeFileSync(fpath, svgsource);
        var output = _shell.exec('inkscape -W -I '+objectId+' '+fpath);
        return output.stdout;
    };

}

module.exports = {
    SVG : SVG
};