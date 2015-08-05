define(['js/app/Data/chatComm'], function(require, exports, module) {
    var chatComm = require('js/app/Data/chatComm');
    var readData = function() {
        var company = $('#company').val();
        var pm = $('#pm').val();
        var year = $('#year').val();
        $.getJSON('/UIData/ashx/ReportHandler/ChnReportHandler.ashx', { 'cn': company, 'pm': pm,'year':year }, function(data) {
            if (data) {
                $('.load').remove();
                $('#chartdiv').css('height', '400px');
                $('#CHNYears').css('height', '400px');

                if (data.yearmodel.length > 0) {
                    var yearSild = chatComm.GetYearSild(data.yearmodel);
                    $('label.yearLab1').text(yearSild);
                    chatComm.write1col1line('chartdiv', data.yearmodel, false, false, '总数量(件)');
                    chatComm.write3lines('CHNYears', data.yearmodel, false);
                } else {
                    $('#monthdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
                    $('#chartdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
                }
                $('#monthdiv').css('height', '400px');
                $('#CHNMonths').css('height', '400px');
                if (data.monthmodel.length > 0) {
                    var monthLab1 = chatComm.showYear(data.monthmodel);
                    $('label.monthLab1').text(monthLab1);
                    chatComm.write1col1line('monthdiv', data.monthmodel, true, false, '总数量(件)');
                    chatComm.write3lines('CHNMonths', data.monthmodel, true);
                } else {
                    $('#CHNMonths').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
                    $('#monthdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
                }
            }
        });
    };
    $(function () {
        readData();
    });

});

