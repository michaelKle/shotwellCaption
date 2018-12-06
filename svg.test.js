var assert = require('assert');

var SVG = require('./svg.js').SVG;



describe('SVG Tests', function() {
	it('spawns inkscape to retrieve selection width', function(done) {
        var svgsource = '<svg></svg>';

        var cmdLine = "";
        var svg = new SVG(svgsource, { exec : function(str) { cmdLine = str; return { stdout: "50"}; }});
        var w = svg.queryWidth('textid');
        assert.equal(w, 50);
        assert.equal(cmdLine, "inkscape -W -I textid /tmp/svgTemp.svg");
		done();
    });
});