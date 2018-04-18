var assert = require('assert');

var PhotoTemplate = require('./phototemplate.js').PhotoTemplate;

describe('Photo Template Tests', function() {
	it('includes path into svg', function(done) {
        var p = { path: '/home/michael/Auswahl/DSC_0191.JPG'};
        var t = new PhotoTemplate(p);

        var svg = t.generateSvg();
		assert.equal(svg.includes(p.path), true);
		done();
    });

    it('includes caption into svg', function(done) {
        var p = { caption: 'This is the caption' };
        var t = new PhotoTemplate(p);

        var svg = t.generateSvg();
		assert.equal(svg.includes(p.caption), true);
		done();
    });
    
});