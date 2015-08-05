/*面料核价模块js*/
define(function (require, exports, module) {
    var fabricPricingAshxPath = "/UIPricing/ashx/FabricPricingHandler.ashx";
    //同步加载依赖js
    require('jquery');
    require('spinner');
    require('customSelect');
    require("tipsy");
    //异步加载依赖js
    var layer, ZDK, showLoginForm, laytpl;
    require.async(['layerExt', 'js/common/procopy/procopy', 'btnLoading', 'js/common/verify/verify', 'loginPanel', 'laytpl', 'jQueryAjax'], function (obj1, obj2, obj3, obj4, obj5, obj6) {
        layer = obj1;
        ZDK = obj2;
        ZDK.btnLoading = obj3;
        ZDK.verify = obj4;
        showLoginForm = obj5;
        laytpl = obj6;
    });
    var jsCount = 1; //经纱数量
    var wsCount = 1; //纬纱数量
    //初始化方法
    var init = function () {
        $('select[name="QDL_SYSNUMBER"]').customSelect();
        $('select[name="INCH_CM"]').customSelect().change(menFuDanWeiSelect);
        $('select[name="INIUNIT"]').customSelect().change(miDuDanWeiSelect);
        $("#exchange-rate").customSelect({ padding: '6px 8px 5px 8px' });
        $('#txtJxCount').spinner({ value: 1, min: 1, max: 2, addEvent: addLongitude, cutEvent: cutLongitude });
        $('#txtWxCount').spinner({ value: 1, min: 1, max: 4, addEvent: addWarpYarn, cutEvent: cutWarpYarn });
        //纱线选择事件
        $(".selectyarn").live('click', selectYarn);
        //染织方法选择事件
        rzffSelect();
        //印花属性 染料要求选择事件
        rssxRlyqSelect();
        //染厂后处理费用选择事件
        $("#ul_rchcl").children("li").click(rchclfSelect);
        //染厂后处理费用选择事件
        $("#qt_rchcl").children("li").click(qthclfSelect);
        //汇率选择事件
        $("#exchange-rate").change(exchangeRateSelect);
        //核价方式选择(易家纺工缴库核价/工厂报价核价)
        $('input:radio[name="PRICETYPE"]').change(priceTypeMethod);
        //选择织造工缴报价工厂
        $('#a-weavefactory').live('click', weavenFactorySelect);
        //选择染色工缴报价工厂
        $('#a-dyefactory').live('click', dyeFactorySelect);
        //选择印花工缴报价工厂
        $('#a-printingfactory').live('click', printingFactorySelect);
        //选择色织工缴报价工厂
        $('#a-yarndyefactory').live('click', yarnDyeFactorySelect); 
        //选择染厂后处理报价工厂
        $('#a-dyehclfactory').live('click', DyeHCLFactorySelect);
        //选择其他后处理报价工厂
        $('#a-otherhclfactory').live('click', OtherHCLFactorySelect);
        //核价事件
        $("#a-Pricing").click(pricingEvent);
        //keyUP每输入一个数字判断一下
        keyUpVerify();
        //纱线种类数量问号说明
        $(".record-help").tipsy({ gravity: 's' });
    };
    //门幅单位选择事件
    var menFuDanWeiSelect = function () {
        var mf = $('input:text[name="MLMF"]');
        var danWei = $(this);
        if ($.trim(mf.val()) != "") {
            var pageIndx = $.layer({
                title: '门幅转换',
                shade: [0.3, '#000'],
                area: ['auto', 'auto'],
                dialog: {
                    msg: '是否需要将已有的门幅值换算成' + danWei.find("option:selected").text() + "（四舍五入）？",
                    btns: 2,
                    type: 4,
                    btn: ['是', '否'],
                    yes: function () {
                        if (danWei.val() == "CM") {
                            mf.val(Math.round(parseFloat(mf.val()).toFixed(2) * 2.54));
                        } else {
                            var value = Math.round(parseFloat(mf.val()).toFixed(2) / 2.54);
                            if (value == 0) {
                                mf.val("");
                            } else {
                                mf.val(value);
                            }
                        }
                        layer.close(pageIndx);
                    }
                }
            });

        }

    };
    //密度单位选择事件
    var miDuDanWeiSelect = function () {
        var danWei = $(this);
        var ismd = false;
        $('input:text[name="JXMD"],input:text[name="WXMD"]').each(function () {
            if ($.trim($(this).val()) != "") {
                ismd = true;
                return;
            }
        });
        if (ismd) {
            var pageIndx = $.layer({
                title: '密度值转换',
                shade: [0.3, '#000'],
                area: ['auto', 'auto'],
                dialog: {
                    msg: '是否需要将已有的密度值换算成' + (danWei.val() == "CM" ? "厘米" : "英寸") + "（四舍五入）？",
                    btns: 2,
                    type: 4,
                    btn: ['是', '否'],
                    yes: function () {
                        $('input:text[name="JXMD"]').each(function () {
                            if ($.trim($(this).val()) != "") {
                                $(this).val(miduConvert(danWei.val(), $(this).val()));

                            }
                        });
                        $('input:text[name="WXMD"]').each(function () {
                            if ($.trim($(this).val()) != "") {
                                $(this).val(miduConvert(danWei.val(), $(this).val()));
                            }
                        });
                        layer.close(pageIndx);
                    }
                }
            });
        }
    };
    //密度转换英寸或厘米
    var miduConvert = function (danwei, val) {
        if (danwei == "CM") {
            var value = Math.round(parseFloat(val).toFixed(2) / 2.54);
            if (value == 0) {
                return "";
            } else {
                return value;
            }
        } else {
            return Math.round(parseFloat(val).toFixed(2) * 2.54); ;
        }
    };
    //经纱加加
    var addLongitude = function () {
        //添加经线密度
        $("#tdJxmd").append('<span>+</span><input name="JXMD" type="text" class="w_small w_middle" />');
        //添加经纱
        var strVar = "";
        strVar += "<tr id=\"tr_jscount" + (jsCount + 1) + "\">";
        strVar += "                        <td class=\"tdtitle\">";
        strVar += "                            <span class=\"c-3\">经纱" + (jsCount + 1) + "：<\/span>";
        strVar += "                        <\/td>";
        strVar += "                        <td>";
        strVar += "                            <table cellpadding=\"0\" cellspacing=\"0\" class=\"table2\">";
        strVar += "                                <tbody><tr>";
        strVar += "                                    <td class=\"td1\" align=\"right\">";
        strVar += "                                        成分";
        strVar += "                                    <\/td>";
        strVar += "                                    <td class=\"text1\">";
        strVar += "                                        <input name=\"JXCF\" type=\"text\" readonly=\"readonly\" class=\"w_small w_length  mr-5\">";
        strVar += "                                        <input name=\"JXSZGGNAME\" type=\"hidden\">";
        strVar += "                                        <input name=\"JX_GUXIAN\" type=\"hidden\">";
        strVar += "                                        <input name=\"JX_CFBL\" type=\"hidden\">";
        strVar += "                                        <input name=\"PRICE_JS\" type=\"hidden\">";
        strVar += "                                    <\/td>";
        strVar += "                                    <td rowspan=\"2\">";
        strVar += "                                        <a class=\"buto auto  selectyarn\">选择纱线<\/a>";
        strVar += "                                    <\/td>";
        strVar += "                                <\/tr>";
        strVar += "                                <tr>";
        strVar += "                                    <td class=\"td1\" align=\"right\">";
        strVar += "                                        粗细";
        strVar += "                                    <\/td>";
        strVar += "                                    <td class=\"text1\">";
        strVar += "                                        <input name=\"JSGG\" type=\"text\" readonly=\"readonly\" class=\"w_small w_length  mr-5\">";
        strVar += "                                    <\/td>";
        strVar += "                                    <td>";
        strVar += "                                    <\/td>";
        strVar += "                                <\/tr>";
        strVar += "                            <\/tbody><\/table>";
        strVar += "                        <\/td>";
        strVar += "                    <\/tr>";
        $(".table1 #tr_jscount" + jsCount).after(strVar);
        jsCount = jsCount + 1;
        creatTip();
    };
    //经纱减减
    var cutLongitude = function () {
        //移除最后一个经线密度
        $("#tdJxmd").children('input').last().remove();
        $("#tdJxmd").children('span').last().remove();
        //移除最后一个经纱
        $("#tr_jscount" + jsCount).remove();
        jsCount = jsCount - 1;

        creatTip();
    };
    //纬纱加加
    var addWarpYarn = function () {
        //添加经线密度
        $("#tdWxmd").append('<span>+</span><input name="WXMD" type="text" class="w_small w_middle" />');
        //添加经纱
        var strVar = "";
        strVar += "<tr id=\"tr_wscount" + (wsCount + 1) + "\">";
        strVar += "                        <td  class=\"tdtitle\">";
        strVar += "                            <span class=\"c-3\">纬纱" + (wsCount + 1) + "：<\/span>";
        strVar += "                        <\/td>";
        strVar += "                        <td >";
        strVar += "                            <table cellpadding=\"0\" cellspacing=\"0\" class=\"table2\">";
        strVar += "                                <tr>";
        strVar += "                                    <td class=\"td1\" align=\"right\">";
        strVar += "                                        成分";
        strVar += "                                    <\/td>";
        strVar += "                                    <td class=\"text1\">";
        strVar += "                                        <input name=\"WXCF\" readonly=\"readonly\" type=\"text\" class=\"w_small w_length mr-5\" />";
        strVar += "                                        <input name=\"WXSZGGNAME\" type=\"hidden\" />";
        strVar += "                                        <input name=\"WX_GUXIAN\" type=\"hidden\" />";
        strVar += "                                        <input name=\"WX_CFBL\" type=\"hidden\" />";
        strVar += "                                        <input name=\"PRICE_WS\" type=\"hidden\" />";
        strVar += "                                    <\/td>";
        strVar += "                                    <td rowspan=\"2\">";
        strVar += "                                        <a class=\"buto auto selectyarn\">选择纱线<\/a>";
        strVar += "                                    <\/td>";
        strVar += "                                <\/tr>";
        strVar += "                                <tr>";
        strVar += "                                    <td class=\"td1\" align=\"right\">";
        strVar += "                                        粗细";
        strVar += "                                    <\/td>";
        strVar += "                                    <td class=\"text1\">";
        strVar += "                                        <input name=\"WSGG\" readonly=\"readonly\" type=\"text\" class=\"w_small w_length mr-5\" />";
        strVar += "                                    <\/td>";
        strVar += "                                <\/tr>";
        strVar += "                            <\/table>";
        strVar += "                        <\/td>";
        strVar += "                    <\/tr>";
        $(".table1 #tr_wscount" + wsCount).after(strVar);
        wsCount = wsCount + 1;
        creatTip();

    };
    //纬纱减减
    var cutWarpYarn = function () {
        //移除最后一个经线密度
        $("#tdWxmd").children('input').last().remove();
        $("#tdWxmd").children('span').last().remove();
        //移除最后一个经纱
        $("#tr_wscount" + wsCount).remove();
        wsCount = wsCount - 1;
        creatTip();
    };
    //纱线选择方法
    var selectYarn = function () {
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
    };

    //染织方法选择事件
    var rzffSelect = function () {

        $('input:radio[name="DY_FNUMBER"]').change(function () {
            //染色
            if ($(this).val() == "DY0001") {
                $("#span-rzsxTitle").text("染色属性：").parent().parent().show();
                $("#div-rssx").show();
                $("#div-yhsx").hide();
                layer.closeTips();
            }
            //印花
            else if ($(this).val() == 'DY0002') {
                $("#span-rzsxTitle").text("印花属性：").parent().parent().show();
                $("#div-yhsx").show();
                $("#div-rssx").hide();
                $('select[name="IFDWH"]').customSelect();
                $('select[name="YH_SS"]').customSelect();
                creatTip();
            }
            //色织
            else {
                $("#div-yhsx").hide();
                $("#div-rssx").hide();
                $("#span-rzsxTitle").parent().parent().hide();
                layer.closeTips();
            }

            //核价类型
            priceTypeMethod();
        });

    };
    //印花属性 染料要求选择事件
    var rssxRlyqSelect = function () {
        $('input:radio[name="YH_RLYQ"]').change(function () {
            if ($(this).val() == '转移印花') {
                $("#div-yhsx-gyyq").hide();
                $('#div-yhsx-gyyq-rzy').show();
                $('#div-hwxh').show();
                $('input:radio[name="YH_GYYQ"][value="热转移"]').attr("checked", true);
            }
            else {
                $("#div-yhsx-gyyq").show();
                $('#div-yhsx-gyyq-rzy').hide();
                $('#div-hwxh').hide();
                $('input:radio[name="YH_GYYQ"][value="平网印花"]').attr("checked", true);
            }
        });
    };
    //染厂后处理费用选择事件
    var rchclfSelect = function () {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $(this).attr("title", "点击选择");
        }
        else {
            $(this).addClass("selected");
            $(this).attr("title", "点击取消");
        }
        var selectHclfy = 0;
        var selectHclsl = 0;
        var hclfSysnumber = "";
        var hclfName = "";
        $(this).parent().find(".selected").each(function () {
            selectHclfy = selectHclfy + parseFloat($(this).attr("hclf"));
            selectHclsl = selectHclsl + parseFloat($(this).attr("hclsl"));
            hclfSysnumber = $(this).attr("hclsysnumber") + "+" + hclfSysnumber;
            hclfName = $.trim($(this).children("a").text()) + "+" + hclfName;
        });
        $(this).parent().parent().find("#hidRCHCLF").val(selectHclfy.toFixed(2));
        $(this).parent().parent().find("#hidRCHCLSL").val(selectHclsl.toFixed(2));
        $(this).parent().parent().find("#hidRCHCLFSYSNUMBER").val(hclfSysnumber);
        $(this).parent().parent().find("#hidRCHCLFNAME").val(hclfName);
        //核价类型
        priceTypeMethod();
    };

    //其它后处理费用选择事件
    var qthclfSelect = function () {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $(this).attr("title", "点击选择");
        }
        else {
            $(this).addClass("selected");
            $(this).attr("title", "点击取消");
        }
        var selectHclfy = 0;
        var selectHclsl = 0;
        var hclfSysnumber = "";
        var hclfName = "";
        $(this).parent().find(".selected").each(function () {
            selectHclfy = selectHclfy + parseFloat($(this).attr("hclf"));
            selectHclsl = selectHclsl + parseFloat($(this).attr("hclsl"));
            hclfSysnumber = $(this).attr("hclsysnumber") + "+" + hclfSysnumber;
            hclfName = $.trim($(this).children("a").text()) + "+" + hclfName;
        });
        $(this).parent().parent().find("#hidQTHCLF").val(selectHclfy.toFixed(2));
        $(this).parent().parent().find("#hidQTHCLSL").val(selectHclsl.toFixed(2));
        $(this).parent().parent().find("#hidQTHCLFSYSNUMBER").val(hclfSysnumber);
        $(this).parent().parent().find("#hidQTHCLFNAME").val(hclfName);
        //核价类型
        priceTypeMethod();

    };
    //汇率选择事件
    var exchangeRateSelect = function () {
        $('input:text[name="EXCHANGERATEVALUE"]').val($(this).val());
        $('input:hidden[name="EXCHANGERATENAME"]').val($(this).find("option:selected").text());
    };
    var creatTip = function () {
        if ($('input:radio[name="DY_FNUMBER"]:checked').val() == 'DY0002') {
            layer.closeTips();
            layer.tips('染料要求', $("#div-yhsx-rlyq"), {
                more: true,
                guide: 3,
                style: ['background-color:#78BA32; color:#fff', '#78BA32'],
                maxWidth: 240

            });
            if ($('input:radio[name="YH_RLYQ"]:checked').val() == '转移印花') {
                layer.tips('工艺要求', $("#div-yhsx-gyyq-rzy"), {
                    guide: 3,
                    more: true,
                    style: ['background-color:#0FA6D8; color:#fff', '#0FA6D8'],
                    maxWidth: 240
                });
            } else {
                layer.tips('工艺要求', $("#div-yhsx-gyyq"), {
                    guide: 3,
                    more: true,
                    style: ['background-color:#0FA6D8; color:#fff', '#0FA6D8'],
                    maxWidth: 240


                });
            }
            layer.tips('色牢度等级', $("#div-yhsx-slddj"), {
                guide: 3,
                more: true,
                style: ['background-color:#F26C4F; color:#fff', '#F26C4F'],
                maxWidth: 240
            });
        }
    };


    //核价方式选择(易家纺工缴库核价/工厂报价核价)
    var priceTypeMethod = function () {
        //核价类型 1易家纺工缴库核价、2工厂报价核价
        var priceType = $('input:radio[name="PRICETYPE"]:checked').val();
        if (priceType == '1') {
            $("#tr_gczzgj").hide("normal");
            $("#tr_gcrsgj").hide("normal");
            $("#tr_gcyhgj").hide("normal");
            $("#tr_gcszgj").hide("normal");
            $("#tr_dyeaftercure").hide("normal");
            $("#tr_otheraftercure").hide("normal");
        }
        if (priceType == '2') {
            $("#tr_gczzgj").show("normal");
            //染织方法
            var dyeMethod = $('input:radio[name="DY_FNUMBER"]:checked').val();
            //染织方法为染色的 选择染色工厂报价
            if (dyeMethod == 'DY0001') {
                $("#tr_gcyhgj").hide();
                $("#tr_gcszgj").hide();
                $("#tr_gcrsgj").show("normal");

            }
            //染织方法为印花的 选择印花工厂报价
            else if (dyeMethod == 'DY0002') {
                $("#tr_gcrsgj").hide();
                $("#tr_gcszgj").hide();
                $("#tr_gcyhgj").show("normal");
            }
            //染织方法为色织的 选择色织工厂报价
            else if (dyeMethod == 'DY0003') {
                $("#tr_gcrsgj").hide();
                $("#tr_gcyhgj").hide();
                $("#tr_gcszgj").show("normal");
            }
            if (priceType == "2" && $("#hidRCHCLFSYSNUMBER").val() != "" && dyeMethod != "DY0001") {
                $("#tr_dyeaftercure").show("normal");
            } else {
                $("#tr_dyeaftercure").hide("normal");
            }
            //选择其它后处理的工厂报价
            if ($("#hidQTHCLFSYSNUMBER").val() != "") {
                $("#tr_otheraftercure").show("normal");
            } else {
                $("#tr_otheraftercure").hide("normal");
            }
        }

    };
    //选择织造工缴工厂
    var weavenFactorySelect = function () {
        if (!publicVerify()) {
            return false;
        }

        var loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
        $.ajaxSubmit(fabricPricingAshxPath + "?Action=GetWeaveTemplateId", $("#form1"),
        function (d) {
            layer.close(loadi);
            if (d.WeaveTemplateId == "") {
                layer.alert("未取得织造工缴方案，请重新调整起订量或纱线密度！", 8, !1);
                return;
            }
            $.layer({
                type: 2,
                title: "选择织造工缴报价工厂",
                shadeClose: false,
                fix: false,
                shift: 'top',
                area: ['912px', 633],
                iframe: {
                    src: '/UIPricing/FabricPricing/WeaveFactoryList.aspx?r=' + Math.random() + '&weaveTemplateId=' + d.WeaveTemplateId + '&elementType=' + d.ElementType,
                    scrolling: 'no'
                }
            }
            );

        }, { IsShowLoading: false });

    };
    //选择染色工缴工厂
    var dyeFactorySelect = function () {
        if (!publicVerify()) {
            return false;
        }
        var loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
        //是否选择了染厂后处理项目
        var isJoinHclf = "0";
        if ($("#hidRCHCLFSYSNUMBER").val() != "") {
            isJoinHclf = "1";
        }
        $.ajaxSubmit(fabricPricingAshxPath + "?Action=GetDyeTemplateId", $("#form1"),
        function (d) {
            layer.close(loadi);
            if (d.DyeTemplateId == "") {
                layer.alert(d.Message, 8, !1);
                return;
            }
            $.layer({
                type: 2,
                title: "选择染色工缴报价工厂",
                shadeClose: false,
                fix: false,
                shift: 'top',
                area: ['912px', 633],
                iframe: {
                    src: '/UIPricing/FabricPricing/DyeFactoryList.aspx?r=' + Math.random() + '&dyeTemplateId=' + d.DyeTemplateId + '&elementType=' + d.ElementType + '&isJoinHclf=' + isJoinHclf,
                    scrolling: 'no'
                }
            }
            );
        }, { IsShowLoading: false });
    };
    //选择印花工缴工厂
    var printingFactorySelect = function () {
        if (!publicVerify()) {
            return false;
        }
        var loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
        $.ajaxSubmit(fabricPricingAshxPath + "?Action=GetPrintingTemplateId", $("#form1"),
        function (d) {
            layer.close(loadi);
            if (d.PrintingTemplateId == "") {
                layer.alert(d.Message, 8, !1);
                return;
            }
            $.layer({
                type: 2,
                title: "选择印花工缴报价工厂",
                shadeClose: false,
                fix: false,
                shift: 'top',
                area: ['912px', 633],
                iframe: {
                    src: '/UIPricing/FabricPricing/PrintingFactoryList.aspx?r=' + Math.random() + '&printingTemplateId=' + d.PrintingTemplateId + '&elementType=' + d.ElementType,
                    scrolling: 'no'
                }
            }
            );
        }, { IsShowLoading: false });
    };
    //选择色织工缴工厂
    var yarnDyeFactorySelect = function () {
        $.layer({
            type: 2,
            title: "选择色织工缴报价工厂",
            shadeClose: false,
            fix: false,
            shift: 'top',
            area: ['912px', 633],
            iframe: {
                src: '/UIPricing/FabricPricing/YarnDyeFactoryList.aspx?r=' + Math.random(),
                scrolling: 'no'
            }
        }
            );
    };

    //选择染厂后处理工厂
    var DyeHCLFactorySelect = function () {
        var hclsysnumbers = $("#hidRCHCLFSYSNUMBER").val().replace("+", ",");
       
        $.layer({
            type: 2,
            title: "选择染厂后处理报价工厂",
            shadeClose: false,
            fix: false,
            shift: 'top',
            area: ['912px', 633],
            iframe: {
                src: '/UIPricing/FabricPricing/DyeHCLFactoryList.aspx?r=' + Math.random() + '&hclsysnumbers=' + hclsysnumbers,
                scrolling: 'no'
            }
        }
            );
    };
    //选择染厂后处理工厂
    var OtherHCLFactorySelect = function () {
        var hclsysnumbers = $("#hidQTHCLFSYSNUMBER").val().replace("+", ",");
        $.layer({
            type: 2,
            title: "选择其他后处理报价工厂",
            shadeClose: false,
            fix: false,
            shift: 'top',
            area: ['912px', 633],
            iframe: {
                src: '/UIPricing/FabricPricing/OtherHCLFactoryList.aspx?r=' + Math.random() + '&hclsysnumbers=' + hclsysnumbers,
                scrolling: 'no'
            }
        }
            );
    };

    //keyUp验证事件
    var keyUpVerify = function () {
        //门幅验证
        $('input:text[name="MLMF"]').live('keyup', function () {
            if (!ZDK.verify.type.positiveInt($(this).val())) {
                ZDK.verify.showErroTip($(this), '请输入正确的门幅，只能输入正整数');
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
            (this).focus();
            $(this).val($(this).val().replace(/[\D]/g, ""));
            if ($('select[name="INCH_CM"]').val() == "CM" && parseInt($(this).val()) > 310) {
                ZDK.verify.showErroTip($(this), '面料门幅不能大于310厘米，请重新输入门幅');
                $(this).val("");
            }
            else if ($('select[name="INCH_CM"]').val() == "INCH" && parseInt($(this).val()) > 122) {
                ZDK.verify.showErroTip($(this), '面料门幅不能大于122英寸，请重新输入门幅');
                $(this).val("");
            }

        });
        //密度验证
        $('input:text[name="JXMD"],input:text[name="WXMD"]').live('keyup', function () {
            if (!ZDK.verify.type.positiveInt($(this).val())) {
                ZDK.verify.showErroTip($(this), '请输入正确的数字，只能输入正整数');
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
            (this).focus();
            $(this).val($(this).val().replace(/[\D]/g, ""));


        });
        //花位循环验证
        $('input:text[name="YH_HWXH"]').live('keyup', function () {
            if (!ZDK.verify.type.positiveInt($(this).val())) {
                ZDK.verify.showErroTip($(this), '请输入正确的经密，只能输入正整数');
            }
            (this).focus();
            $(this).val($(this).val().replace(/[\D]/g, ""));


        });
        //汇率验证
        $('input:text[name="EXCHANGERATEVALUE"]').live('keyup', function () {
            if (!ZDK.verify.type.double($(this).val())) {
                ZDK.verify.showErroTip($(this), '请输入正确汇率，只能为数字！');
            }
            (this).focus();
            $(this).val($(this).val().replace(/[^0-9.]/g, ""));

        });

    };

    var publicVerify = function() {
        //面料门幅验证
        var mlmf = $('input:text[name="MLMF"]');
        if ($.trim(mlmf.val()) == "") {
            ZDK.verify.showErroTip(mlmf, '门幅不能为空！');
            return false;
        }
        //经纱密度验证
        var ismd = true;
        $('input:text[name="JXMD"],input:text[name="WXMD"]').each(function() {
            if ($.trim($(this).val()) == "") {
                ZDK.verify.showErroTip($(this), '密度不能为空！');
                ismd = false;
                return false;
            }

        });
        if (!ismd) {
            return false;
        }
        //纱线验证
        var iscf = true;
        $('input:text[name="JXCF"],input:text[name="WXCF"]').each(function() {
            if ($.trim($(this).val()) == "") {
                ZDK.verify.showErroTip($(this), '请选择此经纱成分！');
                iscf = false;
                return false;
            }

        });
        if (!iscf) {
            return false;
        }
        return true;
    };
  


    var formVerify = function () {
        if (!publicVerify()) {
            return false;
        }
        //花未循环验证
        if ($('input:radio[name="YH_RLYQ"]:checked').val() == "转移印花" && $('input:radio[name="DY_FNUMBER"]:checked').val() == "DY0002") {
            var hwxh = $('input:text[name="YH_HWXH"]');
            if ($.trim(hwxh.val()) == "") {
                ZDK.verify.showErroTip(hwxh, '花位循环不能为空！');
                return false;
            }
        }
        //汇率验证
        var hl = $('input:text[name="EXCHANGERATEVALUE"]');
        if ($.trim(hl.val()) == "") {
            ZDK.verify.showErroTip(hl, '请填写' + $("#exchange-rate").find("option:selected").text() + '！');
            return false;
        }

        return true;
    };
    //核价事件
    var pricingEvent = function () {
        if (!formVerify()) {
            return;
        }

        var btn = $(this);
        var isCilck = ZDK.btnLoading({
            obj: btn,
            addClass: "disabled",
            txt: '正在核价'
        });

        if (!isCilck) {
            return;
        }
        $.ajaxSubmit(fabricPricingAshxPath + "?Action=pricing", $("#form1"),
        function (d) {
            if (!d.Success) {
                //未登录
                if (d.Data == "-1") {
                    showLoginForm();
                }
                else {
                    layer.alert(d.Message, 8, !1);
                }
            } else {
                var priceData = d.Data;
                //同步渲染 模板引擎
                var resultTemplate = laytpl($("#resultTemplate").html()).render(d.Data);
                $("#priceResult").html(resultTemplate);
                $.layer({
                    title: "面料核价结果",
                    type: 1,   //0-4的选择,
                    btns: 2,
                    btn: ['收藏核价', '关闭'],
                    shadeClose: false,
                    fix: false,
                    shift: 'top',
                    area: ['680px', 'auto'],
                    page: {
                        dom: '#popupResult'
                    },
                    //收藏核价事件
                    yes: function () {
                        layer.prompt({ title: '请填写收藏名称', type: 3, length: 250 }, function (name, index) {
                            var loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
                            $.ajaxjson(fabricPricingAshxPath, { Action: "addCollect", recordid: priceData.SYSNUMBER, collectname: name },
                          function (d) {
                              //款式尺码同步渲染 模板引擎
                              if (d.Success) {
                                  if (d.Success) {
                                      layer.close(loadi);
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
                          }, { IsShowLoading: false });
                        });
                    }

                });
                $(".fabric_step_2 tbody tr").hover(function () {
                    $(this).addClass("hover");
                }, function () {
                    $(this).removeClass("hover");
                });

            }
            btn.removeClass('disabled');
            ZDK.btnLoading.reset(btn);

        }, { IsShowLoading: false });

    };
    exports.init = init;


});

