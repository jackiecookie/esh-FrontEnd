define(['jquery', 'layerExt', 'jQueryAjax'], function (require, exports, module) {
    var layer = require('layerExt');
    require('jQueryAjax');
    var countryKeyName = $('#countryKeyName').val();
    var detailClick = function() {
        var src = $(this).attr('ifhref');
        //    var area = window == top ? ['912px', 633] : ['855px', 598];
         parent.$.layer({
            type: 2,
            title: false,
            shadeClose: false,
            fix: false,
            shift: 'top',
            area: ['912px', 633],
            iframe: {
                src: src,
                scrolling: 'no'
            }
        });
    };

    $('.detail').click(detailClick);

    $('#baidusearch').click(function () {
        var company = $('#company').val();
        var baiduurl = 'http://www.baidu.com/s?wd=' + encodeURIComponent(company);
        window.open(baiduurl, '', '');
    });
    //注册弹出详情页  
    (function () {
        $('#xiangqing').click(function () {
            var company = $('#company').val();
            $.ajaxjson('/UIData/ashx/getXiangQingHandler.ashx', { 'action': countryKeyName == 'CN' ? 'CHN' : countryKeyName, 'cm': company }, function (data) {
                if (data) {
                    if (showXiangQing) {
                        showXiangQing(data);
                    }
                } else {
                    if (NoCompanyLaryOut) {
                        NoCompanyLaryOut();
                    } else {
                        msg.alert('抱歉没有该公司的信息');
                    }
                }
            }, '', null);
        });
    } ());
});