define(function (require, exports, module) {
    require('jQueryAjax');
    var getdata = function () {
        var company = $('#company').val();
        var c = $('#country').val();
        var yearSid = $('#yearSid').val();
        $.ajaxjson('/UIData/ashx/GetAbordData.ashx', { 'cn': company, 'c': c, 'yearSid': yearSid }, function (data) {
            $('#lf .table_b').show();
            $('#load').hide();
            if (data) {
                var minYear = data.minYear;
                var a = ['#GY1', '#GY2', '#GY3'];
                var a1 = ['#CG1', '#CG2', '#CG3'];
                drawTable(a1, data.ProductRankResult.Year1, '/Report/Abroad?year={year}&c=' + c + '&cn=' + encodeURIComponent(company) + '&pm=', 0, minYear);
                drawTable(a1, data.ProductRankResult.Year2, '/Report/Abroad?year={year}&c=' + c + '&cn=' + encodeURIComponent(company) + '&pm=', 1, minYear + 1);
                drawTable(a1, data.ProductRankResult.Year3, '/Report/Abroad?year={year}&c=' + c + '&cn=' + encodeURIComponent(company) + '&pm=', 2, minYear + 2);
                drawTable(a, data.ExportingCountryResult.Year1, '/Company/USADetail?cn=', 0, minYear);
                drawTable(a, data.ExportingCountryResult.Year2, '/Company/USADetail?cn=', 1, minYear + 1);
                drawTable(a, data.ExportingCountryResult.Year3, '/Company/USADetail?cn=', 2, minYear + 2);
                //var infoFlag = '以下数据为{0}至{1}年数据</br><span>按所占重量百分比排名</span>'.replace('{0}', minYear).replace('{1}', minYear + 2);
                //$('.infoFlag').html(infoFlag);
            }
        }, { Message: "正在请求数据", IsShowLoading: false });
    }
    var drawTable = function (trid, model1, href, k, _year) {
        var str, name, Percent, Year, rank, y = '';
        for (var j = 0, i = 0; j <= 2; j++) {
            var str = $(trid[j]).html();
            var name = model1[j] ? model1[j].Name || '' : '';
            var Percent = model1[j] ? model1[j].Percent + '%' || '' : '';
            var Year = model1[j] ? model1[j].Year || '' : '';
            if (Year) y = Year;
            if (!y) y = _year;
            href = href.replace('{year}', y);
            if (model1[j] && name) {
                i = i + 1, rank = i + '、';
            } else {
                rank = '无数据';
                Percent = '';
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



    //注册弹出详情页  
    (function () {
        $('#xiangqing').click(function () {
            var company = $('#company').val();
            $.ajaxjson('/UIData/ashx/getXiangQingHandler.ashx', { 'cm': company, 'action': 'CHN' }, function (data) {
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
    } ());
    $(function () {
        $('#lf .table_b').hide();
        getdata();
        $('#baidusearch').click(function () {
            var company = $('#company').val();
            var baiduurl = 'http://www.baidu.com/s?wd=' + encodeURIComponent(company);
            window.open(baiduurl, '', '');
        });
    });
});



