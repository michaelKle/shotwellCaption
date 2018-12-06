var sqlite3 = require('sqlite3').verbose();
var moment = require('moment');
var Photo = require('./photo.js').Photo;
var deasync = require('deasync');


function getFormattedDate(dbobject_)
{
    if (!dbobject_.hasOwnProperty('exposure_time'))
        return '';    

    var m = moment.unix(dbobject_.exposure_time);
    m.locale('de');
    
    return m.format('LL');
}

function asyncGetPhotoList(callback)
{
    var db = new sqlite3.Database('photo.db');
    var photos = [];
    var cb = callback;
    db.all('SELECT * from PhotoTable WHERE exposure_time < 1403525803 ORDER BY exposure_time', function(err, rows){
        for (var i = 0; i < rows.length ; ++i)
        {
            //console.log(i+''+rows[i].exposure_time+'=>'+getFormattedDate(rows[i]));
            
            rows[i].index = i;
            var p = new Photo(rows[i]);
            photos.push(p);
        }
        cb(null, photos);
    });
}

var syncGetPhotoList = deasync(asyncGetPhotoList);
module.exports.syncGetPhotoList = syncGetPhotoList;