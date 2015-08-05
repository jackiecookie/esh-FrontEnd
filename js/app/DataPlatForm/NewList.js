define(['js/common/verify/verify', 'js/app/Data/DataPlatformListCommjs', 'smartFocus', 'customSelect'], function (require, exports, module) {
    var verify = require('js/common/verify/verify'),
        DataPlatformListCommjs = require('js/app/Data/DataPlatformListCommjs');
    require('smartFocus');
    function initList() {
        var province = $('#province');
    if (province[0]) {
        require('customSelect');
        province.customSelect({
            padding: '4.5px'
        });
        province.css({
            height: '31px'
        });
    }
        (function () {
            $('#searchBtn,.button').click(function () {
                if (ckvalue()) {
                    var para = getPara();
                    var l = $('#level').val();
                    if (l) para += '&l=' + encodeURIComponent(l);
                    var fpm = $('#fpm').val();
                    if (fpm) para += '&fpm=' + encodeURIComponent(fpm);
                    location.href = location.pathname +'?' +para;
                }
            });
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
                    //  $('#pm').val('');
                   // var para = getPara('', $(this).attr('year'));
                    location.href = href + '&' + 'yearSid=' + encodeURIComponent($(this).attr('year'));
                }
            });
            $('[name=rCN]').click(function () {
                if (ckvalue()) {
                    var l = $('#level').val();
                    var para = getPara();
                    var fpm = $('#fpm').val();
                    if (fpm) para += '&fpm=' + encodeURIComponent(fpm);
                    location.href = location.pathname + '?l=' + encodeURIComponent(l) + '&' + para;
                } else {
                    return false;
                }
            });
        })();
        DataPlatformListCommjs.orderFun(ckvalue);


    };

    //获取url中的参数


    var getPara = function (_pm, _year, isJosn) {
        var para = new Array();
        if (_year) para.push('yearSid=' + encodeURIComponent(_year));
        else {
            var yearSid = $('#yearSid').val();
            if (yearSid) para.push('yearSid=' + encodeURIComponent(yearSid));
        }
        var cName = $('#name').val();
        if (cName&&$.trim(cName) != '请输入企业名称') para.push('name=' + encodeURIComponent(cName));
        var wightTop = $('#wightTop').val();
        if (wightTop&&$.trim(wightTop) != '总重量起') para.push('wightTop=' + encodeURIComponent(wightTop));
        var wightCen = $('#wightCen').val();
        if (wightCen&&$.trim(wightCen) != '总重量止') para.push('wightCen=' + encodeURIComponent(wightCen));
        var moneyTop = $('#moneyTop').val();
        if (moneyTop&&$.trim(moneyTop) != '总金额起') para.push('moneyTop=' + encodeURIComponent(moneyTop));
        var moneyCen = $('#moneyCen').val();
        if (moneyCen&&$.trim(moneyCen) != '总金额止') para.push('moneyCen=' + encodeURIComponent(moneyCen));

        var bathTop = $('#bathTop').val();
        if (bathTop&&$.trim(bathTop) != '总批次起') para.push('bathTop=' + encodeURIComponent(bathTop));
        var bathCen = $('#bathCen').val();
        if (bathCen&&$.trim(bathCen) != '总批次止') para.push('bathCen=' + encodeURIComponent(bathCen));
        if ($('#avgPriceTop')) {
            var avgPriceTop = $('#avgPriceTop').val();
            var avgPriceCen = $('#avgPriceCen').val();
            if (avgPriceTop && avgPriceTop != '平均价起') para.push('avgPriceTop=' + encodeURIComponent(avgPriceTop));
            if (avgPriceCen && avgPriceCen != '平均价止') para.push('avgPriceCen=' + encodeURIComponent(avgPriceCen));
            var minPriceTop = $('#minPriceTop').val();
            var minPriceCen = $('#minPriceCen').val();
            if (minPriceTop && minPriceTop != '最低价起') para.push('minPriceTop=' + encodeURIComponent(minPriceTop));
            if (minPriceCen && minPriceCen != '最低价止') para.push('minPriceCen=' + encodeURIComponent(minPriceCen));
        }

        var jsTop = $('#jsTop').val();
        var jsCen = $('#jsCen').val();
        if (jsTop && jsTop != '总数量起') para.push('jsTop=' + encodeURIComponent(jsTop));
        if (jsCen && jsCen != '总数量止') para.push('jsCen=' + encodeURIComponent(jsCen));


        var isComeFromCN = $('[name=rCN]:checked').val();
        if ($.trim(isComeFromCN)) para.push('iN=' + encodeURIComponent(isComeFromCN));
        var pm;
        if (_pm) {
            para.push('pm=' + encodeURIComponent(_pm));
        }
        else {
            pm = $('#pm').val();
            if ($.trim(pm)) para.push('pm=' + encodeURIComponent(pm));
        }
        var o1 = DataPlatformListCommjs.request('order');
        if ($.trim(o1)) para.push('order=' + encodeURIComponent(o1));
        var province = $('#province').val();
        if (province && $.trim(province) && '选择省份' != $.trim(province)) para.push('province=' + encodeURIComponent(province));
        return para.join('&');

    };

    var ckvalue = function () {
        var alertMsg = '请输入正确的批次';
        var alertMsgW = '请输入正确的重量';
        var alertMsgM = '请输入正确的金额';
        var alertMsgJ = '请输入正确的数量';

        if ($('#avgPriceTop')[0] && $('#avgPriceTop').val() != '平均价起' && !verify.type.double($('#avgPriceTop').val())) {
            {
                verify.showErroTip($("#avgPriceTop"), alertMsgM); return false;
            }
        }
        if ($('#avgPriceCen')[0] && $('#avgPriceCen').val() != '平均价止' && !verify.type.double($('#avgPriceCen').val())) {
            {
                verify.showErroTip($("#avgPriceCen"), alertMsgM); return false;
            }
        }
        if ($('#minPriceTop')[0] && $('#minPriceTop').val() != '最低价起' && !verify.type.double($('#minPriceTop').val())) {
            {
                verify.showErroTip($("#minPriceTop"), alertMsgM); return false;
            }
        }
        if ($('#minPriceCen')[0] && $('#minPriceCen').val() != '最低价止' && !verify.type.double($('#minPriceCen').val())) {
            {
                verify.showErroTip($("#minPriceCen"), alertMsgM); return false;
            }
        }
        if ($('#moneyTop').val()&&$('#moneyTop').val() != '总金额起' && !verify.type.double($('#moneyTop').val())) {
            {
                verify.showErroTip($("#moneyTop"), alertMsgM);
                return false;
            }
        }
        if ($('#moneyCen').val() && $('#moneyCen').val() != '总金额止' && !verify.type.double($('#moneyCen').val())) {
            {
                verify.showErroTip($("#moneyCen"), alertMsgM);
                return false;
            }
        }
        if ($('#wightTop').val() && $('#wightTop').val() != '总重量起' && !verify.type.double($('#wightTop').val())) {
            {
                verify.showErroTip($("#wightTop"), alertMsgW);
                return false;
            }
        }
        if ($('#wightCen').val() && $('#wightCen').val() != '总重量止' && !verify.type.double($('#wightCen').val())) {
            {
                verify.showErroTip($("#wightCen"), alertMsgW);
                return false;
            }
        }
        if ($('#bathTop').val() && $('#bathTop').val() != '总批次起' && !verify.type.double($('#bathTop').val())) {
            {
                verify.showErroTip($("#bathTop"), alertMsg);
                return false;
            }
        }
        if ($('#bathCen').val() && $('#bathCen').val() != '总批次止' && !verify.type.double($('#bathCen').val())) {
            {
                verify.showErroTip($("#bathCen"), alertMsg);
                return false;
            }
        }
        if ($('#jsTop')[0] && $('#jsTop').val() != '总数量起' && !verify.type.double($('#jsTop').val())) {
            {
                verify.showErroTip($("#jsTop"), alertMsgJ); return false;
            }
        }
        if ($('#jsCen')[0] && $('#jsCen').val() != '总数量止' && !verify.type.double($('#jsCen').val())) {
            {
                verify.showErroTip($("#jsCen"), alertMsgJ); return false;
            }
        }


        return true;
    };
    $(function () {
        (function initSmartFocus() {
            $('#wightTop').smartFocus('总重量起');
            $('#wightCen').smartFocus('总重量止');
            $('#bathTop').smartFocus('总批次起');
            $('#bathCen').smartFocus('总批次止');
            $('#name').smartFocus('请输入企业名称');
            $('#moneyTop').smartFocus('总金额起');
            $('#moneyCen').smartFocus('总金额止');
            $('#avgPriceTop').smartFocus('平均价起');
            $('#avgPriceCen').smartFocus('平均价止');
            $('#minPriceTop').smartFocus('最低价起');
            $('#minPriceCen').smartFocus('最低价止');
            $('#jsTop').smartFocus('总数量起');
            $('#jsCen').smartFocus('总数量止');
        })();
        var iscn = $('#isComeFromCN').val();
        $('[name=rCN][value=' + iscn + ']').attr('checked', 'checked');
        var isfcn = $('#isFormCHN').val();
        if (isfcn)
            $('[name=rCN][value=' + isfcn + ']').attr('checked', 'checked');
        initList();
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

