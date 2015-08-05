/*
    退出网站
*/

define(['jquery'], function (require, exports, module) {
    module.exports = function () {
        var inFormOrLink;
        $('a[href]:not([target]), a[href][target=_self]').live('click', function () {
            inFormOrLink = true;
        });
        $('form').bind('submit', function () { inFormOrLink = true; });
        window.onbeforeunload = function() {
            if (!inFormOrLink) {
                $.post('/Member/ashx/memberloginout.ashx');
            }
        };
//        $(window).bind('beforeunload', function () {
//            if (!inFormOrLink) {
//                $.post('/Member/ashx/memberloginout.ashx');
//            }
//        });
    };

})