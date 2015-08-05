define(['js/common/verify/verify', 'js/app/Data/DataPlatformListCommjs', 'smartFocus'], function (require, exports, module) {
    var verify = require('js/common/verify/verify'),
        DataPlatformListCommjs = require('js/app/Data/DataPlatformListCommjs');
    require('smartFocus');
    var returnPara = function (l) {
        var para = new Array(), level;
        if (!l && l != 0) {
            level = $('#level').val();
            if (!level) level = 1;
        }
        else
            level = l;
        para.push('level=' + encodeURIComponent(level));
        //    var year = $('#year').text();
        //        if ($.trim(year) && (year != '全部' && year != '选择年份')) para.push('year=' + encodeURIComponent(year));
        //        var isComeFromCN = $('[name=rCN]:checked').val();
        //        if ($.trim(isComeFromCN)) para.push('iN=' + encodeURIComponent(isComeFromCN));
        var year = $('#year').val();
        if ($.trim(year)) para.push('year=' + encodeURIComponent(year));
        var o1 = DataPlatformListCommjs.request('order');
        if ($.trim(o1)) para.push('order=' + encodeURIComponent(o1));


        //        var moneyTop = $('#moneyTop').val();
        //        if ($.trim(moneyTop) != '总金额起') para.push('moneyTop=' + encodeURIComponent(moneyTop));
        //        var moneyCen = $('#moneyCen').val();
        //        if ($.trim(moneyCen) != '总金额止') para.push('moneyCen=' + encodeURIComponent(moneyCen));

        //        var wightTop = $('#wightTop').val();
        //        if ($.trim(wightTop) != '总重量起') para.push('wightTop=' + encodeURIComponent(wightTop));
        //        var wightCen = $('#wightCen').val();
        //        if ($.trim(wightCen) != '总重量止') para.push('wightCen=' + encodeURIComponent(wightCen));
        return para.join('&');
        //return 'order=' + o1 + '&iN=' + isComeFromCN + '&year=' + encodeURIComponent(year) + '&level=' + encodeURIComponent(level);

    };
    var tiaozhuan = function (l, pm) {

        var para = returnPara(l);
        if (pm) {
            pm = $.trim(pm).replace('产品名称：', '');
        }
        else pm = '';
        var otherPara = '';
        switch (l) {
            case '1':
                otherPara += '&fpm=' + encodeURIComponent(pm);
                break;
            case '2':
                var _pmNode = $('.result_bar_1 span');
                var _pm;
                if (_pmNode.length > 1) {
                    _pm = $(_pmNode[0]).text();
                    pm = $(_pmNode[1]).text();
                } else {
                    _pm = $(_pmNode[0]).text();
                };
                _pm = $.trim(_pm).replace('产品名称：', '');
                pm = $.trim(pm).replace('产品名称：', '');
                otherPara += '&fpm=' + encodeURIComponent(_pm);
                break;
            case '3':
                var _pm, fpm;
                var _pmNode = $('.result_bar_1 span');
                if (_pmNode.length == 1) {
                    _pm = _pmNode.text();
                    fpm = $('.result_bar_1 .jj').text();
                } else if (_pmNode.length > 1) {
                    _pm = $(_pmNode[0]).text();
                    fpm = $(_pmNode[1]).text();
                }
                _pm = $.trim(_pm).replace('产品名称：', '');
                fpm = $.trim(fpm).replace('产品名称：', '');
                otherPara += '&fpm=' + encodeURIComponent(_pm + '_' + fpm);
                break;
            case '0':
                pm = '';
                break;
        } //location.host + 
        location.href = location.pathname + '?' + para + '&pm=' + encodeURIComponent(pm) + otherPara;
    };
    function init() {
        (function () {
            var nodeElm = {};
            var _currentYear = DataPlatformListCommjs.request('year');
            if (_currentYear) $('#year').text(_currentYear);
            $('#searchBtn,.button').click(function () {
                if (ckvalue()) {
                    var l = $('#level').val();
                    var currentPM = $('.result_bar_1 .jj').text();
                    var pm;
                    if (!currentPM) {
                        pm = $('.result_bar_1 span').text();
                    } else pm = currentPM;
                    if (!pm) pm = '';
                    if (!pm) l = 0;
                    tiaozhuan(l, pm);
                }
            });
            var scontent_a = $('.scontent_a[levle]');
            for (var i = 0, len = scontent_a.length; i < len; i++) {
                var $elm = $(scontent_a[i]);
                nodeElm[$elm.text()] = $elm;
            }
            scontent_a.click(function () {
                if (ckvalue()) {
                    var l = $(this).attr('levle');
                    //    $('#level').val(l);
                    var pm = $(this).text();
                    tiaozhuan(l, pm);
                }
            });
            $('#back').click(function () {
                if (ckvalue()) {
                    var l = $('#level').val();
                    l = parseInt(l) - 1;
                    var pm = $('.result_bar_1 span').text();
                    tiaozhuan(l.toString(), pm);
                }
            });
            var elmNode = $('.findClass');
            if (elmNode.length > 1) {
                elmNode.click(function () {
                    var thText = $.trim($(this).text());
                    if (nodeElm[thText])
                        nodeElm[thText].click();
                });
            } else {
                elmNode.parent().addClass('tracud');
            }

        })();
        DataPlatformListCommjs.orderFun(ckvalue);

    };

    var ckvalue = function () {
        return true;
        //        var alertMsg = '请输入正确的金额';
        //        var alertMsgW = '请输入正确的重量';
        //        if ($('#wightTop').val() != '总重量起' && !verify.type.double($('#wightTop').val())) {
        //            {
        //                verify.showErroTip($("#wightTop"), alertMsgW);
        //                return false;
        //            }
        //        }
        //        if ($('#wightCen').val() != '总重量止' && !verify.type.double($('#wightCen').val())) {
        //            {
        //                verify.showErroTip($("#wightCen"), alertMsgW);
        //                return false;
        //            }
        //        }
        //        if ($('#moneyTop').val() != '总金额起' && !verify.type.double($('#moneyTop').val())) {
        //            {
        //                verify.showErroTip($("#moneyTop"), alertMsg);
        //                return false;
        //            }
        //        }
        //        if ($('#moneyCen').val() != '总金额止' && !verify.type.double($('#moneyCen').val())) {
        //            {
        //                verify.showErroTip($("#moneyCen"), alertMsg);
        //                return false;
        //            }
        //        }

        //        return true;
    };

    //    (function ($) {
    //        var $cate = $('#cate'),
    //      $tri = $('.cate_tri', $cate),
    //      $drop = $('div.cate_drop', $cate),
    //      $inp = $('div.cate_inp', $cate);

    //        $tri.on('click', function (event) {
    //            var $el = $(this);
    //            if ($el.data('active') !== 'on') {
    //                $drop[0].style.display = 'block';
    //                $el.data('active', 'on');
    //            } else {
    //                $drop[0].style.display = 'none';
    //                $el.data('active', 'off');
    //            }
    //        });

    //        $drop.on('mouseover', 'li', function (event) {
    //            $inp[0].innerHTML = this.innerHTML;
    //        }).on('click', 'li', function (event) {
    //            $drop[0].style.display = 'none';
    //            $tri.data('active', 'off');
    //        });
    //    } (jQuery));
    $(function () {
        //        (function initSmartFocus() {
        //            $('#wightTop').smartFocus('总重量起');
        //            $('#wightCen').smartFocus('总重量止');
        //            $('#moneyTop').smartFocus('总金额起');
        //            $('#moneyCen').smartFocus('总金额止');
        //        })();
        //        var iscn = $('#isComeFromCN').val();
        //        $('[name=rCN][value=' + iscn + ']').attr('checked', 'checked');
        //        var isfcn = $('#isFormCHN').val();
        //        if (isfcn)
        //            $('[name=rCN][value=' + isfcn + ']').attr('checked', 'checked');
        init();
        var _3node = $('.result_bar_1 .jj').text();  //表示有三级节点
        //var nodelenght = $('.result_bar_1 span').length;
        if (_3node) {
            var _node = $('#starlist2 .scontent_a');
            $('.lf .current').remove();
            for (var i = 0; i < _node.length; i++) {
                var _jquetyNodel = $(_node[i]);
                if ($.trim(_jquetyNodel.text()) == _3node) {
                    _jquetyNodel.unbind('click');
                    _jquetyNodel.addClass('active');
                } else {
                    _jquetyNodel.attr('level', 3);
                }
            }
        }
    });
});


