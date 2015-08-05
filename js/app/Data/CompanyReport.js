define(['js/app/Data/chatComm'], function (require, exports, module) {
    var chatComm = require('js/app/Data/chatComm');
    var readData = function () {
        var company = $('#company').val();
        var pm = $('#pm').val();
        var year = $('#year').val();
        $.getJSON('/UIData/ashx/ReportHandler/UsaReportHandler.ashx', { 'cn': company, 'pm': pm,'year':year }, function (data) {
            if (data.PrResult.yearmodel && data.PrResult.yearmodel.length > 0) {
                $('.load').remove();
                $('#chartdiv').css('height', '400px');
                $('#CHNMonths').css('height', '400px');
                $('#monthdiv').css('height', '400px');
                $('#CHNYears').css('height', '400px');
                var yearSild = chatComm.GetYearSild(data.PrResult.yearmodel);
                $('label.yearLab1').text(yearSild);
                chatComm.Write2line('chartdiv', data.PrResult.yearmodel);
            } else {
                $('#chartdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
            }
            if (data.PrResult.monthmodel && data.PrResult.monthmodel.length > 0) {
                var monthLab1 = chatComm.showYear(data.PrResult.monthmodel);
                $('label.monthLab1').text(monthLab1);
                chatComm.showYear(data.PrResult.monthmodel);
                chatComm.Write2line('monthdiv', data.PrResult.monthmodel, true);
            } else {
                $('#monthdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
            }
            if (data.CNResylt.yearcnmodel && data.CNResylt.yearcnmodel.length > 0) {
                chatComm.Write2line('CHNYears', data.CNResylt.yearcnmodel);
            } else {
                $('#CHNYears').parents('.wrap').remove();
            }
            if (data.CNResylt.monthcnmodel && data.CNResylt.monthcnmodel.length > 0) {
                chatComm.Write2line('CHNMonths', data.CNResylt.monthcnmodel, true);
            } else {
                $('#CHNMonths').parents('.wrap').remove();
            }
        });
    };
    $(function () {
        readData();
    });

});

