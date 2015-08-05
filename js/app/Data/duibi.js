define(['tools', 'alertify'], function (require, exports, module) {
    var cookieHelp = require('tools').cookieHelp;
    var alertify = require('alertify');
    

    var setDataUl = function (cn) {
        var len = 12;
        var cnname = cn.length > len ? cn.substr(0, len) + '...' : cn;
        $('#bdul').append('<li><div class="lf"><a  style=" color:Black" href="javascript:void(0)" title="' + cn + '">' + cnname + '<a></div><div class="rg"><a href="javascript:void(0)" class="rn"><img src="/Static/Images/DataImg/trade_27.jpg" width="7" height="7"></a></div><div class="clear"></div></li>'); //加入到比对列表当中
    };
    var bindRemoveClick = function () {
        var ck = $('#comparisonDataCookieKey').val();
        $('.rn').unbind('click');
        $('.rn').click(function () {
            var cn = $(this).parent().prev().find('a').attr('title');
            var _regex = new RegExp("[|]{2}", "g");
            var _reg = new RegExp("[|]$|^[|]", "g");
            var _cn = cookieHelp.GetCookie(ck);
            _cn = _cn.replace(cn, '');
            _cn = _cn.replace(_regex, '|');
            _cn = _cn.replace(_reg, '');
            setCookie(ck, _cn, true);
            $(this).parent().parent().remove();
        });
    };
    //写cookies
    function setCookie(name, value, isFG) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        if (!isFG) {
            var _value = cookieHelp.GetCookie(name);
            if (_value) {
                if (_value.split('|').length >= 6) return 1;   //目前最大个数为6个 超过6个返回1 提示用户
                if (_value.indexOf(value) > -1) return 2;   //相同公司不能添加两次
                if (_value) value += '|' + _value;
            }
        }
        //这里没有对公司名称进行编码,原因是在一些外文在编码之后出现了歧义
        document.cookie = name + "=" + value + ";expires=" + exp.toGMTString() + ";Path=/";
        return 0;
    }
    $(function () {
        var divCen = $('.div_cen');
        var ck = $('#comparisonDataCookieKey').val();
        var cn = cookieHelp.GetCookie(ck);
        if (cn) {
            divCen.show();
            var cns = cn.split('|');
            for (var i = 0; i < cns.length; i++) {
                if (cns[i]) {
                    setDataUl(cns[i]);
                }
            }
            bindRemoveClick();
        } else {
            divCen.hide();
        }
        (function () {
            //     divCen.bindDrag($('.div_cen1'));
            $('#gdb').click(function () {
                var data = cookieHelp.GetCookie(ck);
                if (!data) {
                    alertify.alert('您没有添加公司到对比列表');
                    return false;
                }
            });
            $('#closeDB').click(function () {
                divCen.hide();
            });
            $('.sjbd').click(function () {
                divCen.show();
                var cn = $('#company').val();
                if (!cn) {
                    cn = $(this).parent().prevAll('.td_flag').find('a').text();  //获得公司名称
                }
                //写入cookie
                cn = cn.replace(/(^\s*)|(\s*$)/g, "");
                var isOK = setCookie(ck, cn);
                switch (isOK) {
                    case 0:
                        setDataUl(cn);
                        bindRemoveClick();
                        break;
                    case 2:
                        alertify.alert('您已添加该公司到对比页面');
                        break;
                    case 1:
                        alertify.alert('已经有6个公司添加到对比页面中');
                }
            });
        } ());
        $('#removeBDData').click(function () {
            cookieHelp.DeleteCookie(ck);
            $('#bdul').html('');
            divCen.hide();
        });
    });
});



