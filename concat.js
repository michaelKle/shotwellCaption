var shell = require('shelljs');
var fs = require('fs');
var commandLineArgs = require('command-line-args');
var imgSize = require('image-size');

var optionDefinitions = [
    { name: 'list', alias: 'l', type: Boolean },
    { name: 'photos', type: String},
    { name: 'command', type: String},
    { name: 'force', type: Boolean}
];  
options = commandLineArgs(optionDefinitions);

var JPEG_DIR = './jpegs/';
var CONCAT_DIR = './concat/';
var SMALL_SIZE = 938;

var jpegs = shell.ls(JPEG_DIR);


var copyOnly = [];
var smallLandscape = [];
var smallPortrait = [];

jpegs.forEach(f => {
    var absPath = JPEG_DIR + f;
    var dim = imgSize(absPath);

    if (dim.height == SMALL_SIZE)
    {
        smallLandscape.push(f);
    }
    else if (dim.width == SMALL_SIZE)
    {
        smallPortrait.push(f);
    }
    else 
    {
        copyOnly.push(f);
    }

    //console.log(absPath + '=>' + JSON.stringify(dim));
});



function getPair(path1, path2)
{
    var num1 = path1.match(/(\d*)-.*/)[1];
    var num2 = path2.match(/(\d*)-.*/)[1];

    return { mergePath: num1+'-'+num2+'.jpg', path1: path1, path2: path2 };
}


console.log('Small Landscape - ' + smallLandscape.length);
var smallLandscapePairs = [];
for (var i = 0; i < smallLandscape.length; i+=2)
{
    var next = i+1;
    if (next == smallLandscape.length)
        next = i;
    smallLandscapePairs.push(getPair(smallLandscape[i], smallLandscape[next]));
}
smallLandscapePairs.forEach(p => {
    p.mergePath = CONCAT_DIR + p.mergePath;
    p.path1 = JPEG_DIR + p.path1;
    p.path2 = JPEG_DIR + p.path2;
    //console.log(p.mergePath + '=>' + p.path1 + '+' + p.path2);
    var cmd = 'convert ' + p.path1 + ' ' + p.path2 + ' -append ' + p.mergePath;
    console.log(cmd);
    shell.exec(cmd);
});


console.log('Small Portraits - ' + smallPortrait.length);
var smallPortraitPairs = [];
for (var i = 0; i < smallPortrait.length; i+=2)
{
    var next = i+1;
    if (next == smallPortrait.length)
        next = i;
    smallPortraitPairs.push(getPair(smallPortrait[i], smallPortrait[next]));
}
smallPortraitPairs.forEach(p => {
    p.mergePath = CONCAT_DIR + p.mergePath;
    p.path1 = JPEG_DIR + p.path1;
    p.path2 = JPEG_DIR + p.path2;
    //console.log(p.mergePath + '=>' + p.path1 + '+' + p.path2);
    var cmd = 'convert ' + p.path1 + ' ' + p.path2 + ' +append ' + p.mergePath;
    console.log(cmd);
    shell.exec(cmd);
});

console.log('Copy only');
copyOnly.forEach(f => {
    console.log('copy '+JPEG_DIR+f +' '+ CONCAT_DIR+f);
    shell.cp(JPEG_DIR+f, CONCAT_DIR+f);
});
