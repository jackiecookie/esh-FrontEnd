define(function (require, exports, module) {
    //var design = require("js/app/Design/designlist.js");
    $(function () {
        //查询按钮
        $('#searchBtn').click(function () {
            var fnumber = $.trim($("#funmber").val());
            if (fnumber == "请输入面料编号") {
                fnumber = "";
            }
            window.location.href = $(this).attr("data") + "?k=" + encodeURIComponent(fnumber);
        });
        $('#funmber').keypress(function () {
            if (event.keyCode == 13) {
                var fnumber = $.trim($("#funmber").val());
                if (fnumber == "请输入面料编号") {
                    fnumber = "";
                }
                window.location.href = $(this).attr("data") + "?k=" + encodeURIComponent(fnumber);
            }
        });
    });
    //module.exports = design;
});