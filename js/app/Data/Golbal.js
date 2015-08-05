define(function() {
    $(function () {
        $('#searchBtn').click(function () {
            var para = getPara();
            location.href = location.pathname + '?' + para;
        });
    });
    var getPara = function () {
        var para = new Array();
        var cn = $('#companyName').val();
        if (cn && cn != '请输入企业名称') para.push('cn=' + encodeURIComponent(cn));
        return para.join('&');
    };
});

