module.exports = (function () {

    var srcDir = 'src';
    var mainSrc = srcDir + '/main';
    var nodeModulesDir = 'node_modules';
    var distDir = 'dist';

    // Configuration property for src and build directories
    return {
        npm: {
            root: nodeModulesDir
        },
        src: {
            root: srcDir,
            pug: {
                main: mainSrc + '/pug'
            },
            less: {
                main: mainSrc + '/less'
            },
            javascript: {
                main: mainSrc + '/js'
            },
            images: {
                main: mainSrc + '/images'
            },
            fonts: {
                main: mainSrc + '/fonts'
            }
        },
        dist: {
            root: distDir,
            less: distDir + '/styles',
            javascript: distDir + '/scripts',
            images: distDir + '/images',
            fonts: distDir + '/styles/fonts'
        }
    };
})();
