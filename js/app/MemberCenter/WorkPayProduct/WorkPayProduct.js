define(['js/common/mcifreamVerify/mcpricePageCommon'], function (require, exports, module) {
    require.async(['layerExt']);
    var isProductType = $('#ProductType').val() == '0';
    var ext = isProductType ? '' : '?isks=1';
    var src = isProductType ? '/MemberCenter/WorkPayProduct/AddWorkPayProduct.aspx' : '/MemberCenter/WorkPayProduct/AddWorkPayKs.aspx';
    $('#addyarn').click(function () {
        $.layer({
            type: 2,
            title:isProductType? '添加填充物辅料价格':'添加款式工缴',
            shadeClose: false,
            fix: false,
            shift: 'top',
            area: ['912px', 850],
            iframe: {
                src: src,
                scrolling: 'no'
            }, close: function () {
                if (window.useReload) {
                    location.reload();
                }
            }
        });
    });
    var sendRequest = function (action, sysid, fn, para) {
        var actionurl = '/MemberCenter/WorkPayProduct/ashx/AddWorkPayProduct.ashx' + ext;
        $.getJSON(actionurl, $.extend(para, {
            action: action,
            sysid: sysid
        }), fn);
    }

    var mcpricePageCommon = require('js/common/mcifreamVerify/mcpricePageCommon');

    mcpricePageCommon(sendRequest);
});