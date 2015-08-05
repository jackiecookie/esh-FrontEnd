define(['js/app/Data/chatComm', 'js/common/nguide/nguide'], function (require, exports, module) {
    var chatComm = require('js/app/Data/chatComm');
    var nguide = require('js/common/nguide/nguide').nguide;

    var readData = function () {
        var country = $('#Country').val();
        var pm = $('#pm').val();
        var level = $('#l').val();
        var year = $('#year').val();
        $.getJSON('/UIData/ashx/ReportHandler/AuReportHandler.ashx', { 'cn': country, 'pm': pm, 'l': level, 'year': year }, function (data) {

            if (data.PrResult.yearmodel && data.PrResult.yearmodel.length > 0) {
                var yearSild = chatComm.GetYearSild(data.PrResult.yearmodel);
                $('#yearLab1').text(yearSild);
                $('#yearLab2').text(yearSild);
                $('.load').remove();
                $('#chartdiv').css('height', '400px');
                $('#CHNMonths').css('height', '450px');
                $('#monthdiv').css('height', '400px');
                $('#CHNYears').css('height', '450px');
                chatComm.write1col1line('chartdiv', data.PrResult.yearmodel);
            } else {
                $('#chartdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
            }
            if (data.PrResult.monthmodel && data.PrResult.monthmodel.length > 0) {
                var monthLab1 = chatComm.showYear(data.PrResult.monthmodel);
                $('#monthLab1').text(monthLab1);
                chatComm.write1col1line('monthdiv', data.PrResult.monthmodel, true, true);
            } else {
                $('#monthdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
            }
            if (data.CResylt.yearcnmodel && data.CResylt.yearcnmodel.length > 0) {
                chatComm.write1col1lineForCountry('CHNYears', data.CResylt.yearcnmodel);
            } else {
                $('#CHNYears').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
            }
            if (data.CResylt.monthcnmodel && data.CResylt.monthcnmodel.length > 0) {
                var model = fiterMonthModel(data.CResylt.monthcnmodel);
                chatComm.write1col1lineForCountry('CHNMonths', model);
                    nguide.call(nguide, {
                        steps: [
            {
                target: '#monthSelect',
                content: '从这里你可以选择对应的月份信息进行查看',
                placement: 'bottom',
                width: '250',
                offset: { x: -120 }
            }], prefix: 'NG-Hhgg-'
                    });
               
            } else {
                if (data.CResylt.yearcnmodel) {
                    $('#monthWrap').remove();
                } else
                    $('#CHNMonths').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
            }

            $('#monthSelect').change(function () {
                chanMonth();
            });
        });
    };

    var chanMonth = function () {
        var model = fiterMonthModel();
        $('#CHNMonths').html('');
        chatComm.write1col1lineForCountry('CHNMonths', model);
    };
    var dic = [];

    var fiterMonthModel = function (model) {
        var monthSelect = $('#monthSelect'),
            month = monthSelect.val(),
            monthOption = [],
            addDic = false;
        if (!dic[month]) {
            var i;
            for (i = 0; i < model.length; i++) {
                var monthkey = model[i].UnitName.split('-')[1] + '月';
                if (!dic[monthkey]) {
                    dic[monthkey] = new Array();
                    monthOption.push(' <option>' + monthkey + '</option>');
                    if (i == 0) {
                        month = monthkey;
                        addDic = true;
                    }
                }

                dic[monthkey].push(model[i]);
            }
            if (addDic) {
                monthSelect.html(monthOption.join(''));
            }
        }
        $('#monthLab2').text(month + '进口国家');
        return dic[month];
    };




    $(function () {
        readData();
    });
});

