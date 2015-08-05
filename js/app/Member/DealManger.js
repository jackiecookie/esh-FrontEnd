define(['js/common/jqueryDate/jqueryDate', 'pager', 'jquery'
, 'headJs', 'tools', 'js/common/cssSelect/cssSelect'], function (require, exports, module) {
    //如果依赖的js和css特别多的话请在头部声明依赖,防止性能损耗过大
    var datepicker = require('js/common/jqueryDate/jqueryDate'),
    pager = require('pager'),
    $ = require('jquery'),
    autoMenuHeight = require('headJs').autoMenuHeight,
    tool = require('tools');
    require('js/common/cssSelect/cssSelect');
    datepicker([$('#start_time').val(), $('#end_time').val()], function (date) {
        if (date.length > 1) {
            $('#start_time').val(date[0]);
            $('#end_time').val(date[1]);
        } else {
            $('#start_time').val(date[0]);
            $('#end_time').val(date[0]);
        }
    }, null, $('#datepicker'));

    var helper = {
        timeType: {
            DESC: 0,
            ASC: 1
        },
        currentTab: "",
        order: 0,
        PAGE_SIZE: 15,
        //  url_tran: "/Member/ashx/Acount/GetAcount.ashx",
        url_pay: "/Member/ashx/Acount/GetAcount.ashx",
        url_tran: "/Member/ashx/Acount/GetMcVipRecord.ashx",
        createParams_tran: function (pageIndex) {
            var me = helper;
            var params = {
                paymentType: $("#vipsrcType").val(),
                startDate: $("#start_time").val(),
                endDate: $("#end_time").val(),
                pageSize: me.PAGE_SIZE,
                pageNum: pageIndex
            };
            return params;
        },
        createParams_pay: function (pageIndex) {
            var me = helper;
            var params = {
                paymentType: $("#srcType").val(),
                startDate: $("#start_time").val(),
                endDate: $("#end_time").val(),
                pageSize: me.PAGE_SIZE,
                pageNum: pageIndex
            };
            return params;
        },

        init: function (tabs) {
            var me = helper;
            me.tabs = tabs;
            $("#vipsrcType").cssSelect();
            $("#srcType").cssSelect();
            for (var i in me.tabs) {
                $("#" + me.tabs[i] + "-tab").click(me.changeTab);
            }
            $("#search-btn").click(me.initList);
            me.initTabs();
        },

        initTabs: function () {
            var me = helper;
            //me.initTableLoading();
            //if ($("#tab").val() == "flow") {
            //    me.currentTab = "payment";
            //    $("#" + me.currentTab + "-list").show();
            //} else {
            //    me.currentTab = "transaction";
            //    $("#" + me.currentTab + "-list").show();
            //}
            //$("#" + me.currentTab + "-tab").addClass('current');
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
            if (me.currentTab == "vippayment") {
                $("#srcTypeDiv").hide();
                $("#vipsrcTypeDiv").show();
                pager.init(6, me.url_tran, me.createParams_tran, me.renderTBodyForTransaction);
            }
            else {
                $("#vipsrcTypeDiv").hide();
                $("#srcTypeDiv").show();
                pager.init(7, me.url_pay, me.createParams_pay, me.renderTBodyForPayment);
            }
        },

        resetTableRender: function () {
            var me = helper;
            me.order = me.timeType.DESC;
            $("#srcType option[value='0']").attr("selected", true);
            $("#srcType").cssSelect();
        },

        changeTab: function () {
            var me = helper;
            me.resetTableRender();
            me.initTableLoading();
            $(this).addClass('current');
            for (var i in me.tabs) {
                if ($("#" + me.tabs[i] + "-tab").hasClass('current')) {
                    $("#" + me.tabs[i] + "-list").show();
                    me.currentTab = me.tabs[i];
                    continue;
                }
            }
            me.initList();
        },
        clearTableOthers: function () {
            $("#pageNav").hide();
            $("#start_time").val("");
            $("#end_time").val("");
        },


        renderTBodyForTransaction: function (data) {
            var me = helper;
            var info = "";
            if (data.length == 0) {
                info = "<tr class='row'> \
        						<td class='tacenter' colspan='6' style='padding:20px;'>\
        							<span class='ico ico-warning'>没有找到相关数据!</span>\
        						</td> \
        					</tr>";
            } else {
                var vipsrcType = $('#vipsrcType');
                jQuery.each(data, function (index, entityList) {
                    var entity = entityList;
                    var tColor = (index % 2 == 0) ? "" : "alt";
                    var paytypEstr = vipsrcType.find('[value=' + entity.PAYTYPE + ']').text();
                    var buydate = tool.dateHelp.NewDate(entity.VIPBUYTIME).format("yyyy-MM-dd hh:mm:ss");
                    var enddate = tool.dateHelp.NewDate(entity.VIPENDTIME).format("yyyy-MM-dd hh:mm:ss");
                    var yfmy = entity.VIPAMOUNT;
                    var sfmy = entity.PAYMENTAMOUNT;
                    var yhmy = entity.PREFERENTIALACOUNT;
                    info += "<tr class='row " + tColor + "'>\
									<td class='tacenter'>" + paytypEstr + "</td>\
									<td class='tacenter'>" + buydate + "</td>\
                                    <td class='tacenter'>" + enddate + "</td>\
									<td class='tacenter'><span class='torange'>" + yfmy + "</span></td>\
									<td class='tacenter'><span class='torange'>" + sfmy + "</span></td>\
									<td class='tacenter'><span class='tgreen'>" + yhmy + "</span></td>\
								</tr>";
                });
            }
            $("#vippayment-tbinfo").empty();
            $("#vippayment-tbinfo").html(info);
            autoMenuHeight();
        },
        renderTBodyForPayment: function (data) {
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
                    var entity = entityList;
                    var cashId = entityList.idStr;
                    var tColor = (index % 2 == 0) ? "" : "alt";
                    //      var subAccountFlowId = entity.id;
                    var journalTypeDesc = entity.PAY_INCOME_TYPE;
                    var gmtCreated = tool.dateHelp.NewDate(entity.DATETIME).format("yyyy-MM-dd hh:mm:ss");
                    var operateValue = entity.AMOUNT.toFixed(2);
                    var balanceValue = "";
                    var added = "";
                    var subtracted = "";
                    var typeDesc = entity.REMARK;
                    balanceValue = entity.BALANCE.toFixed(2);
                    if (operateValue > 0 || entity.AMOUNT_TYPE == 2) {
                        added = operateValue;
                        subtracted = "";
                    } else if (operateValue < 0 || entity.AMOUNT_TYPE == 1) {
                        subtracted = operateValue;
                        added = "";
                    }

                    info += "<tr class='row " + tColor + "'>\
									<td class='tacenter'>" + journalTypeDesc + "</td>\
									<td class='tacenter'>" + typeDesc + "</td>\
									<td class='tacenter'>" + gmtCreated + "</td>\
									<td class='tacenter'><span class='torange'>" + added + "</span></td>\
									<td class='tacenter'><span class='tgreen'>" + subtracted + "</span></td>\
									<td class='tacenter'><span class='torange'>" + balanceValue + "</span></td>\
								</tr>";
                });
            }
            $("#deal-tbinfo").empty();
            $("#deal-tbinfo").html(info);
            autoMenuHeight();
        }
    };
    var tabs = ["deal", "vippayment"];
    helper.init(tabs);
  //  panelManager.init();
    pager.initClick();
});
