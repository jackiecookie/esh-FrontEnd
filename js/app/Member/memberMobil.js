
define(['js/common/Esh_validator/Esh_validator', 'js/common/VerifyCode/VerifyCode'], function (require, exports, module) {
    var Fv = require('js/common/Esh_validator/Esh_validator'), 
    account = require('js/common/VerifyCode/VerifyCode');
    $(function () {
        var btn_submit = $('#btn_submit');
        var btn_getMobileVerifyCode = $('#btn_getMobileVerifyCode');
        var itemObj;
        if ($('#mobile').length > 0) {
            itemObj = {
                item: '#mobile',
                tip: '#mobile_tip_con',
                rule: [/^1\d{10}$/],
                tipcls: { right: 'tip-right-none' }, // 去勾
                msg: {
                    normal: '',
                    empty: '请输入手机号',
                    ajaxError: '手机号有误'
                }
            };
        }
        var fv_mobile = new Fv({
            items: [itemObj, {
                item: '#data_verifyCodeMobile',
                tip: '#mobile_vcode_tip_con',
                rule: [/^\d{6}$/],
                tipcls: { right: 'tip-right-none' }, // 去勾
                msg: {
                    normal: '',
                    empty: '请输入验证码',
                    ajaxError: '验证码错误'
                }
            }],
            rules: {}
        });
        var timer;
        btn_getMobileVerifyCode.click(function (e) {
            var el = e.currentTarget;
            var vr = $("#verify_result").val();
            var _url = '/Member/ashx/SendVCMsgHandler.ashx';
            var data = { verify_result: $("#verify_result").val() };
            if ($('#mobile').length > 0) {
                var result = fv_mobile.check('#mobile', function (success) {
                    if (success) {
                        btn_getMobileVerifyCode.hide();
                        timer = account.sendVerifyCode(el, _url, 'phone', $("#mobile"), 60, data, { showErrmsg: showErrmsg, btn_submit: btn_submit, btn_getEmailVerifyCode: btn_getMobileVerifyCode });
                    }
                });
                if (result != 'pending') {
                    if (result == true) {
                        btn_getMobileVerifyCode.hide();
                        timer = account.sendVerifyCode(el, _url, 'phone', $("#mobile"), 60, data, { showErrmsg: showErrmsg, btn_submit: btn_submit, btn_getEmailVerifyCode: btn_getMobileVerifyCode });
                    }
                }
            } else {
                timer = account.sendVerifyCode(el, _url, 'phone', '', 60, data, { showErrmsg: showErrmsg, btn_submit: btn_submit, btn_getEmailVerifyCode: btn_getMobileVerifyCode });
            }
        });

        $('#form').bind('submit', function (e) {
            e.preventDefault();

            fv_mobile.v2c(function () {
                if (btn_submit.hasClass('btn-fmsubmit-disabled')) return;
                btn_submit.addClass('btn-fmsubmit-disabled').text('提交中...');
                $.getJSON('/Member/ashx/Bind.ashx', { 'input_mobile': $('#mobile').val() ? $('#mobile').val() : 'editPhone', 'sms': $('#data_verifyCodeMobile').val() }, function (data) {
                    if (data.success) {
                        if (data.href) {
                            location.href = data.href;
                        } else {
                            location.reload();
                        }
                    } else {
                        showErrmsg(data, timer, btn_submit, btn_getMobileVerifyCode);
                    }
                });
                return false;
            });
        });
    });

    var showErrmsg = function (data, timer, btnSubmit, btnGetMobileVerifyCode, removeDiv) {
        $('.section .errortip').remove();
        var errMsg = data.existMsg ? data.existMsg : "验证码错误，请重试";
        $('.section').prepend('<div class="errortip">' + errMsg + '</div>');
        btnSubmit.removeClass('btn-fmsubmit-disabled').text('提交');
        if (removeDiv) {
            if (timer)
                clearInterval(timer);
            $('.resend_tip').hide();

            btnGetMobileVerifyCode.show();
            btnGetMobileVerifyCode.css('visibility', 'visible');
        }
    }
});
