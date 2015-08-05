define(function (require, exports, module) {
    require('jquery');
    require("jQueryAjax");
    var alertify = require('alertify');
    var headJs = require('headJs');
    $(function () {
        //切换支付方式  
        $(".ali_pay_li").each(function (index) {
            $(this).click(function () {
                var $thisObj = $(this);
                if ($thisObj.className == "current") return;
                $thisObj.addClass("current").siblings("li").removeClass("current"); //tab的current样式标示选中

                //对应支付层的显示隐藏
                var $showDiv = $(".pay_box");
                $($showDiv[index]).show().siblings(".pay_box").hide();

                var type = $thisObj.attr("data-channel");
                if (type == "alipay") {
                    $("#bankId").val("Alipay");
                } else {
                    $("#bankId").val("chinabank");
                }
            });
        });

        //选择优惠券修改金额 （复选框多选）
        /*$("[name = VolumediscounIds]:checkbox").bind("click", function () {
        var vipMoney = parseFloat($("#hdVipMoney").val());
        var VolumediscounIds = $("#hdVolumediscounIds").val();
            
        var idsArray= VolumediscounIds.split(',');
        if ($(this).attr("checked") == "checked") {
        //选中（实付金额 - 优惠卷额）
        vipMoney = vipMoney - parseFloat($(this).attr("dataValue"));
        if (vipMoney < 0) {
        vipMoney = 0;
        }
        idsArray.push($(this).val());
        } else { // 取消 （实付金额 + 优惠卷额）
        vipMoney = vipMoney + parseFloat($(this).attr("dataValue")); 
        idsArray.splice($.inArray($(this).val(), idsArray), 1);
        }
        $("#hdVolumediscounIds").val(idsArray.join(","));
        $("#hdVipMoney").val(vipMoney);
        $("[name=vipMoney]").text(vipMoney);
        });*/
        //选择优惠券修改金额 （单选）
        $("[name = couponA]").bind("click", function () {
            var vipMoney = parseFloat($("#hdMoney").val()); //配置VIP年费
            var couponId = $(this).attr("dataId");  //代金卷Id
            //点击时判断是否已被选中（已选中就取消，未选中标记已选中）
            var couponValue = 0;
            $("[name = couponA]").each(function (d) {
                if (couponId && couponId == $(this).attr("dataId")) {
                    if ($(this).attr("dataStatus") == 1) {
                        alertify.alert("此优惠券已锁定，暂不能使用。");
                        return;
                    }
                    couponValue = parseFloat($(this).attr("dataValue")); //代金卷金额
                    if ($(this).hasClass("selected")) {
                        $(this).removeClass("selected");
                        couponId = ""; //清除已选择优惠券Id
                    } else { //选中优惠券，标记已选中，减去VIP价格
                        $(this).addClass("selected");
                        vipMoney = vipMoney - couponValue;
                    }
                } else {
                    $(this).removeClass("selected");
                }
            });
            if (vipMoney < 0) {
                vipMoney = 0;
            }
            $("#hdVolumediscounIds").val(couponId);
            $("#hdVipMoney").val(vipMoney); //实际使用优惠券后VIP费用 
            $("[name=vipMoney]").text(vipMoney);
        });

        //定义购买点击事件
        $("#btnBuyVip").click(function () {
            //判断是否登录
            if (!headJs.loginInfo.isLogin) {
                location.href = '/login/Login';
                return;
            }
            //判断余额不足 
            //            $.ajaxjson("/Member/ashx/Acount/VipPay.ashx", { Action: "judgeMoney" }, function (d) {
            //                if (d.Success) {
            //                    alertify.rechang();
            //                } else {
            //                    //确认开通VIP
            //                    alertify.set({
            //                        labels: {
            //                            ok: "确定",
            //                            cancel: "取消"
            //                        }
            //                    });
            //                    if ($("#hdBuyVip").val() == "0") {
            //                        msgs = "续费";
            //                    }
            //                    alertify.confirm("请确认是否 " + msgs + " VIP？", function (e) {
            //                        if (e) {
                            var msgs = "开通";
            var VolumediscounIds = $("#hdVolumediscounIds").val();

            $.ajaxjson("/Member/ashx/Acount/VipPay.ashx", { Action: "vipay", VolumediscounIds: VolumediscounIds }, function (d) {
                if (d.Success) {
                    layer.tips('<div style="text-align: center;">' + msgs + '成功！<br/>VIP有效期至： ' + d.Data + ' <div>', $("#btnBuyVip"), {
                        style: ['background-color:#F26C4F; color:#fff', '#F26C4F'],
                        closeBtn: [0, true],
                        time: 4
                    });
                    if ($("#hdBuyVip").val() == "1") {
                        setTimeout(function () { location.href = '/RenewVIP'; }, 4000);
                    } else {
                        $("#lblEndTime").text(d.Data);
                    }
                } else {
                    if (d.Data == 3) {
                        alertify.rechang();
                    } else if (d.Data == -1) {
                        location.href = '/login/Login';
                    } else
                        msg.error(d.Message);
                }
            }, { IsShowLoading: false });
            //                        }
            //                    });
            //                }
            //            });
        });


    });
});