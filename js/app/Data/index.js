define(['layer'], function (require, exports, module) {
    require('layer'); 
   // var loginInfo = require('headJs').loginInfo;
    var objForA, isAdjustForA, isAdjustForA2, objForA2;
    var Cleara, Clearb;
    var initInterval = {
        init: function () {
            Cleara = setInterval(this.numberZXPMD, 1900);
            Clearb = setInterval(this.changNumber, 1600);
        },
        numberZXPMD: function () {
            var CHNNumber = $('#CHNTotleMoney').text().replace('$', '').replace(/,/g, '');
            var _chn = parseInt(CHNNumber) + 1;
            if (_chn > 3500000000) clearInterval(Cleara);
            $('#CHNTotleMoney').text('$' + _chn.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        },
        changNumber: function () {
            var USANumber = $('#USATotleWeight').text().replace(/,/g, '');
            var _usa = parseInt(USANumber) + 1;
            if (_usa > 3500000000) clearInterval(Clearb);
            $('#USATotleWeight').text(_usa.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        }
    };

    var logn = function () {
        var islogin = $('#islogin').val();
        if (islogin == 'False') {
            var _href = $('.top1 a[href$="login.aspx"]').attr('href');
            $('.div_tt2 .imgpad').wrap('<a href=' + _href + '></a>');
            //$('<a href=' + _href + '></a>');
            //        $('.div_tt2 .imgpad').click(function () {
            //            window.location.href = $('.top1 a[href$="login.aspx"]').attr('href');
            //        });
        }
    };
    var showCountryDiv = function (isAdjust, obj) {
     
        objForA = obj;
        isAdjustForA = isAdjust;
        var map = $('#xfdiv1'), jqobj = $(obj);
        if (jqobj.parent().hasClass('nologin')) {
            showLoginTip();
            return false;
        }
        if (jqobj.parent().hasClass('btn_box_grey')) return false;
        $('#xfdiv2').hide();
        removeSlbClass(jqobj);
        if (jqobj.hasClass('active')) {
            jqobj.removeClass('active');
        } else {
            jqobj.addClass('active');
        }
        if (isAdjust) {
            map.css({
                marginLeft: '208px'
            });
        }
        map.slideToggle(200);
    };
    var showDiv2 = function (isAdjust, obj) {
        objForA2 = obj;
        isAdjustForA2 = isAdjust;
        var div2 = $('#xfdiv2'), jqobj = $(obj);
        if (jqobj.parent().hasClass('nologin')) {
            showLoginTip();
            return false;
        }
        if (jqobj.parent().hasClass('btn_box_grey')) return false;
        $('#xfdiv1').hide();
        removeSlbClass(jqobj);
        if (jqobj.hasClass('active')) {
            jqobj.removeClass('active');
        } else {
            jqobj.addClass('active');
        }
        if (isAdjust) {
            div2.css({
                marginLeft: '518px'
            });
        }
        div2.slideToggle(200);
        //if (div2.is(":hidden")) {
        //    div2.show();
        //} else {
        //    div2.hide();
        //}

    };
    var removeSlbClass = function (jqobj) {
        jqobj.siblings('a').removeClass('active');
    };

    var showLoginTip = function () {
        var loginBtn = $('#btn').nextAll('.lnk-login');
        layer.tips('请先登录以后在查看', loginBtn, {
            guide: 2,
            time: 1
        });
    };
    $(function () {
        logn();
        //增加三位小数点
        $('#CHNTotleMoney').text('$' + $('#CHNTotleMoney').text().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#USATotleWeight').text($('#USATotleWeight').text().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        var lastck = true;
        initInterval.init();
        $("#xfdiv1").mouseleave(function () {
//            if (!loginInfo.isLogin) {
//                showLoginTip();
//                return false;
//            }
            var map = $('#xfdiv1'), jqobj = $(objForA);
            if (jqobj.parent().hasClass('btn_box_grey')) return false;
            $('#xfdiv2').hide();
            removeSlbClass(jqobj);
            if (jqobj.hasClass('active')) {
                jqobj.removeClass('active');
            } else {
                jqobj.addClass('active');
            }
            if (isAdjustForA) {
                map.css({
                    marginLeft: '208px'
                });
            }
            map.slideToggle(200);
        });
        $("#xfdiv2").mouseleave(function () {
//            if (!loginInfo.isLogin) {
//                showLoginTip();
//                return false;
//            }
            var div2 = $('#xfdiv2'), jqobj = $(objForA2);
            if (jqobj.parent().hasClass('btn_box_grey')) return false;
            $('#xfdiv1').hide();
            removeSlbClass(jqobj);
            if (jqobj.hasClass('active')) {
                jqobj.removeClass('active');
            } else {
                jqobj.addClass('active');
            }
            if (isAdjustForA2) {
                div2.css({
                    marginLeft: '518px'
                });
            }
            div2.slideToggle(200);
        });
    });
    module.exports.showCountryDiv = showCountryDiv;
    module.exports.showDiv2 = showDiv2;
});


