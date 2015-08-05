define(['jqueryPage', 'jQueryAjax', 'js/lib/amcharts/serial', 'js/app/Data/chatComm'], function (require, exports, module) {
    var chatComm = require('js/app/Data/chatComm');
    var AmCharts = require('js/lib/amcharts/serial');
    require('jQueryAjax');
    require('jqueryPage');
    var pageIndex = 0;
    var getPara = function (pageindex) {
        var companyName = $('#companyname').val();
        var country = $('#country').val();
        var year = $('#year').val();
        var para = { 'country': country, 'pageIndex': pageindex, 'pageSize': 5, 'y': year, 'com': companyName };
        return para;
    }
    var initdata = function () {
        var para = getPara(pageIndex);
        InitFenyeData(pageIndex, 5, para);
    };


    var isFirstRequest = false;
    var InitFenyeData = function (pageIndex, pageSize, para) {
        $.ajaxjson('/UIData/ashx/GetOtherCountryData.ashx', para, function (data) {
            //   $('.load').remove();
            $("#Zhanbi").html('');
            if (data) {
                var trList = $("<tbody></tbody>");
                for (var i = 0, len = data.data.length; i < len; i++) {
                    var objJson = data.data[i];
                    var t = "";
                    t += " <tr><td><a href='javascript:void(0)'>" + objJson.PRONAME + "</a></td><td>" + objJson.PERCENTAGE + "%</td></tr>";
                    trList.append(t);
                }
                $("#bltable tr:gt(0)").remove();
                $("#bltable").append(trList); //将返回的记录
                var count = parseInt(data.total); // 总的记录数  
                if ($.trim($("#Zhanbi").html()).length == '') {
                    isFirstRequest = true;
                    $("#Zhanbi").pagination(count, {
                        callback: fenyecallBack,
                        prev_text: '上一页', //上一页按钮里text
                        next_text: '下一页', //下一页按钮里text
                        items_per_page: pageSize, //显示条数
                        num_display_entries: 4, //连续分页主体部分分页条目数
                        current_page: pageIndex, //当前页索引
                        num_edge_entries: 1 //两侧首尾分页条目数
                    });
                }
            } else {
                $("#Zhanbi").html('暂无此国家数据');
            }
        }, { Message: "正在请求数据" });
    };
    var fenyecallBack = function (pageIndex) {
        if (isFirstRequest == true) {
            isFirstRequest = false;
            return;
        } else //$('#Zhanbi').append('   <img src="../../images/load.gif" class="load"  style="vertical-align:middle"/>');
            var para = getPara(pageIndex+1);
        InitFenyeData(pageIndex, 5, para);
    };

    var DrawReport = function() {
        //    var lastyear = new Date(data.monthmodel[0].UnitName).getYear();
        //    for (var i = 1, len = data.monthmodel.length; i < len; i++) {
        //        var date = new Date(data.monthmodel[i].UnitName);
        //        year = new Date(data.monthmodel[i].UnitName).getYear();
        //        if (lastyear != year) { lastyear = year; continue; }
        //        data.monthmodel[i].UnitName = date.getMonth() + 1;
        //    }
        if (data.yearmodel.length > 0) {
            var yearSild = chatComm.GetYearSild(data.yearmodel);
            $('#yearLab1').text(yearSild);
            var chart = new AmCharts.AmSerialChart();
            chart.pathToImages = "/Static/Images/DataImg/";
            chart.dataProvider = data.yearmodel;
            chart.categoryField = "UnitName";
            var categoryAxis = chart.categoryAxis;
            categoryAxis.gridAlpha = 0;
            var graph = new AmCharts.AmGraph();
            graph.title = "总金额(美元)";
            graph.valueField = "TOTALMONEY";
            graph.lineAlpha = 0;
            graph.fillAlphas = 0.5;
            graph.lineColor = "#fba827";
            graph.balloonText = "[[category]]: <b>[[value]]</b>";
            graph.type = "column";
            chart.addGraph(graph);
            var legend = new AmCharts.AmLegend();
            legend.borderAlpha = 0.2;
            legend.horizontalGap = 10;
            legend.valueWidth = 130;
            chart.addLegend(legend);
            var chartScrollbar = new AmCharts.ChartScrollbar();
            chart.addChartScrollbar(chartScrollbar);
            var chartCursor = new AmCharts.ChartCursor();
            chart.addChartCursor(chartCursor);
            chart.write('chartdiv');
        } else {
            $('#chartdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
        }
        if (data.monthmodel.length > 0) {
            var monthLab1 = chatComm.showYear(data.monthmodel);
            $('#monthLab1').text(monthLab1);
            var chart = new AmCharts.AmSerialChart();
            AmCharts.shortMonthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
            chart.pathToImages = "/Static/Images/DataImg/";
            chart.dataProvider = data.monthmodel;
            chart.categoryField = "UnitName";
            chart.marginRight = 10;
            chart.marginLeft = 10;
            chart.dataDateFormat = "YYYY-MM";
            var categoryAxis = chart.categoryAxis;
            categoryAxis.parseDates = true;
            categoryAxis.equalSpacing = true;
            categoryAxis.minPeriod = "MM";
            categoryAxis.gridAlpha = 0;
            //    categoryAxis.dateFormats = [{
            //        period: 'DD',
            //        format: 'DD'
            //    },{
            //        period: 'MM',
            //        format: 'MM'
            //    }, {
            //        period: 'YYYY',
            //        format: 'YYYY'
            //    }];
            var graph = new AmCharts.AmGraph();
            graph.title = "总金额(美元)";
            graph.valueField = "TOTALMONEY";
            graph.lineAlpha = 0;
            graph.fillAlphas = 0.5;
            graph.lineColor = "#fba827";
            graph.balloonText = "[[category]]: <b>[[value]]</b>";
            graph.type = "column";
            chart.addGraph(graph);
            var legend = new AmCharts.AmLegend();
            legend.borderAlpha = 0.2;
            legend.horizontalGap = 10;
            legend.valueWidth = 130;
            chart.addLegend(legend);
            var chartScrollbar = new AmCharts.ChartScrollbar();
            chart.addChartScrollbar(chartScrollbar);
            var chartCursor = new AmCharts.ChartCursor();
            chartCursor.categoryBalloonDateFormat = 'YYYY年MM月';
            chart.addChartCursor(chartCursor);
            chart.write('monthdiv');
        } else {
            $('#monthdiv').html('<img src="/Static/Images/DataImg/prompt1.jpg">');
        }
    };
    $(function () {
        initdata();
        DrawReport();
    });

});

