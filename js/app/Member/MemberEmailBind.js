define(function (require, exports, module) {
    var Fv = require('js/common/Esh_validator/Esh_validator');
    $(function () {
        //初始化页面
        var emailDiv = $('.id_email');
        var mobileDiv = $('.id_mobile');
        if (emailDiv[0] && mobileDiv[0]) {
            emailDiv.hide();
        } else {
            $('.uitab-1 a').addClass('on');
        }
        var btn_submit = $('#btn_submit');

        var fv_mobile = new Fv({
            items: [{
                item: '#data_verifyCodeMobile',
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


        var fv_email = new Fv({
            items: [{
                item: '#data_verifyCodeEMail',
                rule: [/^\d{6}$/],
                tipcls: { right: 'tip-right-none' }, // 去勾
                msg: {
                    normal: '',
                    empty: '请输入验证码'
                }
            }],
            rules: {}
        });




        //var vItems = new Array();
        //if ($('#vcode')[0]) {
        //    vItems.push({
        //        item: '#vcode',
        //        tip: '#vcode_tip_con',
        //        rule: [/^[a-zA-Z0-9]{4}$/],
        //        tipcls: { right: 'tip-right-none' },	// 去勾
        //        msg: {
        //            normal: '',
        //            empty: '请输入验证码',
        //            error: '验证码输入有误'
        //        }
        //    });
        //}



        $('#form').bind('submit', function (e) {
            e.preventDefault();

            var type = $('input[name=verifyType]').val();
            var validator;
            if (type == 'mobile') {
                validator = fv_mobile;
            } else if (type == 'email') {
                validator = fv_email;
            }

            btn_submit.addClass('btn-fmsubmit-disabled');
            validator.v2c(function (success) {
                if (success) {
                    btn_submit.text('提交中...');
                    var sms = type == 'email' ? $('#data_verifyCodeEMail').val() : $('#data_verifyCodeMobile').val();
                    $.getJSON('/Member/ashx/bindEmail.ashx', { 'input_Email': 'editEmail', 'sms': sms, 'type': type }, function (data) {
                        if (data.success) {
                            if (data.href) {
                                location.href = data.href;
                            } else {
                                location.reload();
                            }
                        } else {
                            $('.section').prepend('<div class="errortip">验证码错误，请重试</div>');
                            btn_submit.removeClass('btn-fmsubmit-disabled').text('提交');
                        }
                    });
                    return false;
                } else {
                    btn_submit.removeClass('btn-fmsubmit-disabled');
                }
            }, true);
        });
    });
});
