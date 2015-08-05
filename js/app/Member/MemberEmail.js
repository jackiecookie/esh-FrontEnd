define(function (require, exports, module) {
    var Fv = require('js/common/Esh_validator/Esh_validator'),
    account = require('js/common/VerifyCode/VerifyCode');
    $(function () {
        var btn_submit = $('#btn_submit');
        var btn_getEmailVerifyCode = $('#btn_getEmailVerifyCode');

        var fv = new Fv({
            items: [{
                item: '#email',
                rule: [/^\w+([-+.]\w+)*@(?!yahoo\.((cn)|(com\.cn)))\w+([-.]\w+)*\.\w+([-.]\w+)*$/i],
                tip: '#email_tip_con',
                tipcls: { right: 'tip-right-none' }, // 去勾
                msg: {
                    normal: '不允许绑定为雅虎中文邮箱',
                    empty: '请输入邮箱地址',
                    error: '邮箱地址格式不正确或不允许'
                }
            }, {
                item: '#email_verifycode',
                tip: '#email_vcode_tip_con',
                rule: [/^\d{6}$/],
                tipcls: { right: 'tip-right-none' }, // 去勾
                msg: {
                    normal: '',
                    empty: '请输入验证码',
                    error: '验证码有误',
                    ajaxError: '验证码有误'
                }
            }],
            rules: {}
        });
        var timer;
        btn_getEmailVerifyCode.click(function (e) {
            var vr = $("#verify_result").val();
            var _url = '/Member/ashx/SendEmailVC.ashx';
            var data = { verify_result: $("#verify_result").val() };
            var result = fv.check('#email', function (success) {
                if (success) {
                    btn_getEmailVerifyCode.hide();
                    timer = account.sendVerifyCode(this, _url, 'email', $("#email"), 60, data, { showErrmsg: showErrmsg, btn_submit: btn_submit, btn_getEmailVerifyCode: btn_getEmailVerifyCode });
                }
            });
            if (result != 'pending') {
                if (result == true) {
                    btn_getEmailVerifyCode.hide();
                    timer = account.sendVerifyCode(this, _url, 'email', $("#email"), 60, data, { showErrmsg: showErrmsg, btn_submit: btn_submit, btn_getEmailVerifyCode: btn_getEmailVerifyCode });
                }
            }
        });

        $('#form').bind('submit', function (e) {
            e.preventDefault();

            fv.v2c(function (success) {
                btn_submit.addClass('btn-fmsubmit-disabled').text('提交中...');
                $.getJSON('/Member/ashx/bindEmail.ashx', { 'input_Email': $('#email').val(), 'sms': $('#email_verifycode').val(), 'type': 'email' }, function (data) {
                    if (data.success) {
                        $('.section .errortip').remove();
                        if (data.href) {
                            location.href = data.href;
                        } else {
                            location.reload();
                        }
                    } else {

                        showErrmsg(data, timer, btn_submit, btn_getEmailVerifyCode);
                        //$('.section .errortip').remove();
                        //var errMsg = data.existMsg ? data.existMsg : "验证码错误，请重试";
                        //$('.section').prepend('<div class="errortip">' + errMsg + '</div>');
                        //btn_submit.removeClass('btn-fmsubmit-disabled').text('提交');
                    }
                });
                return false;
            });
        });
    });


    var showErrmsg = function (data, timer, btnSubmit, btnGetEmailVerifyCode, removeDiv) {
        $('.section .errortip').remove();
        var errMsg = data.existMsg ? data.existMsg : "验证码错误，请重试";
        $('.section').prepend('<div class="errortip">' + errMsg + '</div>');
        btnSubmit.removeClass('btn-fmsubmit-disabled').text('提交');
        if (removeDiv) {
            if (timer)
                clearInterval(timer);
            $('.resend_tip').hide();

            btnGetEmailVerifyCode.show();
            btnGetEmailVerifyCode.css('visibility', 'visible');
        }
    }
});

