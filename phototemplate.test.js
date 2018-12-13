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


function generateSvgWithCaptionWidthAndReturnNodeAttribute(photo, captionWidth, node, attr)
{
    var t = new PhotoTemplate(photo);
    if (captionWidth != undefined)
        t.adaptCaptionRectangle(captionWidth);
        
    var svg = t.generateSvg();

    var doc = new dom().parseFromString(svg);
    return doc.getElementById(node).getAttribute(attr);
}

function generateSvgAndReturnNodeAttribute(photo, node, attr)
{
    return generateSvgWithCaptionWidthAndReturnNodeAttribute(photo, undefined, node, attr);
}




describe('Photo Template Tests', function() {
    it('selects template based on size/orientation standard', function(done) {
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, imgwidth: 150, imgheight: 100 }, 'width'), '89px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, imgwidth: 150, imgheight: 100 }, 'height'), '75px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, imgwidth: 100, imgheight: 150 }, 'width'), '75px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, imgwidth: 100, imgheight: 150 }, 'height'), '89px');
        
        done();
    });
    it('selects template based on size/orientation small', function(done) {
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, imgwidth: 150, imgheight: 100 }, 'width'), '89px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, imgwidth: 150, imgheight: 100 }, 'height'), '75px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, imgwidth: 100, imgheight: 150 }, 'width'), '75px');
        assert.equal(generateSvgAndReturnSvgAttribute({ small: true, imgwidth: 100, imgheight: 150 }, 'height'), '89px');
        
        done();
    });
    it('sizes template based on size/orientation and tag standard', function(done) {
        assert.equal(generateSvgAndReturnImgAttribute({ small: false, imgwidth: 150, imgheight: 100 }, 'width'), '133.50');
        assert.equal(generateSvgAndReturnImgAttribute({ small: false, imgwidth: 150, imgheight: 100 }, 'height'), '89.00');
        assert.equal(generateSvgAndReturnImgAttribute({ small: false, imgwidth: 100, imgheight: 150 }, 'width'), '89.00');
        assert.equal(generateSvgAndReturnImgAttribute({ small: false, imgwidth: 100, imgheight: 150 }, 'height'), '133.50');
        
        done();
    });

    it('sizes template based on size/orientation and tag small', function(done) {
        assert.equal(generateSvgAndReturnImgAttribute({ small: true, imgwidth: 150, imgheight: 100 }, 'width'), '89.00');
        assert.equal(generateSvgAndReturnImgAttribute({ small: true, imgwidth: 150, imgheight: 100 }, 'height'), '59.33');
        assert.equal(generateSvgAndReturnImgAttribute({ small: true, imgwidth: 100, imgheight: 150 }, 'width'), '59.33');
        assert.equal(generateSvgAndReturnImgAttribute({ small: true, imgwidth: 100, imgheight: 150 }, 'height'), '89.00');
        
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
		assert.equal(rectPos, t.textOffset);
		
        done();
    });

    it('sets caption position', function(done) {
        assert.equal(generateSvgAndReturnNodeAttribute({imgwidth: 150, height: 100, captionPlacement: undefined }, 'rect8', 'y'), '5');
        assert.equal(generateSvgAndReturnNodeAttribute({imgwidth: 150, height: 100, captionPlacement: undefined }, 'rect8', 'x'), '5');
        
        assert.equal(generateSvgAndReturnNodeAttribute({imgwidth: 150, height: 100, captionPlacement: 'bl' }, 'rect8', 'y'), '84');
        assert.equal(generateSvgAndReturnNodeAttribute({imgwidth: 150, height: 100, captionPlacement: 'bl' }, 'rect8', 'x'), '5');

        done();
    });

    it('sets caption position with caption width', function(done) {
        assert.equal(generateSvgWithCaptionWidthAndReturnNodeAttribute({imgwidth: 150, height: 100, captionPlacement: 'tr'}, 50, 'rect8', 'y'), '5');
        assert.equal(generateSvgWithCaptionWidthAndReturnNodeAttribute({imgwidth: 150, height: 100, captionPlacement: 'tr' }, 50, 'rect8', 'x'), '145');
        
        done();
    });

    it('sets caption text position', function(done) {
        assert.equal(generateSvgAndReturnNodeAttribute({imgwidth: 150, height: 100, captionPlacement: undefined }, 'textid', 'y'), '7.5'); // 5 + 2.5
        assert.equal(generateSvgAndReturnNodeAttribute({imgwidth: 150, height: 100, captionPlacement: 'bl' }, 'textid', 'y'), '86.5'); // 89 - 5 + 2.5
        
        done();
    });
    
});