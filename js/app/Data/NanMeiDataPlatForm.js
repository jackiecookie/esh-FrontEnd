define(function(require, exports, module) {
    require('jQueryAjax');
    var getdata = function () {
        var company = $('#company').val();
        var country = $('#country').val();
        $.ajaxjson('/UIData/ashx/GetSaDataHandler.ashx', { 'cn': company, 'country': country }, function (data) {
            $('#lf .table_b').show();
            $('#load').hide();
            if (data) {
                var minYear = data.minYear;
                var a = ['#GY1', '#GY2', '#GY3'];
                var a1 = ['#CG1', '#CG2', '#CG3'];
                drawTable(a1, data.ProductRankResult.Year1, '/Report/' + country + '?year=' + minYear + '&cn=' + encodeURIComponent(company) + '&pm=', 0, minYear);
                drawTable(a1, data.ProductRankResult.Year2, '/Report/' + country + '?year=' + (parseInt(minYear) + parseInt(1)) + '&cn=' + encodeURIComponent(company) + '&pm=', 1, minYear + 1);
                drawTable(a1, data.ProductRankResult.Year3, '/Report/' + country + '?year=' + (parseInt(minYear) + parseInt(2) )+ '&cn=' + encodeURIComponent(company) + '&pm=', 2, minYear + 2);
                drawTable(a, data.ExportingCountryResult.Year1, null, 0, minYear);
                drawTable(a, data.ExportingCountryResult.Year2, null, 1, minYear + 1);
                drawTable(a, data.ExportingCountryResult.Year3, null, 2, minYear + 2);
            }
        }, { Message: "正在请求数据", IsShowLoading: false });
    };
    var drawTable = function (trid, model1, href, k, _year) {
        var str, name, Percent, Year, rank, y = '';
        for (var j = 0, i = 0; j <= 2; j++) {
            var str = $(trid[j]).html();
            var name = model1[j] ? model1[j].Name || '' : '';
            var Percent = model1[j] ? model1[j].Percent + '%' || '' : '';
            var Year = model1[j] ? model1[j].Year || '' : '';
            if (Year) y = Year;
            if (!y) y = _year;
            if (model1[j]) {
                i = i + 1, rank = i + '、';
            } else {
                rank = '无数据';
            }
            if (href) {
                str += '<td style="white-space: normal;width: 248px;"> ' + rank + '<a href="' + href + encodeURIComponent(name) + '" target="_blank"></a><a href="' + href + encodeURIComponent(name) + '" target="_blank">' + name + ' ' + Percent + '</a> </td>';
            } else {
                str += '<td style="white-space: normal;width: 248px;"> ' + rank + '<a href="javascript:void(0)"></a><a href="javascript:void(0)">' + name + ' ' + Percent + '</a> </td>';
            }
            $(trid[j]).html(str);
            if (k != null) {
                if (y) {
                    $(trid[k] + 'Y').text(y);
                    $(trid[k] + 'N').attr('href', $(trid[k] + 'N').attr('href').replace('@@', y));
                } else {
                    $(trid[k] + 'N').attr('href', 'javascript:void(0)');
                }
            }
        }

    };
    $(function () {
        $('#lf .table_b').hide();
        getdata();
        $('#googlesearch').click(function () {
            var company = $('#company').val();
            var u = "http://www.google.com/search?hl=en&newwindow=1&biw=1280&bih=843&q=" + encodeURIComponent(company);
            window.open(u, '', '');
        });
        $('#xiangqing').click(function () {
            var company = $('#company').val();
            $.ajaxjson('/UIData/ashx/getXiangQingHandler.ashx', { 'action': 'nanmei', 'cm': company }, function (data) {
                if (data) {
                    if (showXiangQing) {
                        showXiangQing(data);
                    }
                } else {
                    if (NoCompanyLaryOut) {
                        NoCompanyLaryOut();
                    } else {
                        msg.alert('抱歉没有该公司的信息');
                    }
                }
            }, '', null);
        });
    });

});






