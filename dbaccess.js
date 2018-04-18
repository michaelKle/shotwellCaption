var sqlite3 = require('sqlite3').verbose();
var moment = require('moment');

var db = new sqlite3.Database('photo.db');

db.all('SELECT * from PhotoTable', function(err, rows){
    for (var i = 0; i < rows.length; ++i)
    {
        var photo = rows[i];

        var m = moment.unix(photo.exposure_time);
        m.locale('de');
        var d = m.format('LL') + ':';

        console.log(''+photo.filename+' time_created: '+d+' title: '+photo.title);
        //console.log('rows:'+JSON.stringify(rows));
    }
    
});

1512915488