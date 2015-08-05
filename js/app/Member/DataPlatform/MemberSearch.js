define(['pager', 'headJs'], function (require, exports, module) {
    var pager = require('pager'),
    autoMenuHeight = require('headJs').autoMenuHeight,
        helper = {
            timeType: {
                DESC: 0,
                ASC: 1
            },
            currentTab: "",
            order: 0,
            PAGE_SIZE: 15,
            url_pay: "/Member/ashx/DataPlatform/MemberSearch.ashx",

            createParams_pay: function (pageIndex) {
                var me = helper;
                var country = $('#country');
                var params = {
                    country: country.val(),
                    area: country.attr('area'),
                    pageSize: me.PAGE_SIZE,
                    pageNum: pageIndex
                };
                return params;
            },

            init: function () {
                var me = helper;
                me.initList();
            },


            initTableLoading: function () {
                var me = helper;
                for (var i in me.tabs) {
                    $("#" + me.tabs[i] + "-tab").removeClass('current');
                    $("#" + me.tabs[i] + "-tbinfo").html('<tr><td colspan="7"><div class="tableLoading"></div></td></tr>');
                    $("#" + me.tabs[i] + "-list").hide();
                }
            },

            initList: function () {
                var me = helper;
                $("#tradeTypeDiv").hide();
                $("#paymentTypeDiv").show();
                pager.init(7, me.url_pay, me.createParams_pay, me.renderTBodyForPayment);

            },
            renderTBodyForPayment: function (data, isdel, url) {


                var me = helper;
                var info = "";
                if (data.length == 0) {
                    info = "<tr class='row'> \
						<td class='tacenter' colspan='8' style='padding:20px;'>\
							<span class='ico ico-warning'>没有找到相关数据!</span>\
						</td> \
					</tr>";
                } else {
                    jQuery.each(data, function (index, entityList) {
                        entityList.SEARCH_JSON = entityList.SEARCH_JSON.replace(/\"\"/g, "&quot;\"");
                        var json = eval('(' + entityList.SEARCH_JSON + ')');
                        var para = JsonToPara(json);
                        var tdHtml = ColKey(json, entityList.COUNTRY);
                        url = url.indexOf('{0}') == -1 ? url : url.replace('{0}', entityList.COUNTRY);
                        info += "<tr class='row" + entityList.SEARCHCRITERIA + "'><td class='taleft'><input type='checkbox' value='" + entityList.SEARCHCRITERIA + "'/></td>" + tdHtml + "	<td class='tacenter'><span class='torange'><a href='" + url + "?" + para + "' target='_blank'>查询<a></span></td>\
								</tr>";
                    });
                }
                $("#payment-tbinfo").empty();
                $("#payment-tbinfo").html(info);
                autoMenuHeight();
            }
        },

        JsonToPara = function (data) {
            var para = new Array();
            $.each(data, function (k, v) {
                para.push(k + '=' + encodeURIComponent(v));
            });
            return para.join('&');
        },

        ColKey = function (data, country) {
            var htmlArr = new Array();
            var colTh = $('.gridTable .head th[cloKey]'), regex = /[^A-Za-z0-9]/;
            for (var i = 0, colThlen = colTh.length; i < colThlen; i++) {
                var key = $(colTh[i]).attr('cloKey');
                var filter = $(colTh[i]).attr('filter');
                var fh = key.match(regex);
                var keyStr = fh && key.split(fh[0]);
                htmlArr.push("<td class='tacenter'>" + function () {
                    var result = '';
                    if (keyStr && keyStr.length > 1) {
                        result = new Array();
                        for (var j = 0, len = keyStr.length; j < len; j++) {
                            if (data[keyStr[j]])
                                result.push(data[keyStr[j]]);
                            else
                                result.push('没选择');
                        }
                        return result.join(fh);
                    } else {
                        result = data[key];
                        if (filter) {
                            filter = filter.split(":");
                            if (result == filter[0]) {
                                result = filter[1];
                            } else {
                                if (country == 'panama') {
                                    result = '无该搜索条件';
                                } else {
                                    result = filter[2];
                                }
                            }
                        }
                        if (!result) result = '没选择';
                    }
                    return result;
                } () + "</td>");
            }
            return htmlArr.join('');
        },

        btnHandel = {
            del: function () {
                var ckeckedbox = $(':checked');
                if (ckeckedbox.val()) {
                    var o;
                    ckeckedbox.each(function (i, n) {
                        var a = $(n).val();
                        if (o)
                            o = o + a + "_";
                        else
                            o = a + "_";
                    });
                    $.post('/Member/ashx/DataPlatform/ProMemberSearch.ashx?action=del', { searchId: o }, function (data) {
                        if (data == 'ok') {
                            ckeckedbox.each(function (i, n) {
                                var a = $(n).val();
                                $('#' + a).remove();
                                var dataTr = $('#tbody tr');
                                if (dataTr.length == 0) {
                                    helper.initList();
                                }
                            });
                        }
                    });
                } else {
                    alert('请至少选中一个搜索进行删除');
                }
            }
        };

    $(function () {
        helper.init();
        pager.initClick();
        $('#delete-btn').click(btnHandel.del);
    });
});


