/////////////////////////////////////////////////关注js///////////////////////////////////////////////
define(function (require, exports, module) {
    var ZDK = require('js/common/procopy/procopy');
    ZDK.btnLoading = require('btnLoading');
    require('jQueryAjax');
    var headJs = require('headJs');
    $(function () {
        $("a[name='Attention']").click(function () {
            Attention($(this));
            //关注，粉丝页面
            var followers = $("#followa");
            if (followers != undefined && followers.length > 0) {
                var isMing = $("input[data-Type='isMine']").val();
                if (isMing == "0") {
                    var dataType = $(this).attr("data-typeid");
                    var value = $("#followa strong").text().trim();
                    var type = $("input[data-Type='netType']").val();
                    var idType = "followa";
                    if (type == "fans")
                        idType = "fans";
                    if (dataType == "0")
                        $("#" + idType + " strong").text(parseInt(value) + 1);
                    else if (dataType != "0")
                        $("#" + idType + " strong").text(parseInt(value) - 1);
                }
            }
        }).mouseleave(function () {
            $(this).removeClass("z-cancel");
        }).mouseenter(function () {
            if ($(this).attr("data-typeid") != "0") {
                $(this).addClass("z-cancel");
            }
        });
    });


    //点击关注按钮
    function Attention(btn) {
        //判断是否登录
        if (!headJs.loginInfo.isLogin) {
            location.href = '/login/Login';
            return;
        }
        ZDK.btnLoading({
            obj: btn,
            addClass: "disabled",
            txt: '关注中'
        });
        var followMemberId = btn.attr("data-userid");
        var status = btn.attr("data-typeid");
        $.ajaxjson("/MemberCenter/Setting/ashx/MemberHandler.ashx", { Action: "Attention", followMemberId: followMemberId, status: status },
                function (d) {
                    if (d.Success) {
                        btn.attr("data-typeid", d.Data);
                        if (d.Data == "0") {
                            btn.removeClass("z-cancel z-followed z-followed-1 z-followed-2").addClass("z-follow z-follow");
                            b(btn.closest(".j-follow-wp").find(".j-count"), -1);
                        } else if (d.Data == "1" || d.Data == "2") {
                            var className = "z-followed ";
                            d.Data == "1" ? className += "z-followed-1" : d.Data == "2" && (className += "z-followed-2");
                            btn.addClass(className).removeClass("z-follow");
                            b(btn.closest(".j-follow-wp").find(".j-count"), 1);
                        }
                        btn.mouseleave(function () {
                            btn.removeClass("z-cancel");
                        }).mouseenter(function () {
                            if (btn.attr("data-typeid") != "0") {
                                btn.addClass("z-cancel");
                            }
                        });
                    } else {
                        msg.error("关注失败");
                    }
                }, { IsShowLoading: false });
        btn.removeClass('disabled');
        ZDK.btnLoading.reset(btn);
    }

    //修改关注数
    function b(a, b) {
        if (!a.length || "undefined" == typeof b) return !1;
        var c = parseFloat(a.text()) || 0;
        a.text(b > 0 ? ++c : Math.max(0, --c));
    }
});