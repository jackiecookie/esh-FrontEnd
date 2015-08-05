/*成品核价模块js*/
define(function (require, exports, module) {
    var singlePricingAshxPath = "/UIPricing/ashx/SinglePricingHandler.ashx";
    //同步加载依赖js
    require('jquery');
    require('smartFocus');
    require('lazyload');
    var urlParam = require('urlParam');
    require("jQueryAjax");
    var fancy = require('FancyRadioCheckBox');
    var laytpl = require("laytpl");
    var loginInfo = require('headJs').loginInfo;
    var dataMapping = require('js/common/DataMapping/DataMapping').DataBindings;
    require('js/app/Pricing/Port/PortPostionEx');
    require('customSelect');
    //异步加载依赖js
    var layer, zdk, showLoginForm;
    require.async(['layerExt', 'js/common/procopy/procopy', 'btnLoading', 'js/common/verify/verify', 'loginPanel'], function (obj1, obj2, obj3, obj4, obj5) {
        layer = obj1;
        zdk = obj2;
        zdk.btnLoading = obj3;
        zdk.verify = obj4;
        showLoginForm = obj5;
    });
    var pubEntry = {
        //单品核价款式列表加载（第一步选择款式尺寸）
        priceType: 1,
        //核价来源 1普通核价 2成品核价 3北京设计软件成品核价
        pricingType: 1,
        initStep1: function () {
            //当前核价类别
            var priceType = this.priceType;
            //当前核价来源
            var pricingType = this.pricingType;
            $('.lazy').lazyload({ effect: "fadeIn", threshold: 200 });
            //添加搜索框默认文字
            $("#txtName").smartFocus('请输入款式名称');
            //点击搜索按钮
            $(".submit").click(function () {
                var currentHref = location.href;
                location.href = urlParam.replaceUrlParams(currentHref,
                {
                    ksname: $.trim($("#txtName").val()) == "请输入款式名称" ? "" : $.trim($("#txtName").val()),
                    page: 1
                }
            );
            });
            //搜索展开分类
            $(".boult a").click(function () {
                var className = $(this).attr("class");
                if (className == "boult_a") {
                    $(this).attr("class", "boult_b");
                    $(this).html("<i></i>展开");
                    $(".classify").css("display", "none");
                } else {
                    $(this).attr("class", "boult_a");
                    $(this).html("<i></i>收起");
                    $(".classify").css("display", "block");
                }
            });
            //现有尺寸点击事件
            $(".kssize").click(function () {
                var e = $(this);
                //自由组合核价直接跳转
                if (priceType == "3") {
                    window.location = "freepriceing/greesuitegroup?ks=" + e.attr("data-ksid");
                    return;
                }
                //替换面料ID
                var fabricId = e.attr("data-fabricid");
                if (!fabricId) {
                    fabricId = "";
                }
                //成品ID
                var swId = e.attr("data-swid");
                if (!swId) {
                    swId = "";
                }
                $("#show-lining-tag").hide();
                $("#LiningSize").html("正在加载尺寸...");
                var layerSize = $.layer({
                    type: 1,
                    fadeIn: 300,
                    border: [0],
                    area: ['333px', 'auto'],
                    offset: [(e.offset().top - $(document).scrollTop() + $(e).height() + 12) + 'px', (e.offset().left - 90) + 'px'],
                    title: false,
                    fix: false,
                    page: { dom: '.nowsize' },
                    success: function () {  //尺寸弹出层打开后事件
                        $.ajaxjson(singlePricingAshxPath, { Action: "styleSize", ks_sysnumber: e.attr("data-ksid") },
                            function (d) {
                                //同步渲染 模板引擎
                                var noLiningTemplate = laytpl($("#noLiningTemplate").html()).render(d);
                                $("#LiningSize").html(noLiningTemplate);
                                //如果有里布的状态下 设置无里布为默认选中
                                if (d.SingleLining != null || d.DoubleLining != null) {
                                    $("#show-nolining-tag").show().addClass("ative").unbind("click").click(function () {
                                        $("#show-lining-tag > li >a ").removeClass();
                                        $("#LiningSize > ul").hide();
                                        $(this).addClass("ative");
                                        $("#nolining").show();
                                    });
                                }

                                //判断是否有单层里布
                                if (d.SingleLining != null) {
                                    $("#show-lining-tag").show();
                                    $("#show-singlelining-tag").show().unbind("click").click(function () {
                                        $("#show-lining-tag > li >a ").removeClass();
                                        $("#LiningSize > ul").hide();
                                        $(this).addClass("ative");
                                        $("#singlelining").show();
                                    });
                                    var singleLiningTemplate = laytpl($("#singleLiningTemplate").html()).render(d);
                                    $("#LiningSize").append(singleLiningTemplate);
                                }
                                //判断是否有双层里布
                                if (d.DoubleLining != null) {
                                    $("#show-lining-tag").show();
                                    $("#show-doublelining-tag").show().unbind("click").click(function () {
                                        $("#show-lining-tag > li >a ").removeClass();
                                        $("#LiningSize > ul").hide();
                                        $(this).addClass("ative");
                                        $("#doublelining").show();
                                    });
                                    var doubleLiningTemplate = laytpl($("#doubleLiningTemplate").html()).render(d);
                                    $("#LiningSize").append(doubleLiningTemplate);
                                }
                                //重新设置弹出层高度
                                layer.area(layerSize, { height: ($(".nowsize").height() + 10) + 'px' });
                                //美化复选框
                                fancy.init();
                                //下一步点击事件
                                $(".sizenext").unbind("click").click(function () {
                                    if (!loginInfo.isLogin) {
                                        showLoginForm();
                                        return;
                                    }
                                    var btn = $(this);
                                    var isCilck = zdk.btnLoading({
                                        obj: btn,
                                        addClass: "disabled",
                                        txt: '加载中'
                                    });
                                    if (!isCilck) {
                                        return;
                                    } else {
                                        layer.area(layerSize, { height: ($(".nowsize").height() + 15) + 'px' });
                                    }

                                    var tjList = "";
                                    $('input[name="chkSize"]:checked').each(function () {
                                        tjList += $(this).val() + "+";
                                    });
                                    if (tjList == "") {
                                        layer.alert("请先选择需要核价的尺码！", 0, !1);
                                        btn.removeClass('disabled');
                                        zdk.btnLoading.reset(btn);
                                        layer.area(layerSize, { height: ($(".nowsize").height() + 15) + 'px' });
                                        return;
                                    }
                                    //三维成品核价,北京设计软件安慰成品核价 直接跳转
                                    if (pricingType == 2 || pricingType == 3) {
                                        $("#iptKSSysnumber").val(e.attr("data-ksid"));
                                        $("#iptTJSysnumber").val(tjList);
                                        $("#iptFabricID").val(fabricId);
                                        $("#iptPricingType").val(pricingType);
                                        $("#iptDetailid").val(e.attr("data-detailid"));
                                        $("#iptSWID").val(swId);
                                        $("#iptPriceType").val(priceType);
                                        $("#gotoPricing").submit();
                                        btn.removeClass('disabled');
                                        zdk.btnLoading.reset(btn);
                                        layer.close(layerSize);
                                        return;
                                    }
                                    $.ajaxjson(singlePricingAshxPath, { Action: "sizeNext", ks_sysnumber: e.attr("data-ksid"), tjsysnumber: tjList, "pricetype": priceType },
                                        function (data) {
                                            if (!data.Success && data.Data == "-1") {
                                                showLoginForm();
                                            } else {
                                                if (data.Data == "0") {
                                                    layer.alert("加载失败，请联系网站客户解决问题！", 8, !1);

                                                } else {
                                                    window.location = "singlepricing/adjustparam?ks=" + data.Data + "&pricetype=" + priceType;
                                                }
                                            }
                                            btn.removeClass('disabled');
                                            zdk.btnLoading.reset(btn);
                                            layer.area(layerSize, { height: ($(".nowsize").height() + 15) + 'px' });

                                        }, { IsShowLoading: false });

                                });


                            }, { IsShowLoading: false });
                    },
                    //尺寸弹出层关闭事件
                    close: function (index) {
                        $("#show-lining-tag > li >a ").removeClass();
                        $("#LiningSize > ul").hide();
                    }
                });
            });

        },
        /////////////////////////////////////////////////第二步页面加载事件//////////////////////////////////////////
        initStep2: function () {
            //加载参数信息
            var kssysnumber = urlParam.getParam("ks");
            var priceType = urlParam.getParam("pricetype");
            //成品核价 成品ID
            var swID = urlParam.getParam("swID");
            //核价来源1普通核价 2成品核价 3北京设计软件成品核价
            var pricingType = urlParam.getParam("pricingType");
            //原款式ID
            var sourceksid = urlParam.getParam("sourceksid");
            //成品产品明细ID
            var detailid = urlParam.getParam("detailid");
            $.ajaxjson(singlePricingAshxPath, { Action: "loadParam", ks_sysnumber: kssysnumber },
           function (d) {
               if (priceType == "3") {
                   $("#btn-return").attr("href", "/freepriceing/greesuitegroup?ks=" + d.Data.Style.OLDSYSNUMBER);
               }
               //绑定文本框数据
               dataMapping(d.Data.Taxrate);
               if (d.Data.Taxrate.TWENTYOCEANPRICE == 0) {
                   $("#txtTwentyPrice").val("");
               }
               if (d.Data.Taxrate.FORTYOCEANPRICE == 0) {
                   $("#txtFortyPrice").val("");
               }
               if (d.Data.Taxrate.SHIPCOMPANY != null && d.Data.Taxrate.SHIPCOMPANY !== "") {
                   $("#show-shipcompany").show();
               }
               //绑定LDP出口税率国家
               var optionStr = "";
               for (var i = 0; i < d.Data.ListTariffs.length; i++) {
                   optionStr += "<option value=\"" + d.Data.ListTariffs[i]["IMPORTTARIFFS"] + "\">" + d.Data.ListTariffs[i]["COUNTRY"] + "</option>";
               }
               $("#slcountry").empty().append(optionStr);
               $("#slcountry option:contains('" + d.Data.Taxrate.SLCOUNTRY + "')").attr('selected', true);
               //款式尺码同步渲染 模板引擎
               var styleSzieTemplate;
               //判断是单品核价还是套件核价
               if (priceType == "1") {
                   styleSzieTemplate = laytpl($("#SingleStyleSzieTemplate").html()).render(d);
               }
               else if (priceType == "2") {
                   styleSzieTemplate = laytpl($("#SuiteStyleSzieTemplate").html()).render(d);
               } else {
                   styleSzieTemplate = laytpl($("#FreeStyleSzieTemplate").html()).render(d);
               }
               $("#style-size").html(styleSzieTemplate);
               //主要面料同步渲染 模板引擎
               var mianFabricTemplate = laytpl($("#MianFabricTemplate").html()).render(d);
               $("#mian-fabric").html(mianFabricTemplate);
               if (d.Data.ListAccessory != null && d.Data.ListAccessory.length > 0) {
                   $("#show-mian-accessory").show();
                   //主要面料同步渲染 模板引擎
                   var mianAccessoryTemplate = laytpl($("#MianAccessoryTemplate").html()).render(d);
                   $("#mian-accessory").html(mianAccessoryTemplate);
               }
               $("#show-loading").remove();
               $("#show-styleinfo").show();
               //fob税率信息输入验证
               $("#fob-taxrate input[type=text]").live('keyup', function () {
                   if (!zdk.verify.type.double($(this).val())) {
                       zdk.verify.showErroTip($(this), '请输入正确数字！');
                   }
                   (this).focus();
                   $(this).val($(this).val().replace(/[^0-9.]/g, ""));
               });
               //海运费单价输入验证
               $("#txtTwentyPrice,#txtFortyPrice").live('keyup', function () {
                   if (!zdk.verify.type.double($(this).val())) {
                       zdk.verify.showErroTip($(this), '请输入正确数字！');
                   }
                   (this).focus();
                   $(this).val($(this).val().replace(/[^0-9.]/g, ""));
               });
               //LDP输入验证
               $("#show-ldp-rate input[type=text]").live('keyup', function () {
                   if (!zdk.verify.type.double($(this).val())) {
                       zdk.verify.showErroTip($(this), '请输入正确数字！');
                   }
                   (this).focus();
                   $(this).val($(this).val().replace(/[^0-9.]/g, ""));
               });

               //是否CIF核价
               if (d.Data.Style.ISCIF == "1") {
                   $("#show-oceanfreight-price").show();
                   $("#chkcif").attr("checked", true);
               };

               //是否CIF核价
               if (d.Data.Style.ISLDP == "1") {
                   $("#show-oceanfreight-price").show();
                   $("#show-ldp-rate").show();
                   $("#chkldp").attr("checked", true);
                   //美化出口税率国家下拉框添加选择事件
                   $("#slcountry").customSelect({ width: 95 }).change(function () {
                       $("#txtSLIMPORT").val($(this).val());
                       $("#hidSLCOUNTRY").val($(this).find("option:selected").text());
                   });
               };
               //美化复选框
               fancy.init();




           }, { IsShowLoading: false });

            //收缩展开类目
            $(".show-expand").click(function () {
                var e = $(this);
                e.parent().parent().children().eq(1).slideToggle(function () {
                    if (e.text() == "[点击收缩]") {
                        e.text("[点击展开]");
                    } else {
                        e.text("[点击收缩]");
                    }
                });
            });
            //勾选cif核价
            $("#chkcif").click(function () {
                if ($(this).attr("checked") == "checked") {
                    if ($("#chkldp").attr("checked") != "checked") {
                        $("#show-oceanfreight-price").fadeIn("slow");
                    }
                } else {
                    if ($("#chkldp").attr("checked") != "checked") {
                        $("#show-oceanfreight-price").fadeOut("slow");
                    }
                }
            });
            //勾选ldp核价
            $("#chkldp").click(function () {
                if ($(this).attr("checked") == "checked") {
                    if ($("#chkcif").attr("checked") != "checked") {
                        $("#show-oceanfreight-price").fadeIn("slow");
                    }
                    $("#show-ldp-rate").fadeIn("slow");
                    //美化出口税率国家下拉框添加选择事件
                    //.unbind("change")  潘迪海注释unbind  在IE下由于无法正常工作,IE下只绑定了mouseup  介入过早无法获得准确的值
                    $("#slcountry").customSelect({ width: 95 }).change(function () {
                        $("#txtSLIMPORT").val($(this).val());
                        $("#hidSLCOUNTRY").val($(this).find("option:selected").text());
                    });

                } else {
                    if ($("#chkcif").attr("checked") != "checked") {
                        $("#show-oceanfreight-price").fadeOut("slow");
                    }
                    $("#show-ldp-rate").fadeOut("slow");
                }
            });

            //出运港自动补全事件
            $("#txtCYG").positionEx({
                suggesttype: "startPort_suggest",
                sourcetype: "startPort_All"
            });
            //目的港自动补全事件
            $("#txtMDG").positionEx({
                suggesttype: "endPort_suggest",
                sourcetype: "port_source"
            });
            //海运费“确定按钮事件”
            $("#a-oceanfreight-price").on('click', function () {
                if ($.trim($("#txtCYG").val()) == "") {
                    zdk.verify.showErroTip($("#txtCYG"), '请先输入起运港！');
                    return;
                }
                if ($.trim($("#txtMDG").val()) == "") {
                    zdk.verify.showErroTip($("#txtMDG"), '请先输入目的港！');
                    return;
                }
                var loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
                $.ajaxjson(singlePricingAshxPath, { Action: "getOceanFreight", startgk: $("#txtCYG").val(), endgk: $("#txtMDG").val() },
                   function (d) {
                       if (d.Success) {
                           $("#txtTwentyPrice").val(d.Data[0].GP20);
                           $("#txtFortyPrice").val(d.Data[0].GP40);
                           $("#b-shipcompany").text(d.Data[0].SHIPCOMPANY == null ? "未知" : d.Data[0].SHIPCOMPANY);
                           $("#hidSHIPCOMPANY").val(d.Data[0].SHIPCOMPANY == null ? "未知" : d.Data[0].SHIPCOMPANY);
                           $("#b-ocrandate").text(d.Data[0].YXSJ);
                           $("#hidOCEANDATA").val(d.Data[0].YXSJ);
                           $("#show-shipcompany").show();
                       } else {
                           layer.alert("没有取到该海运费的最新价格，建议重新选择其它港口重新获取或者手动输入海运费价格！", 8, !1);
                           $("#txtTwentyPrice").val("");
                           $("#txtFortyPrice").val("");
                           $("#show-shipcompany").hide();
                           $("#hidSHIPCOMPANY").val("");
                           $("#hidOCEANDATA").val("");
                       }
                       layer.close(loadi);
                   }, { IsShowLoading: false });
            });
            //出口税率选择 弹出层
            $("#alert-ldp-rate").click(function () {
                $.layer({
                    type: 2,
                    title: '出口税率信息查询',
                    shadeClose: false,
                    fix: false,
                    shift: 'top',
                    area: ['912px', 606],
                    iframe: {
                        src: '/UIPricing/ProductPricing/OceanFreight.aspx?r=' + Math.random(),
                        scrolling: 'no'
                    }
                });
            });
            //产品辅料信息查看修改
            $(".a-project-accessory").live('click', function () {
                var loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
                var proId = $(this).attr("data-proId");
                //款式ID和产品类型ID（如果是替换所有尺寸辅料是用到）
                var styleId = $(this).attr("data-styleId");
                var cpbtId = $(this).attr("data-cpbtId");
             //产品类型名称（用于筛选辅料的适用范围）
//                var cpbtName = $(this).attr("data-cpbtName");

                //清空包装辅料
                $("#suite-accessory").html("");
                //清空已选择项
                existingAccessory.length = 0;
                $.ajaxjson(singlePricingAshxPath, { Action: "getProductAccessory", proId: proId },
                   function (d) {
                       //款式尺码同步渲染 模板引擎
                       var productAccessory = laytpl($("#AccessoryTemplate").html()).render(d);
                       $("#project-accessory").html(productAccessory);
                       //打开产品辅料信息
                       crtAccessoryLayer = $.layer({
                           title: "产品辅料信息",
                           type: 1,   //0-4的选择,
                           shadeClose: false,
                           fix: false,
                           btns: 2,
                           btn: ['保存', '关闭'],
                           shift: 'top',
                           area: ['auto', 'auto'],
                           page: {
                               dom: '#show-project-accessory'
                           },
                           success: function (layero) {
                               layer.close(loadi);
                               //设置点击“新增”按钮辅料类型 1代表产品辅料 2代表包装辅料
                               $("#a-show-Accessory").attr("data-type", "1");

//                               $("#a-show-Accessory").attr("data-cpbtName", cpbtName);
                           },
                           //保存事件
                           yes: function () {
                               var isEmpty = false;
                               $("#project-accessory input[name='txtAccessoryPrice'],input[name='txtAccessoryQuantity']").each(function () {
                                   if ($.trim($(this).val()) == "") {
                                       isEmpty = true;
                                       zdk.verify.showErroTip($(this), '请输入正确数字！');
                                       return;
                                   }
                               });
                               if (isEmpty) {
                                   return;
                               }
                               var btn = $(".xubox_botton2");
                               var isCilck = zdk.btnLoading({
                                   obj: btn,
                                   addClass: "disabled",
                                   txt: '保存中'
                               });
                               if (!isCilck) {
                                   return;
                               }
                               //是否替换所有尺寸同类型产品产的品辅料
                               var isApplyAll = $("#chk-projectaccessory-applyall").attr("checked") == "checked" ? "1" : "0";
                               var ajaxpath = singlePricingAshxPath + '?Action=saveProductAccessory&proId=' + proId + '&isApplyAll=' + isApplyAll + '&styleId=' + styleId + '&cpbtId=' + cpbtId;
                               $.ajaxSubmit(ajaxpath, $("#form-project-accessory"),
                                function (d) {
                                    if (d.Success) {
                                        layer.msg('产品辅料保存成功', 2, { type: 1, shade: false, rate: 'top' });
                                    } else {
                                        layer.alert("保存产品辅料失败，请联系网站客服！", 8, !1);
                                    }
                                    btn.removeClass('disabled');
                                    zdk.btnLoading.reset(btn);
                                    layer.close(crtAccessoryLayer);

                                }, { IsShowLoading: false });

                           }
                       });

                   }, { IsShowLoading: false });
            });
            //包装辅料信息查看修改
            $(".a-suite-accessory").live('click', function () {
                var loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
                var suiteId = $(this).attr("data-suiteId");
                //款式ID如果是替换所有尺寸辅料是用到
                var styleId = $(this).attr("data-styleId");
                //清空产品辅料
                $("#project-accessory").html("");
                //清空已选择项
                existingAccessory.length = 0;
                $.ajaxjson(singlePricingAshxPath, { Action: "getSuiteAccessory", suiteId: suiteId },
                   function (d) {
                       //款式尺码同步渲染 模板引擎
                       var productAccessory = laytpl($("#AccessoryTemplate").html()).render(d);
                       $("#suite-accessory").html(productAccessory);
                       crtAccessoryLayer = $.layer({
                           title: "包装辅料信息",
                           type: 1,   //0-4的选择,
                           shadeClose: false,
                           fix: false,
                           btns: 2,
                           btn: ['保存', '关闭'],
                           shift: 'top',
                           area: ['auto', 'auto'],
                           page: {
                               dom: '#show-suite-accessory'
                           },
                           success: function (layero) {
                               layer.close(loadi);
                               //设置点击“新增”按钮辅料类型 1代表产品辅料 2代表包装辅料
                               $("#a-show-Accessory").attr("data-type", "2");
                           },
                           //保存事件
                           yes: function () {
                               var isEmpty = false;
                               $("#project-accessory input[name='txtAccessoryPrice'],input[name='txtAccessoryQuantity']").each(function () {
                                   if ($.trim($(this).val()) == "") {
                                       isEmpty = true;
                                       zdk.verify.showErroTip($(this), '请输入正确数字！');
                                       return;
                                   }

                               });
                               if (isEmpty) {
                                   return;
                               }
                               var btn = $(".xubox_botton2");
                               var isCilck = zdk.btnLoading({
                                   obj: btn,
                                   addClass: "disabled",
                                   txt: '保存中'
                               });
                               if (!isCilck) {
                                   return;
                               }
                               //是否替换所有尺寸的包装辅料
                               var isApplyAll = $("#chk-suiteaccessory-applyall").attr("checked") == "checked" ? "1" : "0";
                               var ajaxpath = singlePricingAshxPath + '?Action=saveSuiteAccessory&suiteId=' + suiteId + '&isApplyAll=' + isApplyAll + '&styleId=' + styleId;
                               $.ajaxSubmit(ajaxpath, $("#form-suite-accessory"),
                                   function (d) {
                                       if (d.Success) {
                                           layer.msg('包装辅料保存成功', 2, { type: 1, shade: false, rate: 'top' });
                                       } else {
                                           layer.alert("保存包装辅料失败，请联系网站客服！", 8, !1);
                                       }
                                       btn.removeClass('disabled');
                                       zdk.btnLoading.reset(btn);
                                       layer.close(crtAccessoryLayer);
                                   }, { IsShowLoading: false });
                           }

                       });

                   }, { IsShowLoading: false });
            });
            //输入数字验证
            $("input[name='txtAccessoryPrice'],input[name='txtAccessoryQuantity']").live('keyup', function () {
                if (!zdk.verify.type.double($(this).val())) {
                    zdk.verify.showErroTip($(this), '请输入正确数字！');
                }
                (this).focus();
                $(this).val($(this).val().replace(/[^0-9.]/g, ""));

            });
            //辅料价格输入完成事件
            $("input[name='txtAccessoryPrice']").live('change', function () {
                if ($.trim($(this).val()) == "") {
                    zdk.verify.showErroTip($(this), '请输入正确数字！');
                    return;
                }
                var price = parseFloat($(this).val());
                var quantity = parseFloat($(this).parent().parent().children().eq(3).children().val());
                var cost = Math.round((price * quantity) * 100) / 100;
                $(this).parent().parent().children().eq(5).children(1).text(cost);
                $(this).parent().parent().children().eq(5).children(2).val(cost);

            });
            //辅料耗用数量输入完成事件
            $("input[name='txtAccessoryQuantity']").live('change', function () {
                if ($.trim($(this).val()) == "") {
                    zdk.verify.showErroTip($(this), '请输入正确数字！');
                    return;
                }
                var quantity = parseFloat($(this).val());
                var price = parseFloat($(this).parent().parent().children().eq(2).children().val());
                var cost = Math.round((price * quantity) * 100) / 100;
                $(this).parent().parent().children().eq(5).children(1).text(cost);
                $(this).parent().parent().children().eq(5).children(2).val(cost);


            });
            //辅料新增事件（打开辅料列表）
            $("#a-show-Accessory").live('click', function () {
                //类别 1代表产品辅料，2包装辅料
                var type = $("#a-show-Accessory").attr("data-type");
                $.layer({
                    type: 2,
                    title: type == "1" ? "产品辅料查询" : "包装辅料查询",
                    shadeClose: false,
                    fix: false,
                    shift: 'top',
                    area: ['912px', 606],
                    iframe: {
                        src: '/UIPricing/ProductPricing/Accessory.aspx?accessoryType=' + type + '&r=' + Math.random(),
                        scrolling: 'no'
                    }
                });
            });
            //辅料删除事件
            $("#a-del-Accessory").live('click', function () {
                //类别 1代表产品辅料，2包装辅料
                var type = $("#a-show-Accessory").attr("data-type");
                var checked = $('input[name="chk-accessory"]:checked');
                var selectCount = checked.length;
                if (selectCount < 1) {
                    layer.alert("请至少选择一条辅料进行删除！", 0, !1);
                } else {
                    checked.each(function () {
                        existingAccessory.splice($.inArray($(this).val(), existingAccessory), 1);
                        $(this).parent().parent().remove();
                    });
                }
                var chkNum = $('input[name="chk-accessory"]').length;
                if (chkNum == 0) {
                    document.getElementById("tab-accessory-btn").setAttribute("rowSpan", 2);
                    $("#tab-accessory").append("<tr><td  colspan=\"8\">暂无添加相关产品附件辅料信息,点击“新增”添加辅料！</td></tr>");
                } else {
                    document.getElementById("tab-accessory-btn").setAttribute("rowSpan", chkNum + 1);
                }
                var layerHeight = (type == "1" ? $("#show-project-accessory").height() : $("#show-suite-accessory").height()) + 36;
                layer.area(crtAccessoryLayer, { height: layerHeight });
            });
            //辅料全选事件
            $("#chk-accessory-all").live('click', function () {
                if ($(this).attr("checked") == true || $(this).attr("checked") == "checked") {
                    $("input[name='chk-accessory']").each(function () {
                        $(this).attr("checked", true);
                    });
                }
                else {
                    $("input[name='chk-accessory']").each(function () {
                        $(this).attr("checked", false);
                    });
                }

            });
            //纸箱信息查看修改
            $(".a-suite-volume").live('click', function () {
                var suiteId = $(this).attr("data-suiteId");
                var tjkcpId = $(this).attr("data-tjkcpId");
                $.layer({
                    type: 2,
                    title: "体积信息查看修改",
                    shadeClose: false,
                    fix: false,
                    btns: 2,
                    btn: ['保存', '关闭'],
                    shift: 'top',
                    area: ['650px', "300px"],
                    iframe: {
                        src: '/UIPricing/ProductPricing/Volume.aspx?suiteId=' + suiteId + '&r=' + Math.random(),
                        scrolling: 'no'
                    },
                    //确定事件
                    yes: function (index) {
                        var btn = $(".xubox_botton2");
                        var isCilck = zdk.btnLoading({
                            obj: btn,
                            addClass: "disabled",
                            txt: '保存中'
                        });
                        if (!isCilck) {
                            return;
                        }
                        $.ajaxSubmit(singlePricingAshxPath + '?Action=saveVolume&suiteId=' + suiteId + '&tjkcpId=' + tjkcpId, layer.getChildFrame("#form-volume", index),
                            function (d) {
                                if (d.Success) {
                                    layer.msg('修改体积数据成功！', 2, { type: 1, shade: false, rate: 'top' });
                                    layer.close(index);
                                } else {
                                    if (d.Message != "") {
                                        layer.alert(d.Message, 8, !1);
                                    }
                                    else if (d.Data == "1") {
                                        layer.alert("体积属性设置不合理，请重新选择每箱数量或其他属性再进行保存！", 8, !1);
                                    } else {
                                        layer.alert("修改体积数据失败，请联系网站客服帮您解决问题！", 8, !1);
                                    }
                                }
                                btn.removeClass('disabled');
                                zdk.btnLoading.reset(btn);
                            }, { IsShowLoading: false });
                    }

                });
            });
            //主要面料门幅
            $('input[name="FabricWidthCm"]').live('keyup', function () {
                if (!zdk.verify.type.positiveInt($(this).val())) {
                    zdk.verify.showErroTip($(this), '请输入正确的门幅，只能输入正整数');
                    var a = $(this).val();
                    //数字开头不能为0。
                    for (var i = 0; i < $(this).val().length; i++) {
                        if (a.length > 0 && a.substring(0, 1) == "0") {
                            a = a.substring(1, a.length);
                        } else {
                            break;
                        }
                    }
                    $(this).val(a.replace(/[\D]/g, ""));
                    return false;
                }
                if (parseInt($(this).val()) > 310) {
                    zdk.verify.showErroTip($(this), '面料门幅不能大于310厘米，请重新输入门幅');
                    $(this).val("");
                }
            });
            //当值改版时获取用输入的门幅价格
            $('input[name="FabricWidthCm"]').live('change', function () {
                if ($.trim($(this).val()) == "" || parseInt($(this).val()) <= 0) {
                    return;
                }
                var obj = $(this);
                var fabricId = $(this).parent().parent().find("[name='FabricSysnumber']").val();
                var widthCm = $(this).val();
                var loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
                $.ajaxjson(singlePricingAshxPath, { Action: "getWidthCmPrice", fabricId: fabricId, widthCm: widthCm },
                     function (d) {
                         if (d.Success) {
                             layer.tips('<div style="text-align: center;">面料门幅修改成功！<br/>面料价格为： ¥' + d.Data + ' 元/每米<div>', obj, {
                                 style: ['background-color:#F26C4F; color:#fff', '#F26C4F'],
                                 closeBtn: [0, true],
                                 time: 3
                             });
                             obj.parent().find("[name='FabricPrice']").val(d.Data);
                         } else {
                             layer.tips('<div style="text-align: center;">核价失败！<br/>请手动输入面料价格，或者联系网站客服帮您解决此问题！<div>', obj, {
                                 style: ['background-color:#F26C4F; color:#fff', '#F26C4F'],
                                 closeBtn: [0, true]

                             });
                             obj.parent().find("[name='FabricPrice']").val("");
                         }
                         layer.close(loadi);
                     },
                     { IsShowLoading: false });

            });

            //主要面料价格
            $('input[name="FabricPrice"]').live('keyup', function () {
                if (!zdk.verify.type.double($(this).val())) {
                    zdk.verify.showErroTip($(this), '请输入正确价格，只能为数字！');
                }
                (this).focus();
                $(this).val($(this).val().replace(/[^0-9.]/g, ""));
            });

            //面料替换
            $(".a-fabric").live('click', function () {
                crtFabric = $(this);
                $.layer({
                    type: 2,
                    title: "面料选择",
                    shadeClose: false,
                    fix: false,
                    shift: 'top',
                    area: ['1005px', 900],
                    iframe: {
                        src: '/UIDesign/SelectFabric?r=' + Math.random(),
                        scrolling: 'no'
                    }
                });

            });

            //主要辅料耗用数量输入验证
            $('input[name="CutAccessoryCount"]').live('keyup', function () {
                if (!zdk.verify.type.positiveInt($(this).val())) {
                    zdk.verify.showErroTip($(this), '请输入正确的数量，只能输入正整数');
                    var a = $(this).val();
                    //数字开头不能为0。
                    for (var i = 0; i < $(this).val().length; i++) {
                        if (a.length > 0 && a.substring(0, 1) == "0") {
                            a = a.substring(1, a.length);
                        } else {
                            break;
                        }
                    }
                    $(this).val(a.replace(/[\D]/g, ""));
                    return false;
                }
            });
            //主要辅料单价和填充数量输入验证
            $('input[name="CutAccessoryPrice"],input[name="CutAccessoryWeight"]').live('keyup', function () {
                if (!zdk.verify.type.double($(this).val())) {
                    if ($(this).attr("name") == "CutAccessoryPrice") {
                        zdk.verify.showErroTip($(this), '请输入正确的单价，只能为数字！');
                    } else {
                        zdk.verify.showErroTip($(this), '请输入正确的填充重量，只能为数字！');
                    }
                }
                (this).focus();
                $(this).val($(this).val().replace(/[^0-9.]/g, ""));
            });


            //主要辅料输入框改变事件
            $('input[name="CutAccessoryPrice"],input[name="CutAccessoryWeight"],input[name="CutAccessoryCount"]').live('change', function () {

                if ($.trim($(this).val()) == "") {
                    zdk.verify.showErroTip($(this), '此项不能为空！');
                    return;
                }

                var price = parseFloat($(this).parent().parent().find("[name='CutAccessoryPrice']").val()); //辅料单价
                if ($(this).attr("name") == "CutAccessoryCount" || $(this).attr("name") == "CutAccessoryWeight") {
                    var accessorydosage;
                    if ($(this).attr("name") == "CutAccessoryCount") {
                        accessorydosage = parseFloat($(this).parent().parent().find("[name='CutAccessoryCount']").val()); //辅料耗用数量 个 只 枚等
                    } else {
                        accessorydosage = parseFloat($(this).parent().parent().find("[name='CutAccessoryWeight']").val()); //辅料耗用数量 公斤填充重量
                    }
                    $(this).parent().parent().find("[id^='span-cutaccessorydosage-']").text(accessorydosage);
                    $(this).parent().parent().find("[name='hidCutAccessoryDosage']").val(accessorydosage);
                }

                var dosage = parseFloat($(this).parent().parent().find("[name='hidCutAccessoryDosage']").val()); //辅料用量
                var cost = Math.round((dosage * price) * 100) / 100; //辅料成本
                layer.tips('<div style="text-align: center;">修改成功！<br/>辅料成本为： ¥' + cost + ' 元<div>', $(this), {
                    style: ['background-color:#F26C4F; color:#fff', '#F26C4F'],
                    closeBtn: [0, true],
                    time: 3
                });
                $(this).parent().parent().find("[id^='span-cutaccessorycost-']").text(cost);
                $(this).parent().parent().find("[name='hidCutAccessoryCost']").val(cost);
            });

            //主要替换辅料事件(打开辅料列表)
            $('.a-cutaccessory').live('click', function () {
                crtMainAccessory = $(this);      //当前选择项
                var cpname = $(this).attr("data-proname"); //单品名称用于查找试用范围
                var typeid = $(this).attr("data-typeid"); //辅料分类id

                $.layer({
                    type: 2,
                    title: "辅料查询",
                    shadeClose: false,
                    fix: false,
                    shift: 'top',
                    area: ['912px', 606],
                    iframe: {
                        src: '/UIPricing/ProductPricing/Accessory.aspx?accessoryType=1&r=' + Math.random() + "&model=cut",
                        scrolling: 'no'
                    }
                });
            });


            //核价按钮事件
            $("#btn-pricing").click(function () {
                var isVerify = true;
                //fob税率信息输入验证
                $("#fob-taxrate input[type=text]").each(function () {
                    if (!zdk.verify.type.double($(this).val())) {
                        zdk.verify.showErroTip($(this), '请输入正确数字！');
                        isVerify = false;
                        return false;
                    }
                });
                if (!isVerify) {
                    return;
                }
                //海运费验证
                if ($("#chkcif").attr("checked") == "checked" || $("#chkldp").attr("checked") == "checked") {
                    //海运费单价输入验证
                    $("#txtTwentyPrice,#txtFortyPrice").each(function () {
                        if (!zdk.verify.type.double($(this).val())) {
                            zdk.verify.showErroTip($(this), '请输入正确数字！');
                            isVerify = false;
                            return false;
                        }


                    });
                }
                if (!isVerify) {
                    return;
                }
                //LDP税率信息验证
                if ($("#chkldp").attr("checked") == "checked") {
                    //LDP输入验证
                    $("#show-ldp-rate input[type=text]").each(function () {
                        if (!zdk.verify.type.double($(this).val())) {
                            zdk.verify.showErroTip($(this), '请输入正确数字！');
                            isVerify = false;
                            return false;
                        }

                    });
                }
                if (!isVerify) {
                    return;
                }

                //面料门幅价格验证
                $("#mian-fabric input[type=text]").each(function () {
                    if ($.trim($(this).val()) == "") {
                        if ($(this).attr("name") == "FabricWidthCm") {
                            zdk.verify.showErroTip($(this), '请输入正确的面料门幅，只能为正整数！');
                        } else {
                            zdk.verify.showErroTip($(this), '请输入正确的面料价格，只能为数字！');
                        }

                        isVerify = false;
                        return false;
                    }

                });
                if (!isVerify) {
                    return;
                }
                var btn = $(this);
                var isCilck = zdk.btnLoading({
                    obj: btn,
                    addClass: "disabled",
                    txt: '正在核价'
                });
                if (!isCilck) {
                    return;
                }

                $.ajaxSubmit(singlePricingAshxPath + '?Action=price&ks_sysnumber=' + kssysnumber + "&pricingType=" + pricingType + "&detailid=" + detailid + "&swID=" + swID + "&sourceksid=" + sourceksid, $("#form-save-all"),
                    function (d) {
                        if (d.Success) {
                            //成品核价,北京设计软件成品核价 跳转到款式清单
                            if (pricingType == 2 || pricingType == 3) {
                                window.location = "/membercenter/swstyleslist?itemID=" + swID + "&pricingType=" + pricingType;
                            }
                            else {
                                window.location = "/singlepricing/singleresult?ks=" + kssysnumber + "&pricetype=" + priceType;
                            }
                        } else {
                            if (d.Data == "-1") {
                                showLoginForm();
                            }
                            else {
                                layer.alert("核价失败，请联系网站客服帮您解决此问题！", 8, !1);
                            }
                        }
                        btn.removeClass('disabled');
                        zdk.btnLoading.reset(btn);


                    }, { IsShowLoading: false });



            });


        },
        /////////////////////////////////////////////////自由组合第二步页面加载事件//////////////////////////////////////////
        freeSuiteGroup: function () {
            //加载参数信息
            var kssysnumber = urlParam.getParam("ks");
            var suiteId;
            $.ajaxjson(singlePricingAshxPath, { Action: "freeSuiteGroup", ks_sysnumber: kssysnumber },
            function (d) {
                $("#show-loading").remove();
                $("#show-freesuitegroup").show();
                if (d.Success) {
                    $("#size-freesuitegroup").append(d.Data.sizeStr);
                    suiteId = d.Data.suiteId;
                    //美化单选按钮
                    fancy.init();
                }

            }, { IsShowLoading: false });

            //删除分组
            $(".delgroup").live('click', function () {
                var l = $("table tr").length;
                var tdSeq = $(this).parent().parent().find("td").index($(this).parent()[0]);
                for (var i = 0; i < l; i++) {
                    $("table tr").eq(i).find("td,th").eq(tdSeq).remove();

                }
            });
            //单品数量验证
            $('input[name="txtPack"]').live('keyup', function () {
                if (!zdk.verify.type.positiveInt($(this).val())) {
                    zdk.verify.showErroTip($(this), '请输入正确的单品数量，只能输入正整数');
                    var a = $(this).val();
                    //数字开头不能为0。
                    for (var i = 0; i < $(this).val().length; i++) {
                        if (a.length > 0 && a.substring(0, 1) == "0") {
                            a = a.substring(1, a.length);
                        } else {
                            break;
                        }
                    }
                    $(this).val(a.replace(/[\D]/g, ""));
                    return false;
                }

            });
            //更改单品款式
            $(".show-singleitem").live('click', function () {
                currentPro = $(this);
                var styleType = $(this).attr("data-styletype");
                var proCount = $(this).attr("data-procount");
                $.layer({
                    type: 2,
                    title: "同类单品选择",
                    shadeClose: false,
                    fix: false,
                    shift: 'top',
                    area: ['1010px', 750],
                    iframe: {
                        src: '/UIPricing/ProductPricing/SelectStyle.aspx?styletype=' + styleType + '&productcount=' + proCount + '&r=' + Math.random(),
                        scrolling: 'no'
                    }
                });
            });
            //下一步
            $("#btn-freegroup-step").click(function () {

                var isVerify = true;
                //单品数量验证
                $('input[name="txtPack"]').each(function () {
                    if (!zdk.verify.type.positiveInt($(this).val())) {
                        zdk.verify.showErroTip($(this), '请输入正确数字！');
                        isVerify = false;
                        return false;
                    }
                });
                if (!isVerify) {
                    return;
                }
                var btn = $(this);
                var isCilck = zdk.btnLoading({
                    obj: btn,
                    addClass: "disabled",
                    txt: '正在加载'
                });
                if (!isCilck) {
                    return;
                }
                $.ajaxSubmit(singlePricingAshxPath + '?Action=freeGroupStep&styleid=' + kssysnumber + '&suiteId=' + suiteId, $("#form-freegroup-step"),
                    function (d) {
                        if (d.Success) {
                            window.location = "/singlepricing/adjustparam?ks=" + d.Data + "&pricetype=3";
                        } else {
                            if (d.Data == "-1") {
                                showLoginForm();
                            }
                            else {
                                layer.alert("核价失败，请联系网站客服帮您解决此问题！", 8, !1);
                            }
                        }
                        btn.removeClass('disabled');
                        zdk.btnLoading.reset(btn);

                    }, { IsShowLoading: false });
            });

        },
        /////////////////////////////////////////////////第三步页面加载事件//////////////////////////////////////////
        initStep3: function () {
            //核价类型
            var priceType = urlParam.getParam("pricetype");
            //加载参数信息
            var kssysnumber = urlParam.getParam("ks");
            $.ajaxjson(singlePricingAshxPath, { Action: "loadResult", ks_sysnumber: kssysnumber, pricetype: priceType },
            function (d) {
                //款式尺码同步渲染 模板引擎
                var resultTemplate;
                if (priceType == "1") {
                    resultTemplate = laytpl($("#SingleResultTemplate").html()).render(d);
                } else if (priceType == "2") {
                    resultTemplate = laytpl($("#SuiteResultTemplate").html()).render(d);
                } else {
                    resultTemplate = laytpl($("#FreeResultTemplate").html()).render(d);
                }
                $("#div-result").html(resultTemplate);
                $("#show-loading").remove();
                $("#show-result").show();
            }, { IsShowLoading: false });

            $("#btn-collect").live('click', function () {
                layer.prompt({ title: '请填写收藏名称', type: 3, length: 250 }, function (name, index) {

                    var btn = $(".xubox_botton2");
                    var isCilck = zdk.btnLoading({
                        obj: btn,
                        addClass: "disabled",
                        txt: '保存中'
                    });
                    if (!isCilck) {
                        return;
                    }
                    $.ajaxjson(singlePricingAshxPath, { Action: "addCollect", styleId: kssysnumber, pricetype: priceType, collectname: name },
                        function (d) {
                            //款式尺码同步渲染 模板引擎
                            if (d.Success) {
                                if (d.Success) {
                                    layer.close(index);
                                    layer.msg('核价结果收藏成功，在会员中心“我的核价”中查看！', 2, { type: 1, shade: false, rate: 'top' });
                                } else {
                                    if (d.Data == "-1") {
                                        showLoginForm();
                                    }
                                    else {
                                        layer.alert("核价结果收藏失败！", 8, !1);
                                    }
                                }
                            }
                            btn.removeClass('disabled');
                            zdk.btnLoading.reset(btn);
                        }, { IsShowLoading: false });

                });
            });


        }


    };
    module.exports = pubEntry;
});


