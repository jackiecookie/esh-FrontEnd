define(function (require, exports, module) {

    module.exports.showButton = function() {
        $(".price-range p").removeClass().addClass("show-button");
        $(".price-range #priceSearch a").show();
    };

    module.exports.hideButton = function() {
        //if (!document.getElementById("priceSearch").contains(event.toElement)) {
        $('.price-range p').removeClass('show-button');
        $("#minPrice").blur();
        //}
    };

    function showOrHideTitle() {
        var twoTitle = $("#titleForm").children("div").eq(1).children("a").text().replace(/(^\s*)|(\s*$)/g, ""); //去除空格
        if (twoTitle != "全部") {
            $("#titleForm").children("div").eq(1).show();
            $("#titleForm").children("span").eq(1).show();
        }
        var threeTitle = $("#titleForm").children("div").eq(2).children("a").text().replace(/(^\s*)|(\s*$)/g, "");
        if (threeTitle != "全部") {
            $("#titleForm").children("div").eq(2).show();
            $("#titleForm").children("span").eq(2).show();
        }
        var threeSecletd = $("#titleForm").children("div").eq(2).children("ul").children("li").children("a.active").text();
        if (threeSecletd != null && threeSecletd != "") {
            $("#titleForm").children("div").eq(3).show();
            $("#titleForm").children("span").eq(3).show();
            $("#titleForm").children("div").eq(3).text(threeSecletd);
        }
    }
    $(function () {
        showOrHideTitle();
        //去除分页页数跳转功能
        //$("#divPage").children("div.pages").children("div.pages").children("input").hide();

        var height = $("#myTab0_Content0").height();
        if (height < 750) {
            //$("#myTab0_Content0").height(750);
        }
        $("#showPriceRange").toggle(function () {
            $("#priceUl").removeClass("unstyled").addClass("unstyled show-con");
        }, function () {
            $("#priceUl").removeClass("unstyled show-con").addClass("unstyled");
        });
        $("#searchDiv input[type='text']").focus(function () {
            var value = $(this).val();
            if (value == "请输入关键字") {
                $(this).val("");
            }
        });
        $("#searchDiv input[type='text']").blur(function () {
            var value = $(this).val();
            if (value == null || value == "") {
                $(this).val("请输入关键字");
            }
        });
    });
});

