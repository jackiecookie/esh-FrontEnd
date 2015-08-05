
define(['jquery', 'js/common/Esh_validator/Esh_validator'], function (require, exports, module) {
    var Fv = require('js/common/Esh_validator/Esh_validator'),
    validator,
  eshFindPwd = {
        init: function () {
            var obj = eshFindPwd;
            obj.initVCode();
            obj.initRule();
            obj.initSubmitBtn();
            obj.initSendBtn();
        },
        //存在验证码框初始化验证码
        initVCode: function () {
            var vCode = $('#esh_Vcode');
            if (vCode[0]) {
                vCode.attr('src', "/validateCode.hxl?t=4&n=" + new Date().getTime().toString());
                vCode.click(function () {
                    $(this).attr('src', "/validateCode.hxl?t=4&n=" + new Date().getTime().toString());
                });
                $('#esh_VcodeBtn').click(function () {
                    vCode.attr('src', "/validateCode.hxl?t=4&n=" + new Date().getTime().toString());
                });
            }
        },
        initSubmitBtn: function () {
            var pwdinput = $('#pwdstrength');
            var submitBtn = $('#findPwdSubmit'),
              from = $('#findpwdform');
            if (!pwdinput[0]) {
                submitBtn.click(function () {
                    if (submitBtn.hasClass('disabled')) {
                        return false;
                    }
                    validator.v2c(function (success) {
                        if (success) {
                            submitBtn.addClass("disabled");
                            var para = myCreateParam(from);
                            $.getJSON(from.attr('action'), para, function (data) {
                                submitBtn.removeClass('disabled');
                                if (data.Success) {
                                    location.href = data.Data;
                                } else {
                                    $('#esh_Vcode').attr('src', "/validateCode.hxl?t=4&n=" + new Date().getTime().toString());
                                    $('[name=' + data.Data + ']').siblings('.tip-right-none').text(data.Message).removeClass().addClass('tip-error');
                                    $("#sendMobileCode").removeAttr("disabled");
                                    $("#timeDiv").hide();
                                    $("#sendMobileCodeDiv").show();
                                    $("#send_text").hide();
                                }
                            });
                        } else {
                            return false;
                        }
                    }, true);
                });
            } else {
                submitBtn.click(function () {
                    if (submitBtn.hasClass('disabled')) {
                        return;
                    }
                    if (!checkNewPasswordForm($("#password").val())) {
                        return;
                    }
                    if (!isSamePassword()) {
                        return;
                    }
                    submitBtn.addClass("disabled");
                    var para = myCreateParam(from);
                    $.getJSON(from.attr('action'), para, function (data) {
                        submitBtn.removeClass('disabled');
                        if (data.Success) {
                            location.href = data.Data;
                        } else {
                            $('#esh_Vcode').attr('src', "/validateCode.hxl?t=4&n=" + new Date().getTime().toString());
                            $('[name=' + data.Data + ']').siblings('.tip-right-none').text(data.Message).removeClass().addClass('tip-error');
                            $("#sendMobileCode").removeAttr("disabled");
                            $("#timeDiv").hide();
                            $("#sendMobileCodeDiv").show();
                            $("#send_text").hide();
                        }
                    });
                });
            }
        },
        initRule: function () {
            var pwdinput = $('#pwdstrength');
            if (!pwdinput[0]) {
                var vItems = new Array();
                var input = $('form :input');
                input.each(function (i, el) {
                    vItems.push({
                        item: el,
                        tipcls: { right: 'tip-right-none' }, // 去勾
                        msg: {
                            normal: '',
                            empty: '不能为空'
                        },
                        tip: $(el).siblings('#authCode_error')[0]
                        // tip:'</br><div></div>'
                    });
                });
                validator = new Fv({
                    items: vItems
                });
            } else {


            }
        },
        initSendBtn: function () {
            var sendMobile = $('#sendMobileCode');
            if (sendMobile[0]) {
                sendMobile.click(function () {
                    if (sendMobile.attr("disabled")) {
                        return;
                    }
                    sendMobile.attr("disabled", "disabled");
                    jQuery.ajax({
                        type: "POST",
                        dataType: "json",
                        url: "/Member/ashx/SendVCMsgHandler.ashx",
                        data: { 'Mid': $('#Mid').val() },
                        success: function (data) {
                            if (data.success) {
                                $("#ftx-01").text(119);
                                $("#sendMobileCodeDiv").hide();
                                $("#timeDiv").show();
                                setTimeout(countDown, 1000);
                                $("#code").removeAttr("disabled");
                                $("#submitCode").removeAttr("disabled");
                            } else {
                                alert(data.errorMessage);
                                $("#sendMobileCode").removeAttr("disabled");
                            }
                        },
                        error: function () {
                            alert("网络连接超时，请您稍后重试");
                            $("#sendMobileCode").removeAttr("disabled");
                        }
                    });
                });
            }
            var sendMail = $('#sendMail');
            if (sendMail[0]) {
                sendMail.click(function () {
                    jQuery.ajax({
                        type: "POST",
                        dataType: "json",
                        url: "/Member/ashx/SendEmailVC.ashx",
                        data: { 'Mid': $('#Mid').val() },
                        success: function (data) {
                            if (data.success) {
                                $('.form').html('<div class="form"><div class="call suc"><b></b><span>验证邮件已发送，请您登录邮箱</a></strong>完成验证</span></div></div>');
                            } else {
                                alert(data.errorMessage);
                            }
                        },
                        error: function () {
                            alert("网络连接超时，请您稍后重试");
                            $("#sendMobileCode").removeAttr("disabled");
                        }
                    });
                });
            }
        }
    };


    var myCreateParam = function (form) {
        var para = {}, obj;
        if (form) {
            obj = form.serializeArray();
            for (var i = 0, len = obj.length; i < len; i++) {
                //    para.push(obj[i].name = obj[i].value);
                para[obj[i].name] = obj[i].value;
            }
        }
        return para;
    };
    function selectVerifyType() {
        var type = $("#type").val();
        if (type == "mobile") {
            $("#mobileDiv").show();
            $("#emailDiv").hide();
        } else if (type == "email") {
            $("#mobileDiv").hide();
            $("#emailDiv").show();
        }
    }

    function countDown() {
        var time = $("#ftx-01").text();
        $("#ftx-01").text(time - 1);
        if (time == 1) {
            $("#sendMobileCode").removeAttr("disabled");
            $("#timeDiv").hide();
            $("#sendMobileCodeDiv").show();
            $("#send_text").hide();
        } else {
            setTimeout(countDown, 1000);
        }
    }

    function passwordFocus(passwordId) {
        $("#pwdstrength").removeClass().hide();
        $("#password").removeClass().addClass("text highlight1");
        $("#password_error").removeClass().addClass("msg-text").html("密码必须为6-20位，且至少包含英文、数字和符号中的两种");
    }

    function passwordBlur() {
        $("#password").removeClass().addClass("text");
        var password = $("#password").val();
        if (!password) {
            $("#password").removeClass().addClass("text");
            $("#password_error").removeClass().html("");
            $("#pwdstrength").hide();
            $("#pwdstrength").removeClass();
            return;
        }
        checkNewPasswordForm();
        $("#repassword").focus();
    }
    function checkNewPasswordForm() {
        var password = $("#password").val();
        if (!password) {
            $("#password").removeClass().addClass("text text-error highlight2");
            $("#password_error").removeClass().addClass("msg-error").html("请输入密码");
            return false;
        }
        var reg = new RegExp("^.*([\u4E00-\u9FA5])+.*$", "g");
        if (reg.test(password)) {
            $("#password").removeClass().addClass("text text-error highlight2");
            $("#password_error").removeClass().addClass("msg-error").html("密码格式不正确，请重新设置");
            return false;
        } else if (password.length < 6) {
            $("#password").removeClass().addClass("text text-error highlight2");
            $("#password_error").removeClass().addClass("msg-error").html("密码长度不正确，请重新设置");
            return false;
        } else if (password.length > 20) {
            $("#password").removeClass().addClass("text text-error highlight2");
            $("#password_error").removeClass().addClass("msg-error").html("密码长度不正确，请重新设置");
            return false;
        } else {
            var pattern_1 = /^.*([\W_])+.*$/i;
            var pattern_2 = /^.*([a-zA-Z])+.*$/i;
            var pattern_3 = /^.*([0-9])+.*$/i;
            var strength = 0;
            if (password.length > 10) {
                strength++;
            }
            if (pattern_1.test(password)) {
                strength++;
            }
            if (pattern_2.test(password)) {
                strength++;
            }
            if (pattern_3.test(password)) {
                strength++;
            }
            if (strength <= 1) {
                $("#password").removeClass().addClass("text text-error highlight2");
                $("#password_error").removeClass().addClass("msg-error").html("密码太弱，有被盗风险，请设置由多种字符组成的复杂密码");
                return false;
            }
            if (strength == 2) {
                $("#pwdstrength").show();
                $("#pwdstrength").removeClass().addClass("strengthB");
                $("#password").removeClass().addClass("text");
                $("#password_error").removeClass().html("");
            }
            if (strength >= 3) {
                $("#pwdstrength").show();
                $("#pwdstrength").removeClass().addClass("strengthC");
                $("#password").removeClass().addClass("text");
                $("#password_error").removeClass().html("");
            }
        }
        return true;
    }
    function repasswordFocus(passwordId) {
        $("#repassword").removeClass().addClass("text highlight1");
        $("#repassword_error").removeClass().addClass("msg-text").html("请再次输入新密码");
    }

    function repasswordBlur() {
        $("#repassword").removeClass().addClass("text");
        var repassword = $("#repassword").val();
        if (!repassword) {
            $("#repassword").removeClass().addClass("text");
            $("#repassword_error").removeClass().html("");
            return;
        }
        isSamePassword();
    }
    function isSamePassword() {
        var password = $("#password").val();
        var repassword = $("#repassword").val();
        if (!repassword) {
            $("#repassword").removeClass().addClass("text highlight2");
            $("#repassword_error").removeClass().addClass("msg-error").html("请再次输入新密码");
            return false;
        }
        if (password != repassword) {
            $("#repassword").removeClass().addClass("text highlight2");
            $("#repassword_error").removeClass().addClass("msg-error").html("两次输入的密码不一致，请重新输入");
            return false;
        }
        $("#repassword_error").removeClass().html("");
        return true;
    }

    module.exports = eshFindPwd;
    module.exports.selectVerifyType = selectVerifyType;

    module.exports.repasswordFocus = repasswordFocus;
    module.exports.repasswordBlur = repasswordBlur;

    module.exports.passwordFocus = passwordFocus;
    module.exports.passwordBlur = passwordBlur;
})

