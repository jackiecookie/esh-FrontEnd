define(['autocomplete', 'js/common/verify/verify', 'js/app/Data/DataPlatformListCommjs', 'jquery', 'smartFocus'], function (require, exports, module) {
    var verify = require('js/common/verify/verify'),
        DataPlatformListCommjs = require('js/app/Data/DataPlatformListCommjs');
    require('autocomplete');
    require('jquery');
    require('smartFocus');
    (function initSmartFocus() {
        $('#stmoney').smartFocus('总金额起');
        $('#endmoney').smartFocus('总金额止');
        $('#bathTop').smartFocus('总批次起');
        $('#bathCen').smartFocus('总批次止');
        $('#avgPriceTop').smartFocus('平均价起');
        $('#avgPriceCen').smartFocus('平均价止');
        $('#minPriceTop').smartFocus('最低价起');
        $('#minPriceCen').smartFocus('最低价止');
        $('#name').smartFocus('请输入企业名称');
        $('#area').smartFocus('销往国家');
    })();
    function init() {
        (function () {
            $('#searchBtn,.button').click(function () {
                if (ckvalue()) {
                    var para = getPara();
                    var l = $('#level').val();
                    if (!l) l = '';
                    var fpm = $('#fpm').val();
                    if (fpm) para += '&fpm=' + fpm;
                    location.href = '/china/List?' + para + '&l=' + encodeURIComponent(l);
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
                        //     $('#pm').val();
                        var para = getPara($(this).text());
                        location.href = href + '&' + para;
                    } else {
                        var href = $(this).attr('_href');
                        var para = getPara($(this).text());
                        location.href = href + '&' + para + '&fpm=' + $(this).attr('parentName');
                    }
                }
            });
            $('.yearSild').click(function () {
                if (ckvalue()) {
                    var href = $(this).attr('_href');
                    //   $('#pm').val('');
                    var para = getPara('', $(this).attr('year'));
                    location.href = href + '&' + para;
                }
            });
            $('.back').click(function () {
                if (ckvalue()) {
                    var href = $(this).attr('_href');
                    var para = getPara($(this).attr('parentName'));
                    location.href = href + '&' + para;
                }
            });
        })();
    };
    var initCountry = function () {
        var data = $('#_country').val().split(',');
        $('#area').AutoComplete({
            'data': data,
            'width': 'auto'
        });

    };

    var getPara = function (_pm, _year) {
        var para = new Array();
        var yearSid = $('#yearSid').val();
        if (_year) yearSid = _year;
        para.push('yearSid=' + encodeURIComponent(yearSid));
        var cName = $('#name').val();
        if ($.trim(cName) != '请输入企业名称') para.push('name=' + encodeURIComponent(cName));
        var pm;
        if (!_pm) {
            pm = $('#pm').val();
            if (!$.trim(pm)) pm = '';
        } else {
            pm = _pm;
        }
        if ($.trim(pm)) para.push('pm=' + encodeURIComponent($.trim(pm)));
        var o1 = DataPlatformListCommjs.request('order');
        if ($.trim(o1)) {
            para.push('order=' + encodeURIComponent(o1));
        }
        var area = $('#area').val();
        if ($.trim(area) && $.trim(area) != '销往国家') para.push('area=' + encodeURIComponent(area));
        var stmoney = $('#stmoney').val();
        var endmoney = $('#endmoney').val();
        if (stmoney && stmoney != '总金额起') para.push('stmoney=' + encodeURIComponent(stmoney));
        if (endmoney && endmoney != '总金额止') para.push('endmoney=' + encodeURIComponent(endmoney));
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
        var bathTop = $('#bathTop').val();
        var bathCen = $('#bathCen').val();
        if (bathTop != '总批次起') para.push('bathTop=' + encodeURIComponent(bathTop));
        if (bathCen != '总批次止') para.push('bathCen=' + encodeURIComponent(bathCen));
        return para.join('&');
    };
//    var getPara = function (_pm, _year) {
//     return   GetUrlPara.GetUrlPara({
//            'yearSid': _year||$('#yearSid'),
//            'pm': _pm || $('#pm'),
//            'order':DataPlatformListCommjs.request('order'),
//            'area': $('#area'),
//            'stmoney': $('#stmoney'),
//            'endmoney': $('#endmoney'),
//            'avgPriceTop': $('#avgPriceTop'),
//            'avgPriceCen': $('#avgPriceCen'),
//            'minPriceTop': $('#minPriceTop'),
//            'minPriceCen': $('#minPriceCen'),
//            'bathTop': $('#bathTop'),
//            'bathCen': $('#bathCen'),
//            'name': $('#name')
//        });

//    };


    var ckvalue = function () {
        var alertMsg = '请输入正确的金额';
        var alertMsg1 = '请输入正确的批次';
        if ($('#stmoney').val() != '总金额起' && !verify.type.double($('#stmoney').val())) {
            {
                verify.showErroTip($("#stmoney"), alertMsg);
                return false;
            }
        }
        if ($('#endmoney').val() != '总金额止' && !verify.type.double($('#endmoney').val())) {
            {
                verify.showErroTip($("#endmoney"), alertMsg);
                return false;
            }
        }
        if ($('#bathTop').val() != '总批次起' && !verify.type.double($('#bathTop').val())) {
            {
                verify.showErroTip($("#bathTop"), alertMsg1);
                return false;
            }
        }
        if ($('#bathCen').val() != '总批次止' && !verify.type.double($('#bathCen').val())) {
            {
                verify.showErroTip($("#bathCen"), alertMsg1);
                return false;
            }
        }
        if ($('#avgPriceTop')[0] && $('#avgPriceTop').val() != '平均价起' && !verify.type.double($('#avgPriceTop').val())) {
            {
                verify.showErroTip($("#avgPriceTop"), alertMsg); return false;
            }
        }
        if ($('#avgPriceCen')[0] && $('#avgPriceCen').val() != '平均价止' && !verify.type.double($('#avgPriceCen').val())) {
            {
                verify.showErroTip($("#avgPriceCen"), alertMsg); return false;
            }
        }
        if ($('#minPriceTop')[0] && $('#minPriceTop').val() != '最低价起' && !verify.type.double($('#minPriceTop').val())) {
            {
                verify.showErroTip($("#minPriceTop"), alertMsg); return false;
            }
        }
        if ($('#minPriceCen')[0] && $('#minPriceCen').val() != '最低价止' && !verify.type.double($('#minPriceCen').val())) {
            {
                verify.showErroTip($("#minPriceCen"), alertMsg); return false;
            }
        }
        return true;
    };
    $(function () {
        var senfeTable = $('#senfe');
        var senfeTr = senfeTable.find('tr:eq(0)');
        if (senfeTr.height() > 37) {
            senfeTable.attr('width', '120%');
        }
        init();
        //   showPM('#PM', 'CHN');
        initCountry();
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
                if ($.trim(_jquetyNodel.text()) == $.trim(pm)) {
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


