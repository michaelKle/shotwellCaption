var moment = require('moment');

function Photo(dbobject) {

    var dbobject_ = dbobject;

    function getFormattedDate()
    {
        if (!dbobject_.hasOwnProperty('exposure_time'))
            return '';    

        var m = moment.unix(dbobject_.exposure_time);
        m.locale('de');
        
        return m.format('LL') + ':' ;
    }

    function getFormattedTitle()
    {
        if (!dbobject_.hasOwnProperty('title'))
            return '';

        return dbobject_.title;
    }

    this.getCaptionText = function()
    {
        return getFormattedDate() + getFormattedTitle();
    }

    this.getOrientation = function()
    {
        if (dbobject_.width < dbobject_.height)
        {
            if (dbobject_.orientation == '1')
                return 'P';
            else
                return 'L';
        }
        else {
            if (dbobject_.orientation == '1')
                return 'L';
            else
                return 'P';
        }
        
    }

    return this;
};

module.exports.Photo = Photo;