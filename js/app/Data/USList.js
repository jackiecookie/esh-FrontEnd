

define(['js/common/verify/verify', 'js/app/Data/DataPlatformListCommjs', 'smartFocus'], function (require, exports, module) {
    var verify = require('js/common/verify/verify'),
        DataPlatformListCommjs = require('js/app/Data/DataPlatformListCommjs');
    require('smartFocus');
    function initList() {
     
        (function () {
            $('#searchBtn,.button').click(function () {
                if (ckvalue()) {
                    var para = getPara();
                    var l = $('#level').val();
                    if (l) para += '&l=' + encodeURIComponent(l);
                    var fpm = $('#fpm').val();
                    if (fpm) para += '&fpm=' + encodeURIComponent(fpm);
                    location.href = '/USA/List?' + para;
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
                    var para = getPara('', $(this).attr('year'));
                    location.href = href + '&' + para;
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
        if ($.trim(cName) != '请输入企业名称') para.push('name=' + encodeURIComponent(cName));
        var wightTop = $('#wightTop').val();
        if ($.trim(wightTop) != '总重量起') para.push('wightTop=' + encodeURIComponent(wightTop));
        var wightCen = $('#wightCen').val();
        if ($.trim(wightCen) != '总重量止') para.push('wightCen=' + encodeURIComponent(wightCen));

        var bathTop = $('#bathTop').val();
        if ($.trim(bathTop) != '总批次起') para.push('bathTop=' + encodeURIComponent(bathTop));
        var bathCen = $('#bathCen').val();
        if ($.trim(bathCen) != '总批次止') para.push('bathCen=' + encodeURIComponent(bathCen));

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
        if ($('#bathTop').val() != '总批次起' && !verify.type.double($('#bathTop').val())) {
            {
                verify.showErroTip($("#bathTop"), alertMsg);
                return false;
            }
        }
        if ($('#bathCen').val() != '总批次止' && !verify.type.double($('#bathCen').val())) {
            {
                verify.showErroTip($("#bathCen"), alertMsg);
                return false;
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

