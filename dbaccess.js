var sqlite3 = require('sqlite3').verbose();
var moment = require('moment');
var Photo = require('./photo.js').Photo;
var deasync = require('deasync');

function asyncGetPhotoList(callback)
{
    var db = new sqlite3.Database('photoreal.db');
    var photos = [];
    var cb = callback;
    db.all('SELECT * from PhotoTable WHERE title IS NOT NULL', function(err, rows){
        for (var i = 0; i < rows.length; ++i)
        {
            rows[i].index = i;
            var p = new Photo(rows[i]);
            photos.push(p);
        }
        cb(null, photos);
    });
}

var syncGetPhotoList = deasync(asyncGetPhotoList);
module.exports.syncGetPhotoList = syncGetPhotoList;