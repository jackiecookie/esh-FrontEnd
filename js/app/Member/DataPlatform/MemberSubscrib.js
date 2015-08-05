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
        url_pay: "/Member/ashx/DataPlatform/GetSubscrib.ashx",

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
                    if (!entityList.PARAMETER) entityList.PARAMETER = '';
                    var fid = entityList.SUBSCRIB_ID,
                    col1Value = entityList.COMPANY_NAME,
                    col2Value = entityList.COUNTRY;
                    var href = '/Company/{0}Detail?cn={1}'.replace('{0}', col2Value).replace('{1}', encodeURIComponent((function () {
                        var name = col1Value;
                        name = name.replace(/[']/g, "&zsyh");
                        var reg = new RegExp("[(][a-zA-Z]{2}[)]");
                        var regTest = reg.test(name);
                        if (regTest) {
                            name = name.replace(reg, '');
                        }
                        return $.trim(name);
                    } ()))) + entityList.PARAMETER;
                    info += "<tr class='row" + fid + "'>\
                <td class='taleft'><input type='checkbox' value='" + fid + "'/></td>\
									<td class='tacenter'> " + col1Value + "</td>\
									<td class='tacenter'>" + col2Value + "</td>\
									<td class='tacenter'><span class='torange'><a href='" + href + "' target='_blank'>查询<a></span></td>\
								</tr>";
                });
            }
            $("#payment-tbinfo").empty();
            $("#payment-tbinfo").html(info);
            autoMenuHeight();
        }
    };

    var btnHandel = {
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
                $.post('/Member/ashx/DataPlatform/ProMemberSubscrib.ashx?action=del', { searchId: o }, function (data) {
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
                alert('请至少选中一个进行删除');
            }
        }
    };
    $(function () {
        helper.init();
        pager.initClick();
        $('#delete-btn').click(btnHandel.del);
    });
});


