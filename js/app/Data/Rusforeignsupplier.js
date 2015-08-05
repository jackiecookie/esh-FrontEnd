define(['js/common/verify/verify', 'js/app/Data/DataPlatformListCommjs', 'smartFocus'], function (require, exports, module) {
    var verify = require('js/common/verify/verify'),
        DataPlatformListCommjs = require('js/app/Data/DataPlatformListCommjs');
    require('smartFocus');
    function init() {
        (function () {
            $('#searchBtn,.button').click(function () {
                if (ckvalue()) {
                    var para = getPara();
                    var l = $('#level').val();
                    if (l) para += '&l=' + encodeURIComponent(l);
                    var fpm = $('#fpm').val();
                    if (fpm) para += '&fpm=' + encodeURIComponent(fpm);
                    location.href = '/Abroad/RusAbroad/List?' + para;
                }
            });
        })();
        (function () {
            DataPlatformListCommjs.orderFun(ckvalue);
            $('.scontent_a[_href]').click(function () {
                if (ckvalue()) {
                    var l = $(this).attr('levle');
                    if (l != '3') {
                        var href = $(this).attr('_href');
                        //                $('#pm').val();
                        var para = getPara($(this).text());
                        location.href = href + '&' + para;
                    } else {
                        var href = $(this).attr('_href');
                        var para = getPara($(this).text());
                        location.href = href + '&' + para + '&fpm=' + encodeURIComponent($(this).attr('parentName'));
                    }
                }
            });
            $('.back').click(function () {
                if (ckvalue()) {
                    var href = $(this).attr('_href');
                    var para = getPara($(this).attr('parentName'));
                    location.href = href + '&' + para;
                }
            });
            $('.yearSild').click(function () {
                if (ckvalue()) {
                    var href = $(this).attr('_href');
                    var para = getPara(null, $(this).attr('year'));
                    location.href = href + '&' + para;
                }
            });
        })();

    };


    var getPara = function (_pm, _year) {
        var para = new Array();
        var cName = $('#name').val();
        if (cName != '请输入企业名称') para.push('name=' + encodeURIComponent(cName));
        var wightTop = $('#wightTop').val();
        if ($.trim(wightTop) != '总重量起') para.push('wightTop=' + encodeURIComponent(wightTop));
        var wightCen = $('#wightCen').val();
        if ($.trim(wightCen) != '总重量止') para.push('wightCen=' + encodeURIComponent(wightCen));

        var bathTop = $('#moneyTop').val();
        if ($.trim(bathTop) != '总金额起') para.push('moneyTop=' + encodeURIComponent(bathTop));
        var bathCen = $('#moneyCen').val();
        if ($.trim(bathCen) != '总金额止') para.push('moneyCen=' + encodeURIComponent(bathCen));
        if (_pm) para.push('pm=' + encodeURIComponent(_pm));
        else {
            var pm = $('#pm').val();
            if (pm) para.push('pm=' + encodeURIComponent(pm));
        }
        var o1 = DataPlatformListCommjs.request('order');
        if (o1) para.push('order=' + encodeURIComponent(o1));
        var country = $('#conuntry').val();
        if (country) para.push('country=' + encodeURIComponent(country));
        if (_year) para.push('yearSid=' + encodeURIComponent(_year));
        else {
            var yearSid = $('#yearSid').val();
            if (yearSid) para.push('yearSid=' + encodeURIComponent(yearSid));
        }
        var xsdx = $('#XSDX').val();
        if (xsdx && $.trim(xsdx) != '销售对象') para.push('XSDX=' + encodeURIComponent(xsdx));
        return para.join('&');
    };

    var ckvalue = function () {
        var alertMsg = '请输入正确的批次';
        var alertMsgW = '请输入正确的重量';
        if ($('#wightTop').val() != '总重量起' && !verify.type.double($('#wightTop').val())) {
            {
                verify.showErroTip($("#wightTop"), alertMsgW);
                return false;
            }
        }
        if ($('#wightCen').val() != '总重量止' && !verify.type.double($('#wightCen').val())) {
            {
                verify.showErroTip($("#wightCen"), alertMsgW);
                return false;
            }
        }
        if ($('#moneyTop').val() != '总金额起' && !verify.type.double($('#moneyTop').val())) {
            {
                verify.showErroTip($("#moneyTop"), alertMsg);
                return false;
            }
        }
        if ($('#moneyCen').val() != '总金额止' && !verify.type.double($('#moneyCen').val())) {
            {
                verify.showErroTip($("#moneyCen"), alertMsg);
                return false;
            }
        }

        return true;
    };
    $(function () {
        (function initSmartFocus() {
            $('#wightTop').smartFocus('总重量起');
            $('#wightCen').smartFocus('总重量止');
            $('#moneyTop').smartFocus('总金额起');
            $('#moneyCen').smartFocus('总金额止');
            $('#name').smartFocus('请输入企业名称');
            $('#XSDX').smartFocus('销售对象');
        })();
        init();
        var yearSid = $('#yearSid').val();
        switch (yearSid) {
            case "0":
                $('#addList').append('<a href="javascript:void(0)">年份：2013年至今</a> ');
                $('.yearSild[year=0]').addClass('active');
                break;
            case "1":
                $('#addList').append('<a href="javascript:void(0)">年份：2010年-2012年</a>');
                $('.yearSild[year=1]').addClass('active');
                break;
            default:
        }
        var _node = $('.scontent_a[levle]');
        if (_node.attr('levle') == '4') {
            $('#buxian').remove();
            for (var i = 0; i < _node.length; i++) {
                var _jquetyNodel = $(_node[i]);
                var pm = $('#pm').val();
                if (_jquetyNodel.text() == pm) {
                    _jquetyNodel.unbind('click');
                    _jquetyNodel.addClass('active');
                } else {
                    _jquetyNodel.attr('_href', location.pathname + '?l=3');
                    _jquetyNodel.attr('levle', '3');
                }
            }
        }
    });
});



