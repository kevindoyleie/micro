var path = require('path');
var webpack = require('webpack');
var entryPointSourceDir = './src/main/js';
var outputPath = '/dist/scripts/';
var PATHS = {
    entries: path.join(__dirname, entryPointSourceDir),
    output: path.join(__dirname, outputPath)
};

function produceEntryFileList(sourceDir) {
    //read and place ALL entires from javascript pages folder
    var files = require('glob').sync(sourceDir + '**/*.js',{});
    var entries = {};
    var outputFolder = path.join(__dirname,sourceDir);
    files.forEach(function(element) {
        var key = element.replace(sourceDir,'').replace('.js','');
        entries[key] = outputFolder + key;
    });
    return entries;
}

module.exports = {
    entry: produceEntryFileList(entryPointSourceDir),
    output: {
        filename: '[name].js',
        path: PATHS.output
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ]
};