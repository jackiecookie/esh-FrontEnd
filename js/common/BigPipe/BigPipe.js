/*
bigPipe js
*/
define(['tools'], function (require, exports, module) {
    var addScriptHelp = require('tools').addScriptHelp;
    exports.AddView = function (json) {
        $('#' + json.pid).html(json.html);
        addScriptHelp.addCssLink(json.css);
        addScriptHelp.addScriptLink(json.js);
    };
});