var path = require('path');
var webpack = require('webpack');
var entryPointSourceDir = './src/main/js';
var outputPath = '/dist/scripts/';
var PATHS = {
    entries: path.join(__dirname, entryPointSourceDir),
    output: path.join(__dirname, outputPath)
};

module.exports = {
    entry: {
        index: entryPointSourceDir + '/index.js'
    },
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