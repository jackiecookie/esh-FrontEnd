define(['js/common/mcifreamVerify/mcpricePageCommon'], function (require, exports, module) {
    require.async(['js/common/date/date', 'layerExt'], function (date) {
        $('.end_time').click(function () {
            date(this);
        });
    });
    $('#addyarn').click(function () {
        $.layer({
            type: 2,
            title: '添加纱织价格',
            shadeClose: false,
            fix: false,
            shift: 'top',
            area: ['912px', 750],
            iframe: {
                src: '/MemberCenter/Yarn/AddYarn.aspx',
                scrolling: 'no'
            }, close: function () {
                if (window.useReload) {
                    location.reload();
                }
            }
        });
    });
    var sendRequest = function (action, sysid, fn, para) {
        var actionurl = '/MemberCenter/Yarn/ashx/AddYarn.ashx';
        $.getJSON(actionurl, $.extend(para, {
            action: action,
            sysid: sysid
        }), fn);
    }
   
    var mcpricePageCommon = require('js/common/mcifreamVerify/mcpricePageCommon');

    mcpricePageCommon(sendRequest);
});