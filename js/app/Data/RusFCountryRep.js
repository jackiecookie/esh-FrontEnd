define(['js/app/Data/chatComm'], function (require, exports, module) {
    var chatComm = require('js/app/Data/chatComm');
    var readData = function () {
        var company = $('#company').val();
        var pm = $('#pm').val();
        var c = $('#c').val();
        var year = $('#year').val();
        $.getJSON('/UIData/ashx/ReportHandler/RusAbroadReportHandler.ashx', { 'cn': company, 'pm': pm, 'c': c,'year':year }, function (data) {
            if (data.PrResult.yearmodel && data.PrResult.yearmodel.length > 0) {
                var yearSild = chatComm.GetYearSild(data.PrResult.yearmodel);
                $('#yearLab1').text(yearSild);
                $('.load').remove();
                $('#chartdiv').css('height', '400px');
                $('#monthdiv').css('height', '400px');
                chatComm.Write2line('chartdiv', data.PrResult.yearmodel,false,true);
            } else {
                $('#chartdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
            }
            if (data.PrResult.monthmodel && data.PrResult.monthmodel.length > 0) {
                var monthLab1 = chatComm.showYear(data.PrResult.monthmodel);
                $('#monthLab1').text(monthLab1);
                chatComm.Write2line('monthdiv', data.PrResult.monthmodel, true, true);
            } else {
                $('#monthdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
            }
        });
    };
    $(function () {
        readData();
    });

});
