var assert = require('assert');

var Photo = require('./photo.js').Photo;

describe('Photo Tests', function() {
	// And then we describe our testcases.
	it('returns empty cpation on empty object', function(done) {
        var p = new Photo({});

		assert.equal(p.getCaptionText(), '');
		done();
	});

	it('returns caption with timestamp in human form', function(done) {
        var p = new Photo({exposure_time: 1372510868});

		assert.equal(p.getCaptionText(), '29. Juni 2013:');
		done();
	});

	it('returns caption with title', function(done) {
        var p = new Photo({title: 'That is the thing.'});

		assert.equal(p.getCaptionText(), 'That is the thing.');
		done();
	});

	it('detects portrait orientation when not exif rotated', function(done) {
        var p = new Photo({width: 2268, height: 4032, orientation: 1});
		assert.equal(p.getOrientation(), 'P');

		done();
	});

	it('detects portrait orientation when exif rotated', function(done) {
        var p = new Photo({width: 6000, height: 4000, orientation: 8});
		assert.equal(p.getOrientation(), 'P');

		done();
	});

	it('detects landscape orientation when exif not rotated', function(done) {
        var p = new Photo({width: 6000, height: 4000, orientation: 1});
		assert.equal(p.getOrientation(), 'L');

		done();
	});

	it('detects landscape orientation when exif rotated', function(done) {
        var p = new Photo({width: 4000, height: 6000, orientation: 8});
		assert.equal(p.getOrientation(), 'L');

		done();
	});
});