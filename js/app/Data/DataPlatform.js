define(function(require, exports, module) {
    require('jQueryAjax');
    var getData = function () {
        var company = $('#UrlEncodecompany').val();
        var yearSid = $('#yearSid').val();
        var getYearSild = function (year) {
            var para = 1;
            if (year > 2012) {
                para = 0;
            }
            return 'yearSid=' + para;
        }
        $.ajaxjson('/UIData/ashx/GetUsaDataHandler.ashx', { 'cn': company, 'yearSid': yearSid }, function (data) {
            $('#lf .table_b').show();
            $('#load').hide();
            if (data) {
                var CHNHasChinese = function (c, h) {
                    if (c) {
                        if (!c.Country) h = 'javascript:void(0)';
//                        else if (c.Country == 'CN' || !/[a-zA-Z]/.test(c.Country)) {
//                            h = '/Company/chinaDetail?cn=';
//                        }
                    }
                    return h;
                };
                var a = ['#CG1', '#CG2', '#CG3'];
                var a1 = ['#GY1', '#GY2', '#GY3'];
                var a2 = ['#CN1', '#CN2', '#CN3'];
                var a3 = ['#JK1', '#JK2', '#JK3'];
                var minYear = parseInt(data.minYear);
                drawTable(a1, data.ALLSupplierRank.Year1, '/Company/AbroadDetail?' + getYearSild(minYear) + '&u=' + company + '&c=@c&cn=', CHNHasChinese, 0, minYear);
                drawTable(a1, data.ALLSupplierRank.Year2, '/Company/AbroadDetail?' + getYearSild(minYear + 1) + '&u=' + company + '&c=@c&cn=', CHNHasChinese, 1, minYear + 1);
                drawTable(a1, data.ALLSupplierRank.Year3, '/Company/AbroadDetail?' + getYearSild(minYear + 2) + '&u=' + company + '&c=@c&cn=', CHNHasChinese, 2, minYear + 2);

                drawTable(a, data.PrRank.Year1, '/Report/USA?year={year}&cn=' + company + '&pm=', null, 0);
                drawTable(a, data.PrRank.Year2, '/Report/USA?year={year}&cn=' + company + '&pm=', null, 1, minYear + 1);
                drawTable(a, data.PrRank.Year3, '/Report/USA?year={year}&cn=' + company + '&pm=', null, 2, minYear + 2);
                if ((data.CNRank.Year1.length && data.CNRank.Year1[0].Name) || (data.CNRank.Year2.length && data.CNRank.Year2[0].Name) || (data.CNRank.Year3.length && data.CNRank.Year3[0].Name)) {
                    drawTable(a2, data.CNRank.Year1, '/Company/chinaDetail?' + getYearSild(minYear) + '&cn=', CHNHasChinese, 0, minYear);
                    drawTable(a2, data.CNRank.Year2, '/Company/chinaDetail?' + getYearSild(minYear) + '&cn=', CHNHasChinese, 1, minYear + 1);
                    drawTable(a2, data.CNRank.Year3, '/Company/chinaDetail?' + getYearSild(minYear) + '&cn=', CHNHasChinese, 2, minYear + 2);
                } else {
                    $(a2[0]).parents('table').remove();
                }

                drawTable(a3, data.CountryRank.Year1, '/MoreData/CountryGys?com=' + company + '&tn={year}&cn=', null, 0, minYear);
                drawTable(a3, data.CountryRank.Year2, '/MoreData/CountryGys?com=' + company + '&tn={year}&cn=', null, 1, minYear + 1);
                drawTable(a3, data.CountryRank.Year3, '/MoreData/CountryGys?com=' + company + '&tn={year}&cn=', null, 2, minYear + 2);
            }
        }, { Message: "正在请求数据", IsShowLoading: false });
    };
    var drawTable = function (trid, model1, herf, fun, k, _year) {
        var str, name, Percent, Year, rank;
        var y = '';
        for (var j = 0, i = 0; j <= 2; j++) {
            var str = $(trid[j]).html();
            var country = model1[j] ? model1[j].Country || '' : '';
            if (country) herf = herf.replace('c=@c', 'c=' + country);
            if (fun) var _herf = fun(model1[j], herf);
            var name = model1[j] ? model1[j].Name || '' : '';
            var Percent = model1[j] ? model1[j].Percent || '' : '';
            var Year = model1[j] ? model1[j].Year || '' : '';
            if (Year) y = Year;
            if (!y) y = _year;
            if (model1[j]&&name) {
                i = i + 1, rank = i + '、';
            } else {
                rank = '无数据';
                Percent='';
            }
            if (Percent) Percent = formatFloat(Percent, 2) + '%';
            var _h = _herf || herf;
            _h = _h.replace('{year}', y);
            if (!country)
                str += '<td style="white-space: normal;width: 248px;"> ' + rank + '<a href="' + _h + name + '" target="_blank"></a><a href="' + _h + encodeURIComponent(name) + '" target="_blank">' + name + ' ' + Percent + '</a> </td>';
            else
                if (_h.indexOf('chinaDetail') == -1)
                    str += '<td style="white-space: normal;width: 248px;"> ' + rank + '<a href="' + _h + name + '" target="_blank"></a><a href="' + _h + encodeURIComponent(name) + '" target="_blank">' + name + '(' + country + ') ' + Percent + '</a> </td>';
                else
                    str += '<td style="white-space: normal;width: 248px;"> ' + rank + '<a href="' + _h + name + '" target="_blank"></a><a href="' + _h + encodeURIComponent(country) + '" target="_blank">' + name + '(' + country + ') ' + Percent + '</a> </td>';
            $(trid[j]).html(str);
        }
        if (k != null) {
            if (y) {
                $(trid[k] + 'Y').text(y);
                $(trid[k] + 'N').attr('href', $(trid[k] + 'N').attr('href').replace('@@', y));
            } else {
                $(trid[k] + 'N').attr('href', 'javascript:void(0)');
            }
        }
    };

    //注册弹出详情页  
    (function () {
        $('#xiangqing').click(function () {
            var company = $('#UrlEncodecompany').val();
            $.ajaxjson('/UIData/ashx/getXiangQingHandler.ashx', { 'action': 'USA', 'cm': company }, function (data) {
                if (data) {
                    //bindData(data[0], '#xiangqingdiv');
                    //var closebtn = $('#xiangqingdiv').find('.close');
                    //closebtn.unbind('click');
                    //closebtn.click(function () {
                    //    hide('xiangqingdiv');
                    //});
                    //showid('xiangqingdiv');
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



    function formatFloat(src, pos) {
        return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    }

    $(function () {
        getData();
        $('#lf .table_b').hide();
        $('#googlesearch').click(function () {
            var company = $('#company').val();
            var u = "http://www.google.com/search?hl=en&newwindow=1&biw=1280&bih=843&q=" + encodeURIComponent(company);
            window.open(u, '', '');
        });

    });

});
