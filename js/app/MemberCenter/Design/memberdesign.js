define(function (require, exports, module) {
    var ajax = require('jQueryAjax');
    require('FancyRadioCheckBox');
    require('js/common/cssSelect/cssSelect');
    var ZDK = require('js/common/procopy/procopy');
    ZDK.btnLoading = require('btnLoading');
    require('js/common/jqueryvalidate/jqueryvalidate');
    require('customSelect');
    require('lazyload');
    var showLoginForm = require('loginPanel');
    var layer = require("layer");
    var verifyForm = require('js/common/verify/verifyform');
    var alertify = require('alertify');

    var design = {
        //是否在提交form中
        submiting: 0,
        //设计页面处理程序地址
        actionUrl: "/MemberCenter/Design/ashx/DesignHandler.ashx",
        //提示
        tipsItem: function (msg, eventItem, showtime) {
            layer.tips(msg, eventItem, {
                guide: 2,
                style: ['background-color:#78BA32; color:#fff', '#78BA32'],
                maxWidth: 185,
                time: showtime,
                closeBtn: [0, true]
            });
        },
        //确认
        tipsConfirm: function (msg, eventItem, showtime) {
            layer.tips(msg, eventItem, {
                guide: 2,
                style: ['background-color:#78BA32; color:#fff', '#78BA32'],
                maxWidth: 185,
                time: showtime,
                closeBtn: [0, true]
            });
        },
        //ajax方法
        doAjax: function (action, eventItem, callback) {
            var c = this;
            //axaja按钮事件
            $.ajaxjson(action, '', function(d) {
                if (d.Success) {
                    if (callback) {
                        callback();
                    }
                } else if (d.Data != -1) {
                    c.tipsItem(d.Message, eventItem, 10);
                }
                else {
                    c.tipsItem("操作失败!", eventItem, 3);
                }
            }, { IsShowLoading: true });


        },
        //添加经纱种类
        addComponentRow: function (typeIndex, type) {
            var $dd = $("#dd" + type);
            var $span = $("#span" + type);

            var jxHtml = '';
            jxHtml += ' <div class="divtable"><div class="hr"></div>';
            jxHtml += '  <table cellpadding="0" cellspacing="0" class="table2">';
            jxHtml += '<tr>';
            jxHtml += ' <td class="td1" align="right">成分</td>';
            jxHtml += ' <td class="text1">';
            jxHtml += ' <input placeholder="点击选择" type="text"  readonly="readonly" class="w_small w_length  mr-5 selectYarn" /> ';
            jxHtml += '</td>';

            jxHtml += ' <td rowspan="2">  <input class="errorfocusinput" value="" readonly="readonly" /> ';
            jxHtml += '<a tabindex="52" type="div" data-name="SX' + type + typeIndex + '" data-valid="' + type + 'SX" class="buto auto form-value selectYarn" >选择纱线</a>';
            jxHtml += '<input name="iptcf" type="hidden" /><span class="form-tip"></span>';
            jxHtml += '</td>';
            jxHtml += '</tr>';

            jxHtml += '<tr>';
            jxHtml += ' <td class="td1" align="right">粗细</td>';
            jxHtml += ' <td class="text1">  <input placeholder="点击选择" type="text" readonly="readonly" class="w_small w_length  mr-5 selectYarn" /> </td>';
            jxHtml += '<td></td>';
            jxHtml += '</tr>';
            jxHtml += '</table><div>';
            $dd.append(jxHtml);
            $span.append("<span> + <input class=\"w_small w_30 form-value\" placeholder=\"整数\"  name=\"" + type + "\" data-valid=\"" + type + "\"  data-name=\"" + type + typeIndex + "\" type=\"text\"  /></span>");

        },

        //删除成分
        delComponentRow: function (type) {
            var c = this;
            $("#dd" + type).find(".divtable").last().remove();
            $("#span" + type).find("span").last().remove();
        },
        ajaxSubmit: function (eventItem, dataParam) {
            var c = this;
            var $event = $(eventItem);
            var isCloseWindow = $event.attr("isCloseWindow");
            if (c.submiting == 1) {
                return false;
            };
            c.submiting = 1;
            ZDK.btnLoading({
                obj: $event,
                addClass: "disabled"
            });
            $.ajaxSubmit(c.actionUrl + "?" + dataParam, $("#form1"), function (d) {
                c.submiting = 0;
                $event.removeClass('disabled');
                ZDK.btnLoading.reset($event);
                if (d.Data == "1") {
                    c.tipsItem("操作成功", eventItem, 3);
                    if (isCloseWindow) {
                        window.close();
                    } else {
                        window.location.href = "/membercenter/designlist?listDataType=2";
                    }
                }
                else if (d.Data == "-1") {
                    c.tipsItem("登录超时，请重新登录!", eventItem, 3);
                    showLoginForm();
                }
                else if (d.Data == "-2") {
                    c.tipsItem(d.Message, eventItem, 3);
                }
                else {
                    c.tipsItem(d.Message, eventItem, 3);
                    // self.showErroTip(d.Message, d.Data);

                }

            }, { Message: "正在保存,请稍后...", LoadingType: 2 });
        },
        //提交表单
        doSubmit: function (eventItem) {
            var c = this;
            var $this = $(eventItem);
            var dataParam = $this.attr("dataParam");
            if (!dataParam) return;
            var isSubmit = true;
            if (dataParam.indexOf(10) > 0) {
                alertify.confirm("一旦保存并发布,将进入审核状态,该产品将无法修改,是否确认提交", function (e) {
                    if (!e) {
                        return false;
                    }
                    else {
                        c.ajaxSubmit(eventItem, dataParam);
                    }
                });
            }
            else {
                c.ajaxSubmit(eventItem, dataParam);
            }
        }
        ,
        //提交时间绑定
        submitFabricInit: function () {
            var c = this;
            var rules = {
                "ParentClass": {
                    "msg": "请选择面料分类",
                    "valid": [
                    {
                        "msg": "请选择面料分类",
                        "type": "required"
                    }
                ]
                },
                "FABRICTYPE_SYSNUMBER": {
                    "msg": "请选择面料分类",
                    "valid": [
                    {
                        "msg": "请选择面料分类",
                        "type": "required"
                    }
                ]
                },
                "FNUMBER": {
                    "msg": "请输入面料编号",
                    "valid": [
                    {
                        "msg": "请输入面料编号",
                        "type": "required"
                    },
                    {
                        "range": [1, 40],
                        "msg": "面料编号最多可输入40位",
                        "type": "range"
                    }
                ]
                },
                "NAME": {
                    "msg": "请输入面料名称",
                    "valid": [
                    {
                        "msg": "请输入面料名称",
                        "type": "required"
                    },
                    {
                        "range": [1, 40],
                        "msg": "面料名称最多可输入40位",
                        "type": "range"
                    }
                   ]
                },
                "JXMD": {
                    "msg": "请输入经密",
                    "valid": [
                    {
                        "msg": "请输入经密",
                        "type": "required"
                    },
                   {
                       "name": "^[1-9]\\d*$",
                       "msg": "请输入正确的经密，只能输入正整数",
                       "type": "reg"
                   }
                ]
                },
                "WXMD": {
                    "msg": "请输入纬密",
                    "valid": [
                    {
                        "msg": "请输入纬密",
                        "type": "required"
                    },
                   {
                       "name": "^[1-9]\\d*$",
                       "msg": "请输入正确的纬密，只能输入正整数",
                       "type": "reg"
                   }
                ]
                },
                "JXMDSX": {
                    "msg": "请选择纱线",
                    "valid": [
                    {
                        "msg": "请选择纱线",
                        "type": "required"
                    }
                ]
                },
                "WXMDSX": {
                    "msg": "请选择纱线",
                    "valid": [
                    {
                        "msg": "请选择纱线",
                        "type": "required"
                    }
                ]
                },
                "YH_HWXH": {
                    "msg": "请输入花位循环",
                    "valid": [
                    {
                        "msg": "请输入花位循环",
                        "type": "required"
                    },
                   {
                       "name": "^[1-9]\\d*$",
                       "msg": "请输入正确的花位循环，只能输入正整数",
                       "type": "reg"
                   }
                ]
                },
                "JSHHCC_CM": {
                    "msg": "请输入经向花回尺寸",
                    "valid": [
                    {
                        "msg": "请输入经向花回尺寸",
                        "type": "required"
                    },
                   {
                       "name": "^\\d+[.]*\\d*$",
                       "msg": "请输入正确的经向花回尺寸",
                       "type": "reg"
                   }
                ]
                },
                "WSHHCC_CM": {
                    "msg": "请输入纬向花回尺寸",
                    "valid": [
                    {
                        "msg": "请输入纬向花回尺寸",
                        "type": "required"
                    },
                   {
                       "name": "^\\d+[.]*\\d*$",
                       "msg": "请输入正确的纬向花回尺寸",
                       "type": "reg"
                   }
                ]
                },
                "HL": {
                    "msg": "请输入美元汇率",
                    "valid": [
                    {
                        "msg": "请输入美元汇率",
                        "type": "required"
                    },
                   {
                       "name": "^\\d+[.]*\\d*$",
                       "msg": "请输入正确的美元汇率，只能输入数字",
                       "type": "reg"
                   }
                ]
                },
                "ImgPath": {
                    "msg": "请上传图片",
                    "valid": [
                    {
                        "msg": "请上传图片",
                        "type": "required"
                    }
                ]
                }

            };
            verifyForm($("#form1"), function (eventItem) { c.doSubmit(eventItem); }, rules);
        },
        initFabricDetail: function () {
            var c = this;

            //纱线种类数量问号说明
            $(".record-help").mouseover(function () {
                c.tipsItem($(this).attr("title"), this, 10);
            });
            //面料分类选择
            $(".parentClass").change(function () {
                var selectValue = $(this).val();
                if (selectValue && selectValue != "") {
                    $(".childClass").show();
                    $(".childClass").val('');
                    $(".childClass").find("option").each(function () {
                        var parentValue = $(this).attr("data-parentID")
                        if (!parentValue || parentValue == "" || selectValue == parentValue) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });
                }
                else {
                    $(".childClass").hide();
                }
            });

            //添加纱织
            $('.addNum').click(function () {
                var $numInput = $(this).parent().find("input");
                var num = parseInt($numInput.val()) + 1;
                var maxNum = $numInput.attr("data-maxNum");

                if (num <= maxNum) {
                    $numInput.val(num);
                    $(this).siblings(".reduceNum").prop("disabled", false);
                    $(this).siblings(".reduceNum").removeClass('disabled');
                    c.addComponentRow(num, $numInput.attr("data-for"));
                }
                if (num == maxNum) {
                    $(this).prop("disabled", true);
                    $(this).addClass('disabled');
                }
                c.submitFabricInit();
            });
            //减少纱织
            $('.reduceNum').click(function () {
                var $numInput = $(this).parent().find("input");
                var num = parseInt($numInput.val()) - 1;
                if (num > 0) {
                    $numInput.val(num);
                    c.delComponentRow($numInput.attr("data-for"));
                    $(this).siblings(".addNum").prop("disabled", false);
                    $(this).siblings(".addNum").removeClass('disabled');
                }
                if (num == 1) {
                    $(this).prop("disabled", true);
                    $(this).addClass('disabled');
                }
                c.submitFabricInit();
            });
            //选择纱织
            $(".selectYarn").live('click', function () {
                currentYarn = this;
                $.layer({
                    type: 2,
                    title: false,
                    shadeClose: false,
                    fix: false,
                    shift: 'top',
                    area: ['912px', 633],
                    iframe: {
                        src: '/UIPricing/FabricPricing/SelectYarn.aspx',
                        scrolling: 'no'
                    }
                });
            });
            //选择染织方法
            $("#dlproperty dd input").each(function (index) {
                $(this).click(function () {
                    var $dlNext = $("#dlproperty").next().next();
                    var $nextdt = $dlNext.find("dt");
                    var $nextdd = $dlNext.find("dd");
                    $nextdt.hide();
                    $nextdd.hide();
                    $($nextdt[index]).show();
                    $($nextdd[index]).show();
                });
            });
            //选择印花
            $("#spandyeing input").click(function () {
                var forclass = $(this).attr("forclass");
                var $lable = $("." + forclass);
                $lable.siblings("label").hide();
                $lable.siblings("label").find("input").addClass("ishide");
                $lable.show();
                $lable.find("input").first().prop("checked", true);
                $lable.find("input").removeClass("ishide");
            });

            //选择处理费用
            $(".costItem a").click(function () {
                var $eventItem = $(this);
                $eventItem.find('input').prop("checked", true);
                var addSpan = $eventItem.find('span').prop("outerHTML");
                $(".selectCost").show();
                $(".selectCost").append('<div class="fl hot-tag itemwidth">' + addSpan + ' <a title="点击删除" href="javascript:;" class="j_deltag  del-tag iconfont"></a> </div>');            
                $eventItem.hide();
            });
            //删除处理费用
            $(".selectCost a").live('click', function () {
                var $eventItem = $(this);
                var $costItem = $(".costItem ." + $eventItem.prev().attr("data-class"));
                $costItem.show();
                $costItem.find('input').prop("checked", false);
                $eventItem.parent().remove();
                var currentSelcect = $(".selectCost a");
                if (!currentSelcect || currentSelcect.length < 1) {
                    $(".selectCost").hide();
                }
            });

            c.submitFabricInit();

        },
        initSwDetail: function () {
            var c = this;
            //发布
            $(".axajaction").live("click", function () {
                var actionParam = $(this).attr('data-param');
                var eventItem = this;
                c.doAjax(c.actionUrl + '?' + actionParam, eventItem, function () {
                    $(eventItem).removeClass("axajaction");
                    $(eventItem).removeClass("btn-sub");
                    $(eventItem).html('已发布');
                    $(eventItem).attr("style", "background-color:#C0C0C0");
                    $("#spanUpdatetime").html('刚刚'); 
                });
            });
            //保存备注
            $(".j-save").click(function () {
                var actionParam = $(this).attr('data-param');
                var thisValue = $(this).parent().parent().find('.u-val').val();
                if (!thisValue) {
                    thisValue = "";
                }
                var $itemParent = $(this).parent().parent().parent();
                actionParam += encodeURIComponent(thisValue);
                var eventItem = this;
                c.doAjax(c.actionUrl + '?' + actionParam, eventItem, function () {
                    $itemParent.find(".u-textvalue").html(thisValue);
                    $itemParent.find(".z-status").show();
                    $itemParent.find(".z-edit").hide();
                    $("#spanUpdatetime").html('刚刚'); 
                });
            });
            //修改备注
            $(".u-edit").click(function (index) {
                $(this).parent().hide();
                $(this).parent().next().show();
            });

        },
        initList: function () {
            var c = this;
            //我的面料 添加样式
            $(".memberdesign").find('a').addClass("cur");
            //添加按钮事件
            $(".axajaction").click(function () {
                var actionParam = $(this).attr('data-param');
                var statusName = $(this).attr('data-status');
                var eventItem = this;
                var confirmMeg = $(this).attr('data-msg'); 
                c.tipsConfirm("<div style=\"width:80px; heihgt:30px; \"><div style=\"font-size:13px;\">" +confirmMeg + "</div><div><a href=\"javascript:;\" style=\"padding:0 6px; margin-left:2px;line-height:16px; border:none;\" class=\"btn-sub xubox_no confirmTrue\">确认</a><a href=\"javascript:;\" style=\"padding:0 6px; margin-left:5px;;line-height:16px; border:none;\" class=\"btn-sub xubox_no confirmfalse\">取消</a></div></div>", eventItem, 10);
                var $item = $(eventItem).parent().parent().parent();
                $('.confirmTrue').click(function () {
                    c.doAjax(c.actionUrl + '?' + actionParam, eventItem, function() {
                        layer.msg('操作成功!', 1, 1);
                        if (statusName) {
                           //删除按钮
                            $(eventItem).remove();
                            //更新当前状态
                            $item.find(".statusName").html(statusName);
                            //去除编辑按钮
                            $item.find(".edit").remove();
                            //重新渲染改变loading图片
                            $item.find(".loadingImg").attr("src", "/Static/images/DesignImg/renderer-loading.gif");
                        } else {
                            $item.remove();
                        }
                    });
                });
            });

            //延迟加载图片
            $('.lazy').lazyload({ effect: "fadeIn", threshold: 200 });

        }
    };
    module.exports = design;
});