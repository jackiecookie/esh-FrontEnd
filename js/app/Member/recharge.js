define(function (require, exports, module) {
    var autoMenuHeight=require('headJs').autoMenuHeight;
    require('js/common/jqueryvalidate/jquery.validator');var Recharge = {
    validator: {},
    sendStr: "",
    vrule: [{
        target: '#rechargeMoney',
        empty: '请输入充值金额!',
        handler: function (val) {
            if (!/^((0\.0[1-9])|(0\.[1-9][0-9]?)|([1-9][0-9]*(\.\d{1,2})?))$/.test($('#rechargeMoney').val())) {
                return '充值金额必须是大于0的整数或者两位以内的小数！';
            }
            return true;
        },
        error: [
			{
			    message: '充值金额必须是大于0的整数或者两位以内的小数！',
			    regexp: /^((0\.0[1-9])|(0\.[1-9][0-9]?)|([1-9][0-9]*(\.\d{1,2})?))$/
			}
		]
    }],

    init: function () {
        var me = Recharge;
        me.sendStr = $("#bankType-zh").val();
        me.validator = $.validator(me.vrule, {
            normal: 'tgrey',
            error: 'ico ico-warning torange',
            success: 'tgreen'
        });
        $("#save_submit").click(me.submitHandler);
        $("#closeTips").click(me.tipsCloseHandler);
        $("#method-list li").click(me.changeTab);
        $("input[name='bank']").click(me.setBankId);
        $("input[name='InpourType']").click(me.changeBank);
        $("input[name='bankType']").click(me.changeSendBank);
        $("#sendMessage").click(me.sendHandler);
    },
    sendHandler: function () {
        var me = Recharge;
        var $sourceEl = $("#sendMessage");
        var $resendTipEl = $("#verify_tips");
        var timeLimit = 90;
        $sourceEl.attr('disabled', 'disabled');

        $.post('/Member/ashx/Acount/SendSMS.ashx', { action: 'bankAccount' },
					function (result) {
					    $resendTipEl.show();
					    if (result.success == false) {
					        var error = "";
					        if (result.tips)
					            error = result.tips;
					        else if (result.errorMsg)
					            error = result.errorMsg;
					        $resendTipEl.html(error);
					        return false;
					    } else {
					        me.startTimer($resendTipEl, '短信已发送至您的手机，${seconds}秒后重新发送！', timeLimit, function () {
					            $sourceEl.removeAttr("disabled").val('重新发送');
					            $resendTipEl.hide();
					        });
					    }
					});

    },
    setBankId: function () {
        var bankId = $("input[name='bank']:checked").val();
        $("#bankId").val(bankId);
    },

    changeTab: function () {
        $("#method-list li").removeClass("current-li");
        $(".fn-list").addClass("fn-hide");
        $(this).addClass("current-li");
        $("#save_submit").show();
        if (this.id == "method-alipay") {
            $(".alipay-list").removeClass("fn-hide");
            $(".alipay-list").find('input:radio:eq(0)').attr('checked', 'checked');
            $("#bankId").val($(".bank-alipay").find('input:radio:eq(0)').val());
        }
        if (this.id == "method-online") {
            $(".online-list").removeClass("fn-hide");
            $(".bankP-list").show();
            $(".bankE-list").hide();
            $("input[name='InpourType']:radio:eq(0)").attr('checked', 'checked');
            $(".bankP-list").find('input:radio:eq(0)').attr('checked', 'checked');
            $("#bankId").val($(".bankP-list").find('input:radio:eq(0)').val());

        }
        if (this.id == "method-offline") {
            $(".offline-list").removeClass("fn-hide");
            $(".offline-list").find('input:radio:eq(0)').attr('checked', 'checked');
            $("#save_submit").hide();
        }
        autoMenuHeight();
    },

    changeBank: function () {
        $(".b-list").addClass("fn-hide");
        var thisVal = $("input:[name='InpourType']:checked").val();
        if (thisVal == "1") {
            $(".bankP-list").show();
            $(".bankE-list").hide();
            $(".bankP-list").find('input:radio:eq(0)').attr('checked', 'checked');
            $("#bankId").val($(".bankP-list").find('input:radio:eq(0)').val());
        } else {
            $(".bankE-list").show();
            $(".bankP-list").hide();
            $(".bankE-list").find('input:radio:eq(0)').attr('checked', 'checked');
            $("#bankId").val($(".bankE-list").find('input:radio:eq(0)').val());
        }

    },

    changeSendBank: function () {
        var me = Recharge;
        var thisVal = $("input:[name='bankType']:checked").val();
        me.sendStr = thisVal;
    },

    tipsCloseHandler: function () {
        $("#moneyTips").hide();
    },

    submitHandler: function () {
        var me = Recharge;
        if (me.validator.complete()) {
            $('#get_money_form').submit();
        }
        return false;
    },
    startTimer: function (el, template, timeLimit, callback) {
        var i = timeLimit;

        var fn = function () {
            el.text(template.replace(/\${seconds}/g, i));
            i--;
            if (i <= 0) {
                clearInterval(timer);
                if (callback instanceof Function) {
                    callback();
                }
            }
        };
        fn();
        var timer = setInterval(fn, 1000);
    }
};
    $(function () {
    $("#cashBalance").html(($("#CASHBALANCE").val() - 0).toFixed(2));
    $("#method-list").show();

    var mobile = $("#mobile").html();
    if (!mobile || mobile == "无手机号码") {
        $("#sendMessage").attr("disabled", "disabled");
        $("#verify_tips").html("您当前未绑定手机号码，请先<a href='https://account.aliyun" + $("#SUFFIXS").val() + "/profile/profile.htm' target='_blank'>绑定</a>手机号码!").show();
    }
    Recharge.setBankId();
    Recharge.init();
});


});
