var assert = require('assert');

var PhotoTemplate = require('./phototemplate.js').PhotoTemplate;
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;


function generateSvgAndReturnSvgAttribute(photo, attr)
{
    var t = new PhotoTemplate(photo);
    var svg = t.generateSvg();

    var doc = new dom().parseFromString(svg);
    return doc.getElementById('svg8').getAttribute(attr);
}

function generateSvgAndReturnImgAttribute(photo, attr)
{
    var t = new PhotoTemplate(photo);
    var svg = t.generateSvg();

    var doc = new dom().parseFromString(svg);
    return doc.getElementById('image16').getAttribute(attr);
}

describe('Photo Template Tests', function() {
    it('selects template based on size/orientation', function(done) {
        assert.equal(generateSvgAndReturnSvgAttribute({ small: false, width: 150, height: 100 }, 'width'), '150px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: false, width: 150, height: 100 }, 'height'), '89px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: false, width: 100, height: 150 }, 'width'), '89px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: false, width: 100, height: 150 }, 'height'), '150px');
                
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, width: 150, height: 100 }, 'width'), '89px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, width: 150, height: 100 }, 'height'), '75px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, width: 100, height: 150 }, 'width'), '75px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, width: 100, height: 150 }, 'height'), '89px');
        
        done();
    });
    it('sizes template based on size/orientation and tag', function(done) {
        assert.equal(generateSvgAndReturnImgAttribute({ small: false, width: 150, height: 100 }, 'width'), '133.50');
        assert.equal(generateSvgAndReturnImgAttribute({ small: false, width: 150, height: 100 }, 'height'), '89');
        assert.equal(generateSvgAndReturnImgAttribute({ small: false, width: 100, height: 150 }, 'width'), '89');
        assert.equal(generateSvgAndReturnImgAttribute({ small: false, width: 100, height: 150 }, 'height'), '133.50');

        assert.equal(generateSvgAndReturnImgAttribute({ small: true, width: 150, height: 100 }, 'width'), '89');
        assert.equal(generateSvgAndReturnImgAttribute({ small: true, width: 150, height: 100 }, 'height'), '59.33');
        assert.equal(generateSvgAndReturnImgAttribute({ small: true, width: 100, height: 150 }, 'width'), '59.33');
        assert.equal(generateSvgAndReturnImgAttribute({ small: true, width: 100, height: 150 }, 'height'), '89');
        
        done();
    });

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

    it('scales the caption rectangle and position based on passed width', function(done) {
        var p = { caption: 'caption 10' };
        var t = new PhotoTemplate(p);
        t.adaptCaptionRectangle(50);
        var svg = t.generateSvg();

        var doc = new dom().parseFromString(svg);
        var rectNode = doc.getElementById('rect8');
        var rectWidth = rectNode.getAttribute('width');
		assert.equal(rectWidth, 50+t.textMargin*2);
        var rectPos = rectNode.getAttribute('x');
		assert.equal(rectPos, 5-t.textMargin);
		
        done();
    });
    
});