var shell = require('shelljs');
var fs = require('fs');
var commandLineArgs = require('command-line-args')
var PhotoTemplate = require('./phototemplate.js').PhotoTemplate;
var SVG = require('./svg.js').SVG;
var syncGetPhotoList = require('./dbaccess').syncGetPhotoList;
var adaptation = require('./adaptation.js');


var optionDefinitions = [
    { name: 'list', alias: 'l', type: Boolean },
    { name: 'photos', type: String},
    { name: 'command', type: String},
    { name: 'force', type: Boolean}
];  
options = commandLineArgs(optionDefinitions);
var photos = syncGetPhotoList();

function mergeArraysUnique(arrayOne, arrayTwo)
{
    var ret = arrayOne;
    arrayTwo.forEach(x => {
        if (ret.indexOf(x) == -1)
            ret.push(x);
    });
    return ret;
}

function getArrayFromRangeExpression(rangeExpr)
{
    var range = rangeExpr.split('-');
    var rangeStart = range[0];
    var rangeEnd = rangeStart;
    if (range.length > 1)
        rangeEnd = range[1];

    var ret = [];
    for (var i = parseInt(rangeStart); i <= parseInt(rangeEnd); ++i)
    {
        ret.push(i);
    }
    return ret;
}

function get_matching_photos(photoRange)
{
    var retList = [];
    photoRange.split(',').forEach(rangeExpr => {
        mergeArraysUnique(retList, getArrayFromRangeExpression(rangeExpr));
    });
    
    var photoList = [];
    retList.forEach(index => {
        photoList.push(photos[index]);
    });

    return photoList;
}


function exportSvg(photo)
{
    photo.cacheAndCorrect();
    if (fs.existsSync(photo.getTempSvgPath()) && !options.force)
    {
        console.log('Not exporting SVG ' + photo.getTempSvgPath() + " as it already exists" );
    }
    else
    {
        var p = photo.getTemplateData();
    
        var t = new PhotoTemplate(p);
        var s = new SVG(t.generateSvg());
        var w = s.queryWidth('textid');
        t.adaptCaptionRectangle(w);
        var svg = t.generateSvg();
        
        photo.exportSvg(svg, options.force);
    }
}


function convertSvg(photo)
{
    if (fs.existsSync(photo.getOutputJpgPath()) && !options.force)
    {
        console.log('Not convert SVG ' + photo.getOutputJpgPath() + " as it already exists" );
    }
    else
    {
        var exportPngPath = photo.getOutputPngPath();
        console.log('Export SVG to '+exportPngPath);
        shell.exec('inkscape -d 1200 -z '+ photo.getTempSvgPath() + ' -e ' + exportPngPath);
        var exportJpgPath = photo.getOutputJpgPath();
        console.log('Export JPEG to '+exportJpgPath);
        shell.exec('convert ' + exportPngPath + ' ' + exportJpgPath);
        shell.rm(exportPngPath);
    }
}

function adapt(photo)
{
    if (adaptation.rotation.indexOf(photo.index) != -1)
    {
        photo.adaptRotation();
    }

    if (adaptation.adaptation.bl.indexOf(photo.index) != -1)
    {
        photo.captionPlacement = 'bl';
    }
    if (adaptation.adaptation.tr.indexOf(photo.index) != -1)
    {
        photo.captionPlacement = 'tr';
    }
    if (adaptation.adaptation.br.indexOf(photo.index) != -1)
    {
        photo.captionPlacement = 'br';
    }

    return photo;
}


function get_action()
{
    if (options.command == 'info')
    {
        return function(p) {
            console.info(JSON.stringify(p.getTemplateData()));
        };
    }
    if (options.command == 'cache')
    {
        return function(p) {
            p.cacheAndCorrect();
        };
    }
    if (options.command == 'svg')
    {
        return exportSvg;
    }
    if (options.command == 'convert')
    {
        return convertSvg;
    }
    if (options.command == 'all')
    {
        return function(p) {
            p.cacheAndCorrect();
            exportSvg(p);
            convertSvg(p);
        };
    }

    throw "Command not found: '" + options.command + "'";
}


if (options.photos)
{
    var action = get_action();

    get_matching_photos(options.photos).forEach(p => {
        if (adaptation.weg.indexOf(p.index) != -1)
        {
            console.info('Doing nothing for index ' + p.index + ' - to be deleted');
        }
        else
        {
            action(adapt(p));
        }
    });
}



if (options.list)
{
    var sizes = [];
    var sizesString = [];
    var numPerSize = {};
    photos.forEach((photo, index) => {
        var s = photo.getSize();
        var ss = JSON.stringify(s);
        console.log(index+':'+JSON.stringify(photo.getTemplateData()));
        if (sizesString.indexOf(ss) == -1)
        {
            sizes.push(s);
            sizesString.push(ss);
        }
        numPerSize[ss] = numPerSize.hasOwnProperty(ss) ? numPerSize[ss]+1 : 1;
    });

    sizesString.forEach(s => {
        console.log('S:'+s);
    });

    console.log(JSON.stringify(numPerSize));
}

