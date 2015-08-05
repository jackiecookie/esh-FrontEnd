define(function (require, exports, module) {
    require('smartFocus');
    $(function () {
        $("#txtFunmber").smartFocus('请输入会员名称');
        //查询按钮
        $('.searchBtn').click(function () {
            initData();
        });
        //查询按钮
        $('#txtFunmber').keypress(function () {
            if (event.keyCode == 13) {
                initData();
            }
        });

        //加载数据
        function initData() {
            var orderBy = $("#aSort").attr("data");
            var fnumber = $.trim($("#txtFunmber").val());
            if (fnumber == "请输入会员名称") {
                fnumber = "";
            }
            location.href = "/UIDesign/WorkRoom/?k=" + fnumber + "&s=" + orderBy;
        }
    });
});