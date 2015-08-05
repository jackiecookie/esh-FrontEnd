define(function (require, exports, module) {
    var AmCharts = require('js/lib/amcharts/serial');
    function Write2line(writeTo, data, isFormate, isMoney) {
        var chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "/Static/Images/DataImg/";
        chart.dataProvider = data;
        chart.categoryField = "UnitName";
        var valueAxis1 = new AmCharts.ValueAxis();
        //    valueAxis1.offset = 50;   标尺线偏移
        valueAxis1.axisColor = "#FF6600";
        valueAxis1.axisThickness = 2;
        valueAxis1.gridAlpha = 0;
        chart.addValueAxis(valueAxis1);

        var valueAxis2 = new AmCharts.ValueAxis();
        valueAxis2.position = "right"; // this line makes the axis to appear on the right
        valueAxis2.axisColor = "#FCD202";
        valueAxis2.gridAlpha = 0;
        valueAxis2.axisThickness = 2;
        chart.addValueAxis(valueAxis2);
        var categoryAxis = chart.categoryAxis;
        //  categoryAxis.gridAlpha = 0;
        var graph = new AmCharts.AmGraph();
        graph.valueAxis = valueAxis1;
//        if (isMoney) graph.title = "总金额(美元)";
//        else
        //            graph.title = "总批次(次)";
        graph.title = data[0] && data[0].ValueTitle;
        graph.valueField = "Value";
        // graph.labelText = "[[value]]";
        graph.type = "line";
        graph.bullet = "round";
        chart.addGraph(graph);
        var graph1 = new AmCharts.AmGraph();
        graph1.valueAxis = valueAxis2;
        graph1.valueField = "Value1";
        graph1.title = data[0] && data[0].Value1Title; ;
        graph1.type = "line";
        graph1.bullet = "round";
        chart.addGraph(graph1);
        var legend = new AmCharts.AmLegend();
        legend.borderAlpha = 0.2;
        legend.horizontalGap = 10;
        legend.valueWidth = 100;
        chart.addLegend(legend);
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);
        var chartCursor = new AmCharts.ChartCursor();
        chart.addChartCursor(chartCursor);
        if (isFormate) {
            AmCharts.shortMonthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];   //用于格式化日期
            chart.dataDateFormat = "YYYY-MM";
            categoryAxis.minPeriod = "MM";
            categoryAxis.parseDates = true;
            categoryAxis.equalSpacing = true;
            chartCursor.categoryBalloonDateFormat = 'YYYY年MM月';      //显示线上的格式化日期
            //    categoryAxis.labelFunction('1', '1', '1') 
        }
        chart.write(writeTo);
    }

    function write1col1line(writeTo, data, isFormate, ishowValue, colText) {
        var chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "/Static/Images/DataImg/";
        chart.dataProvider = data;
        chart.categoryField = "UnitName";
        var categoryAxis = chart.categoryAxis;
        var valueAxis1 = new AmCharts.ValueAxis();
        //    valueAxis1.offset = 50;   标尺线偏移
        valueAxis1.axisColor = "#FF6600";
        valueAxis1.axisThickness = 2;
        valueAxis1.gridAlpha = 0;
        chart.addValueAxis(valueAxis1);

        var valueAxis2 = new AmCharts.ValueAxis();
        valueAxis2.position = "right"; // this line makes the axis to appear on the right
        valueAxis2.axisColor = "#fba827";
        valueAxis2.gridAlpha = 0;
        valueAxis2.axisThickness = 2;
        chart.addValueAxis(valueAxis2);
        //   categoryAxis.gridAlpha = 0;
        var graph = new AmCharts.AmGraph();
        graph.valueAxis = valueAxis1;
        graph.title = "总金额(美元)";
        graph.valueField = "TotlePrice";
        if (!ishowValue)
            graph.labelText = "[[value]]";
        graph.type = "line";
        graph.bullet = "round";
        chart.addGraph(graph);
        var graph1 = new AmCharts.AmGraph();
        graph1.valueAxis = valueAxis2;
        graph1.title = colText || "总数量";
        graph1.valueField = "Totlebatch";
        graph1.lineAlpha = 0;
        graph1.fillAlphas = 0.5;
        graph1.lineColor = "#fba827";
        graph1.balloonText = "[[category]]: <b>[[value]]</b>";
        graph1.type = "column";
        chart.addGraph(graph1);
        var legend = new AmCharts.AmLegend();
        legend.borderAlpha = 0.2;
        legend.valueWidth = 100;
        legend.horizontalGap = 10;
        chart.addLegend(legend);
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);
        var chartCursor = new AmCharts.ChartCursor();
        chart.addChartCursor(chartCursor);
        if (isFormate) {
            AmCharts.shortMonthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];   //用于格式化日期
            chart.dataDateFormat = "YYYY-MM";
            categoryAxis.minPeriod = "MM";
            categoryAxis.parseDates = true;
            categoryAxis.equalSpacing = true;
            chartCursor.categoryBalloonDateFormat = 'YYYY年MM月';      //显示线上的格式化日期
            //    categoryAxis.labelFunction('1', '1', '1') 
        }
        chart.write(writeTo);
    }

    function write3lines(writeTo, data, isFormate, hasvalueAxis) {
        var chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "/Static/Images/DataImg/";
        chart.dataProvider = data;
        chart.categoryField = "UnitName";
        var categoryAxis = chart.categoryAxis;
        var graph = new AmCharts.AmGraph();
        graph.lineColor = "#ea7878";
        graph.title = "平均价(美元)";
        graph.valueField = "Value3";
        graph.type = "line";
        graph.bullet = "round";
        chart.addGraph(graph);
        var graph1 = new AmCharts.AmGraph();
        graph1.lineColor = "#fdaf4b";
        graph1.title = "最高价(美元)";
        graph1.valueField = "Value";
        graph1.type = "line";
        graph1.bullet = "round";
        chart.addGraph(graph1);
        var graph2 = new AmCharts.AmGraph();
        graph2.lineColor = "#59c8d5";
        graph2.title = "最低价(美元)";
        graph2.valueField = "Value1";
        graph2.type = "line";
        graph2.bullet = "round";
        chart.addGraph(graph2);
        var legend = new AmCharts.AmLegend();
        legend.borderAlpha = 0.2;
        legend.horizontalGap = 10;
        legend.valueWidth = 100;
        chart.addLegend(legend);
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);
        var chartCursor = new AmCharts.ChartCursor();
        chart.addChartCursor(chartCursor);
        if (isFormate) {
            AmCharts.shortMonthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];   //用于格式化日期
            chart.dataDateFormat = "YYYY-MM";
            categoryAxis.minPeriod = "MM";
            categoryAxis.parseDates = true;
            chartCursor.categoryBalloonDateFormat = 'YYYY年MM月';      //显示线上的格式化日期
        }
        if (hasvalueAxis) {
            var valueAxis1 = new AmCharts.ValueAxis();
            valueAxis1.axisColor = "#ea7878";
            valueAxis1.axisThickness = 2;
            valueAxis1.gridAlpha = 0;
            chart.addValueAxis(valueAxis1);
            graph.valueAxis = valueAxis1;
            var valueAxis2 = new AmCharts.ValueAxis();
            valueAxis2.position = "right"; // this line makes the axis to appear on the right
            valueAxis2.axisColor = "#fdaf4b";
            valueAxis2.gridAlpha = 0;
            valueAxis2.axisThickness = 2;
            chart.addValueAxis(valueAxis2);
            graph1.valueAxis = valueAxis2;
            var valueAxis3 = new AmCharts.ValueAxis();
            valueAxis3.offset = 50; // 标尺线偏移
            valueAxis3.axisColor = "#59c8d5";
            valueAxis3.axisThickness = 2;
            valueAxis3.gridAlpha = 0;
            chart.addValueAxis(valueAxis3);
            graph2.valueAxis = valueAxis3;
        }

        chart.write(writeTo);
    }

    function write1col1lineForCountry(writeTo, data) {
        var chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "/Static/Images/DataImg/";
        chart.dataProvider = data;
        chart.categoryField = "Country";
        var categoryAxis = chart.categoryAxis;
        categoryAxis.labelRotation = 30;
        categoryAxis.gridPosition = "start";
        var valueAxis1 = new AmCharts.ValueAxis();
        //    valueAxis1.offset = 50;   标尺线偏移
        valueAxis1.axisColor = "#FF6600";
        valueAxis1.axisThickness = 2;
        valueAxis1.gridAlpha = 0;
        chart.addValueAxis(valueAxis1);
        var valueAxis2 = new AmCharts.ValueAxis();
        valueAxis2.position = "right"; // this line makes the axis to appear on the right
        valueAxis2.axisColor = "#fba827";
        valueAxis2.gridAlpha = 0;
        valueAxis2.axisThickness = 2;
        chart.addValueAxis(valueAxis2);
        //   categoryAxis.gridAlpha = 0;
        var graph = new AmCharts.AmGraph();
        graph.valueAxis = valueAxis1;
        graph.title = "总金额(美元)";
        graph.valueField = "TotlePrice";
        //graph.labelText = "[[value]]";
        graph.type = "line";
        graph.bullet = "round";
        chart.addGraph(graph);
        var graph1 = new AmCharts.AmGraph();
        graph1.valueAxis = valueAxis2;
        graph1.title = "总数量";
        graph1.valueField = "Totlebatch";
        graph1.lineAlpha = 0;
        graph1.fillAlphas = 0.5;
        graph1.lineColor = "#fba827";
        graph1.balloonText = "[[category]]: <b>[[value]]</b>";
        graph1.type = "column";
        chart.addGraph(graph1);
        var legend = new AmCharts.AmLegend();
        legend.borderAlpha = 0.2;
        legend.valueWidth = 100;
        legend.horizontalGap = 10;
        chart.addLegend(legend);
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);
        var chartCursor = new AmCharts.ChartCursor();
        chart.addChartCursor(chartCursor);
        chart.write(writeTo);
    }

    module.exports.write1col1lineForCountry = write1col1lineForCountry;
    module.exports.Write2line = Write2line;
    module.exports.write1col1line = write1col1line;
    module.exports.write3lines = write3lines;

    module.exports.showYear = function(monthmodelObj) {
        var monthSil = monthmodelObj[0].UnitName.replace('-', '年') + '月 至 ' + monthmodelObj[monthmodelObj.length - 1].UnitName.replace('-', '年') + '月'
        $('#showYear').text(monthSil);
        return monthSil;
    };
    module.exports.GetYearSild = function (yearmodelObj) {
        var unFirst = yearmodelObj[0].UnitName;
        var unLast = yearmodelObj[yearmodelObj.length - 1].UnitName;
        if (unFirst != unLast)
            return unFirst + ' 至 ' + unLast;
        else return unFirst;
    };
});

