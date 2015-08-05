define(function (require, exports, module) {
    $(window).unload(function (e,a) {
        $.post('/Member/ashx/memberloginout.ashx', { action: 'loginOut' });
        return false;
    });
    var createParam = require('jQueryAjax').createParam;
    var alertify = require('alertify');
    $(function () {
        $("#bt_pay").click(function () {
            $.ajaxjson("/Member/ashx/Acount/VipPay.ashx", createParam('vipay'), function (d) {
                if (d.Success) {
                    window.location.reload();
                } else {
                    if (d.Data == 3) {
                       alertify. rechang();
                    }
                    else if (d.Data == -1) {
                        location.href = '/login/Login';
                    }
                    else
                        msg.error(d.Message);
                }
            }, { Message: "正在提交,请稍后...", LoadingType: 2, IsShowLoading: true });
        });
    });
});


