define(['jQueryAjax', 'jquery', 'js/common/verify/verify'], function (require, exports, module) {
    var verify = require('js/common/verify/verify'),
        loginGourl = "";
    require('jQueryAjax');
    $(function () {
        $("#btlogin").click(function () {
            logincall(); return false;
        });
        $("#cdimg").click(function () {
            $('#cdimg').attr('src', "/validateCode.hxl?t=4&n=" + new Date().getTime().toString()); return false;
        });
        $('#cdimg').attr('src', "/validateCode.hxl?t=4&n=" + new Date().getTime().toString());
        loginGourl = $('#RedirectStr').val();
    });
    $(this).keydown(function (event) {
        if (event.keyCode == 13) {
            event.returnValue = false;
            event.cancel = true;
            return logincall();
        }
    });

    function loginsucess(url) {
        if (loginGourl != "" && loginGourl.indexOf(window.location.hostname.split('.')[1]) > -1)
            window.location = loginGourl;
        //    else if (url != "" &&(url.indexOf("http://")==-1||url.indexOf(window.location.hostname) > -1))
        //        window.location = url;
        else if (document.referrer != "" && (document.referrer.indexOf("Registered") < 0 && document.referrer.indexOf("Company") < 0 && document.referrer.indexOf("Login") < 0))
            window.location = document.referrer;
        else window.location = "/Index";
    }

    function logincall() {
        var _this = $("#btlogin");
        if (!$("#username").val()) {
            verify.fn.errortips(
                    $("#username"),
                    $("#username").parent(),
                    '请输入帐号', 'userName'
                );
            return false;
        }

        if (!$("#password").val()) {
            verify.fn.errortips(
                    $("#password"),
                    $("#password").parent(),
                    '请输入密码', 'passWord'
                );
            return false;
        }

        if (!$("#cd").val()) {
            verify.fn.errortips(
                    $("#cd"),
                    $("#cd").parent(),
                    '请输入验证码', 'cd'
                );
            return false;
        }

        if (_this.hasClass('ajaxing')) {
            return false;
        }
        _this.addClass('ajaxing');
        _this.html('正在登录....');
        $.ajaxjson("/Member/ashx/memberlogin.ashx", { n: $("#username").val(), p: $("#password").val(), c: $("#cd").val(), r: $("#rem").attr("checked") }, function (d) {
            _this.removeClass('ajaxing');
            _this.html('登录');
            if (d.Success) {
                loginsucess(d.Data);
            }
            else {
                if (d.Message) msg.alert(d.Message);
                else
                    msg.alert(d.MEMBER_ID);
                $("#cdimg").attr("src", "/validateCode.hxl?t=4&n=" + new Date().getTime().toString());

            }

        }, { Message: "正在登录,请稍后...", LoadingType: 2, IsShowLoading: false });
    }

});

