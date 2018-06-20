module.exports = (function () {
    var loglevel = require('loglevel');
    loglevel.setDefaultLevel(loglevel.levels.DEBUG);

    return {
        getLogger : function(loggerName) {
            return loglevel.getLogger(loggerName);
        }
    }
})();
