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
                    if (!l) l = '';
                    var fpm = $('#fpm').val();
                    if (fpm) para += '&fpm=' + encodeURIComponent(fpm);
                    var country = $('#country').val();
                    location.href = '/SA/' + country + '/List?' + para + '&l=' + encodeURIComponent(l);
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
                        var para = getPara($(this).text());
                        location.href = href + '&' + para;
                    } else {
                        var href = $(this).attr('_href');
                        var para = getPara($(this).text());

                        location.href = href + '&' + para + '&fpm=' + $(this).attr('parentName');
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
            $('[name=rCN]').click(function () {
                if (ckvalue()) {
                    var l = $('#level').val();
                    var para = getPara();
                    var fpm = $('#fpm').val();
                    if (fpm) para += '&fpm=' + fpm;
                    location.href = location.pathname + '?l=' + encodeURIComponent(l) + '&' + para;
                } else {
                    return false;
                }
            });
        })();
    };






    var getPara = function (_pm) {
        var para = new Array();
        var cName = $('#name').val();
        if ($.trim(cName) != '请输入企业名称') para.push('name=' + encodeURIComponent(cName));
        var moneyTop = $('#moneyTop').val();
        if ($.trim(moneyTop) != '总金额起') para.push('moneyTop=' + encodeURIComponent(moneyTop));
        var moneyCen = $('#moneyCen').val();
        if ($.trim(moneyCen) != '总金额止') para.push('moneyCen=' + encodeURIComponent(moneyCen));

        var wightTop = $('#wightTop').val();
        if ($.trim(wightTop) != '总重量起') para.push('wightTop=' + encodeURIComponent(wightTop));
        var wightCen = $('#wightCen').val();
        if ($.trim(wightCen) != '总重量止') para.push('wightCen=' + encodeURIComponent(wightCen));
        if (!_pm) {
            var pm = $('#pm').val();
            if ($.trim(pm)) para.push('pm=' + encodeURIComponent(pm));
        } else {
            para.push('pm=' + encodeURIComponent(_pm));
        }
        var o1 = DataPlatformListCommjs.request('order');
        if ($.trim(o1)) para.push('order=' + encodeURIComponent(o1));
        var year = $('#year').val();
        if (year && year != '0') para.push('year=' + encodeURIComponent(year));
        var isComeFromCN = $('[name=rCN]:checked').val();
        if ($.trim(isComeFromCN)) para.push('iN=' + encodeURIComponent(isComeFromCN));
        return para.join('&');
    };
    var ckvalue = function () {
        var alertMsg = '请输入正确的金额';
        var alertMsgW = '请输入正确的重量';
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

        return true;
    };
    $(function () {
        (function initSmartFocus() {
            $('#wightTop').smartFocus('总重量起');
            $('#wightCen').smartFocus('总重量止');
            $('#moneyTop').smartFocus('总金额起');
            $('#moneyCen').smartFocus('总金额止');
            $('#name').smartFocus('请输入企业名称');
        })();
        init();
        $('[name=rCN][value=' + $('#isComeFromCN').val() + ']').attr('checked', 'checked');
        var _year = $('#_year').val();
        if (_year)
            $('#year').val(_year);
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

