define(function (require, exports, module) {
    var ajax = require('jQueryAjax');
    var alertify = require('alertify');
    var actionURL = "/UIDesign/ashx/FlowerHandler.ashx";
    var lightbox = require('lightbox');
    var urlParam = require('urlParam');
    require('lazyload');
    var photoTem = require('js/app/Design/InfoTmpl/DesignTmpl');
    var design = new Object();

    design.photo = function (options) {
        window.LBConfig = {
            url: options.url,
            pageNum: options.pageNum,
            pageView: options.pageView,
            listDataType: options.listDataType,
            mode: options.mode
        };
        var tmplRenderFn = photoTem.initTmpl(window.LBConfig.listDataType);
        lightbox.init(tmplRenderFn);
        $('.list').on('click', '.openPhoto', function (e) {
            e.preventDefault();
            var picId = $(this).attr('data-picid');
            lightbox.start(picId);
        });
        //详情页查看详情信息
        var pkId = $("#txtSerchResultID").val();
        if (pkId && pkId.length > 0) {
            lightbox.init(tmplRenderFn);
            lightbox.start(pkId, pkId);
            //移除关闭按钮和左右按钮
            $("#j-lb-pic-ctrl").remove();
            $("#lb-side-tt .lb-close").click(function () {
                window.close();
            });
        }
    };

    $(function () {

        //延迟加载图片
        $('.lazy').lazyload({ effect: "fadeIn", threshold: 200 });
        //关键字分类是否需要显示‘展开’
        $(".classify .SubCategoryBox").each(function () {
            $(this).find(".right").css("height", "auto");
            if ($(this).find(".right").height() > 30) {
                $(this).find(".right").height(30);
                var aObj = $('<a class="showmore sm-1"><i></i><span>展开</span></a>').appendTo($(this));
                aObj.click(function () {
                    if ($(this).parent().find('.right').height() == 30) {
                        $(this).parent().find('.right').css("height", "auto");
                        $(this).find("span").html("收缩");
                        //$(this).find("span").attr("class", "span1");
                    } else {
                        $(this).parent().find('.right').css("height", "30px");
                        $(this).find("span").html("展开");
                        //$(this).find("span").attr("class", "span");
                    }
                });

            }
        });

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
        $(".iptint").keyup(function () {
            $(this).val($(this).val().replace(/[^\d]/g, ''));
        });
        $(".iptSerch").blur(function () {
            var defaultValue = $(this).attr("data-default");
            if ($(this).val() == '') {
                $(this).val(defaultValue);
            }
        });
        $(".iptSerch").focus(function () {
            var defaultValue = $(this).attr("data-default");
            if ($(this).val() == defaultValue) {
                $(this).val('');
            }
        });



        //价格查询
        $('#priceBotten').click(function () {
            search($(this));
        });

        $('#priceSearch').mouseout(function () {
            $(this).removeClass("show-button");
        });

        $('#priceSearch').mouseover(function () {
            $(this).removeClass().addClass("show-button");
        });

        $('.label .livip').click(function () {
            var itemurl = $(this).attr('data-url');

            //判断此商品该会员是否已购买VIP
            $.ajaxjson(actionURL, ajax.createParam("isVIP", ""), function (d) {
                if (d.Success) {
                    alertify.set({
                        labels: {
                            ok: "确定",
                            cancel: "取消"
                        }
                    });
                    alertify.confirm("你目前还不是VIP会员，无权查询VIP数据，是否现在购买VIP服务?", function (e) { if (e) window.open('/VIP'); });
                }
                else {
                    window.location.href = itemurl;
                }
            }, { IsShowLoading: false });

        });
        //查询按钮
        $('.searchBtn').live('click', function () {
            search();
            return false;
        });
        $('.iptSerch').keypress(function () {
//            if (event.keyCode == 13) {
//                search();
//            }
        });

        //北京页面
        $('#pserch').mouseout(function () {
            $(this).find(".searchBtn").hide();
        });

        $('#pserch').mouseover(function () {
            $(this).find(".searchBtn").show();
        });
        $(".nav .navswitch").each(function (index) {
            var switchitem = $(".nav .switchitem");
            $(this).mouseover(function () {
                $(switchitem[index]).show();
            });
            $(this).mouseout(function () {
                $(switchitem[index]).hide();
            });
        });
        $(".nav .switchitem").mouseover(function () {
            $(this).show();
        });
        $(".nav .switchitem").mouseout(function () {
            $(this).hide();
        });

    });
    //加载数据
    function search(istab) {

        var arrayParamName = [];
        var arrayParamValue = [];
        //开始价格
        var $minPrice = $("#minPrice");
        if ($minPrice && $minPrice.length > 0) {
            var minPrice = $.trim($minPrice.val());
            if (minPrice && minPrice == "价格起") {
                minPrice = "-1";
            }
            var minUrlParam = $minPrice.attr("data-urlparam");
            arrayParamValue.push(minPrice);
            arrayParamName.push(minUrlParam);
        }

        //结束价格
        var $maxPrice = $("#maxPrice");
        if ($maxPrice && $maxPrice.length > 0) {
            var maxPrice = $.trim($maxPrice.val());
            if (maxPrice && maxPrice == "价格止") {
                maxPrice = "-1";
            }
            var maxUrlParam = $maxPrice.attr("data-urlparam");
            arrayParamValue.push(maxPrice);
            arrayParamName.push(maxUrlParam);
        }
        //编号
        var $fnumber = $("#fnumber");
        if ($fnumber && $fnumber.length > 0) {
            var fnumber = $.trim($fnumber.val());
            if (fnumber && fnumber == $("#fnumber").attr("data-default")) {
                fnumber = "";
            }
            var fnumberUrlParam = $fnumber.attr("data-urlparam");
            arrayParamValue.push(encodeURIComponent(fnumber));
            arrayParamName.push(fnumberUrlParam);
        }


        var currentHref = location.href;

        location.href = urlParam.replaceParams(currentHref, arrayParamName, arrayParamValue);

    }
    module.exports = design;
});