/*
获取IE浏览器版本
*/
define([], function (require, exports, module) {
    var c = navigator.userAgent.toLowerCase();
    var b = c.match(/msie ([\d.]+)/) ? c.match(/msie ([\d.]+)/)[1] : undefined;
    var IE = typeof (b) != "undefined";
    IE = IE ? parseInt(b) : 0;
    var isOpera = c.match(/opera\/([\d.]+)/);
    var isWebKit = /applewebkit/.test(c);
    module.exports = {
        IE: IE,
        isOpera: isOpera,
        isWebKit: isWebKit,
        isOldWebKit : +navigator.userAgent
  .replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, "$1") < 536
    };


})