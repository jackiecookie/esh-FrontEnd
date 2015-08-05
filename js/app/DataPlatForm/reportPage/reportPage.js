define(['jquery'], function (require, exports, module) {
    var domArr = ['#chartdiv', '#monthdiv', '#priceYear', '#priceMonth'];
    var tmpl, laytpl, ajaxObj;
    var yearmodel, monthmodel, priceyearmodel, pricemonthmodel, argArr;

    //报表开始
    var repStatr = function () {
        $.each(domArr, function (index, obj) {
            $(obj).css('height', '400px').css('width', '900px');
        });
        require.async(['js/app/Data/chatComm.js'], function (chatComm) {
            chatComm.Write2line('chartdiv', yearmodel);
            chatComm.Write2line('monthdiv', monthmodel, true);
            if (priceyearmodel && pricemonthmodel) {
                chatComm.write3lines('priceYear', priceyearmodel, false);
                chatComm.write3lines('priceMonth', pricemonthmodel, true);
            } else {
                $('#priceYear').parents('.wrap').remove();
                $('#priceMonth').parents('.wrap').remove();
            }
        });
    };

    //表格开始
    var listStart = function () {
        var getDivIndex = function(e) {
            var currentEl = $(e).parents('.table_a').parent();
            var result;
            $.each(domArr, function(i, obj) {
                if ($(obj)[0] == currentEl[0]) {
                    result = i;
                    return false;
                }
            });
            return result;
        };
        $('.content_4').removeClass('content_4');
        var initRenderList = function (orderObj, divIndex) {
            return function (dataArr) {
                if (dataArr.resultYear) {
                    var _arr = [dataArr.resultYear, dataArr.resultMonth, dataArr.priceResultYear, dataArr.priceResultMonth];
                    dataArr = _arr;
                }
                var data = {};
                var getOrderfn = function (col) {
                    if (col == orderObj.col) {
                        return orderObj.type;
                    }
                    return "asc";
                };
                $.each(dataArr, function (index, obj) {
                    if (divIndex==void (0) || divIndex == index) {
                        if (obj && obj[0]) {
                            data.List = obj;
                            data.ValueTitle = obj[0].ValueTitle || '最高价(美元)';
                            data.Value1Title = obj[0].Value1Title || '最低价(美元)';
                            data.Value3Title = obj[0].Value3 > 0 ? '平均价(美元)' : void (0);
                            data.order1 = getOrderfn('时间');
                            data.order2 = getOrderfn(data.ValueTitle);
                            data.order3 = getOrderfn(data.Value1Title);
                            data.order4 = getOrderfn(data.Value3Title);
                            laytpl(tmpl).render(data, function (html) {
                                $(domArr[index]).html(html);
                            });
                        } else {
                            $(domArr[index]).parents('.wrap').remove();
                        }
                    }
                });

                $('.table_ath .txt_cen').on('mouseover', function () {
                    var elm = $(this).find('i');
                    if (!elm.hasClass('order')) {
                        elm.addClass('order');
                    }
                }).on('mouseout', function () {
                    var elm = $(this).find('i');
                    if (elm.hasClass('order')) {
                        elm.removeClass('order');
                    }
                }).on('click', function () {
                    var self = $(this);
                    var elm = self.find('i');
                    var orderObj = {};
                    orderObj.col = $.trim(self.text());
                    orderObj.type = elm.hasClass('desc') ? 'asc' : 'desc';
                    var listfn = initRenderList(orderObj, getDivIndex(self));
                    var para = location.href.split('?')[1] + '&configKey=' + $('#configKey').val() + '&country=' + $('#countryStr').val() + '&type=' + $('#typeStr').val() + '&order=' + orderObj.col + ',' + (orderObj.type == 'asc' ? 'desc' : 'asc');
                    var ashxUrl = '/UIData/ashx/GetListReport/GetListReport.ashx';
                    $.ajaxjson(ashxUrl, para, listfn);
                });
            };
        };

        require.async(['js/app/DataPlatForm/reportPage/listTmpl.js', 'laytpl'], function (tmplobj, laytplobj) {
            tmpl = tmplobj;
            laytpl = laytplobj;
            var orderObj = {
                col: "时间",
                type: "desc"
            };
            initRenderList(orderObj)(argArr);
        });
        require.async(['jQueryAjax'], function (obj) {
            ajaxObj = obj;
        });

    };

    module.exports = function (isList, arg) {
        yearmodel = arg.yearmodel;
        monthmodel = arg.monthmodel;
        priceyearmodel = arg.priceyearmodel;
        pricemonthmodel = arg.pricemonthmodel;
        argArr = [yearmodel, monthmodel, priceyearmodel, pricemonthmodel];
        if (!isList) {
            repStatr();
        } else {
            listStart();
        }
    };
});