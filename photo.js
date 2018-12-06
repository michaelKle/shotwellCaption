var moment = require('moment');

var shell = require('shelljs');
var fs = require('fs');
var path = require('path');


function Photo(dbobject) {

    var index = dbobject.index;
    var dbobject_ = dbobject;
    var cacheDir = './cache';
    var svgDir = './svgs';
    this.dbobject = dbobject;
    var photoData = {
        cached : false
    };

    
    function getFormattedDate()
    {
        if (!dbobject_.hasOwnProperty('exposure_time'))
            return '';    

        var m = moment.unix(dbobject_.exposure_time);
        m.locale('de');
        
        return m.format('LL');
    }

    function getFormattedTitle()
    {
        if (!dbobject_.hasOwnProperty('title'))
            return '';

        return dbobject_.title;
    }

    this.getExposureTime = function()
    {
        return dbobject_.exposure_time;
    };

    this.getTempJpegPath = function()
    {
        var p = cacheDir + '/'+index+'-'+dbobject_.exposure_time + '.jpg';
        return path.resolve(p);
    };

    this.getTempSvgPath = function()
    {
        return svgDir + '/'+index+'-'+dbobject_.exposure_time + '.svg';
    };

    this.getOutputPngPath = function()
    {
        return './output/'+index+'-'+dbobject_.exposure_time + '.png';
    };

    this.getOutputJpgPath = function()
    {
        shell.mkdir('-p', './jpegs');
        return './jpegs/'+index+'-'+dbobject_.exposure_time + '.jpg';
    };

    this.getCaptionText = function()
    {
        var d = getFormattedDate();
        var t = getFormattedTitle();
        if (d.length > 0 && t.length > 0)
            d += ': ';
        return d + t;
    };

    this.isSmall = function()
    {
        return dbobject_.comment == 'klein';
    }

    this.isRotatedOk = function()
    {
        if (dbobject_.width < dbobject_.height)
        {
            if (dbobject_.orientation == '1')
                return true;
            else
                return false;
        }
        else {
            if (dbobject_.orientation == '1')
                return true;
            else
                return false;
        }
        return false;
    };

    this.exportSvg = function(svg, forceExport)
    {
        var exportSvgPath = this.getTempSvgPath();
        if (fs.existsSync(exportSvgPath))
        {
            console.log('NOT exporting as ' + exportSvgPath + ' exists');
        }
        else
        {
            console.log('Exporting SVG as ' + exportSvgPath);

            shell.mkdir('-p', svgDir);
            fs.writeFileSync(exportSvgPath, svg);
            return exportSvgPath;        
        }
    };

    this.cacheAndCorrect = function(forceCache)
    {
        var tempJpegPath = this.getTempJpegPath();
        if (fs.existsSync(tempJpegPath))
        {
            console.log('NOT cache as ' + tempJpegPath + ' exists');
        }
        else
        {
            var cmd = 'convert -auto-orient "' + dbobject_.filename + '" "' + tempJpegPath + '"';
            console.log(cmd);
            shell.mkdir('-p', cacheDir);
            var ret = shell.exec(cmd);
        }
        
        photoData.cached = true;
        photoData.cachedPath = tempJpegPath;
        photoData.imgwidth = dbobject_.width;
        photoData.imgheight = dbobject_.height;
        if (!this.isRotatedOk())
        {
            photoData.imgwidth = dbobject_.height;
            photoData.imgheight = dbobject_.width;    
        }
    };

    this.getTemplateData = function()
    {
        var exp =  {
            caption: this.getCaptionText(),
            path: dbobject_.filename,
            imgwidth: dbobject_.width,
            imgheight: dbobject_.height,
            imgar: dbobject_.width /  dbobject_.height,
            small: this.isSmall()
        };
        if (photoData.cached)
        {
            exp.imgwidth = photoData.imgwidth;
            exp.imgheight = photoData.imgheight;
            exp.path = photoData.cachedPath;
            exp.imgar = exp.width /  exp.height;
        }

        return exp;
    };

    this.getSize = function()
    {
        return { width: dbobject_.width, height: dbobject_.height, ratio: dbobject_.width /  dbobject_.height};
    };

    return this;
};

module.exports.Photo = Photo;