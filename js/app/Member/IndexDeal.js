define(['jquery', 'pager', 'tools'], function (require, exports, module) {
    var pager = require('pager'),
      NewDate = require('tools').dateHelp.NewDate,
    helper = {
        timeType: {
            DESC: 0,
            ASC: 1
        },
        currentTab: "",
        order: 0,
        url_pay: "/Member/ashx/Acount/GetAcount.ashx",

        createParams_pay: function (pageIndex) {
            var me = helper;
            var params = {
                pageSize: $('#pageSize').val(),
                pageNum: pageIndex
            };
            return params;
        },

        init: function (tabs) {
            var me = helper;
            me.tabs = tabs;
            me.initTabs();
        },

        initTabs: function () {
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
            //if (me.currentTab == "payment") {
            $("#tradeTypeDiv").hide();
            $("#paymentTypeDiv").show();
            pager.init(7, me.url_pay, me.createParams_pay, me.renderTBodyForPayment, window.setParentIframeHeight);

        },

        resetTableRender: function () {
            var me = helper;
            me.order = me.timeType.DESC;
            $(".timeChange").removeClass("ico-order-asc").addClass("ico-order-decs");
            $("a.clear-btn").click();

            $("#paymentType option[value='']").attr("selected", true);
            $("#tradeType option[value='1']").attr("selected", true);
            $("#srcType option[value='0']").attr("selected", true);
            $("#paymentType").cssSelect();
            $("#tradeType").cssSelect();
            $("#srcType").cssSelect();
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
                    var gmtCreated = NewDate(entity.DATETIME).format("yyyy-MM-dd hh:mm:ss");
                    var operateValue = entity.AMOUNT.toFixed(2);
                    var balanceValue = "";
                    var added = "";
                    var subtracted = "";
                    var typeDesc = entity.REMARK;
                    balanceValue = entity.BALANCE.toFixed(2);
                    if (operateValue >= 0) {
                        added = operateValue;
                        subtracted = "";
                    } else if (operateValue < 0) {
                        subtracted = operateValue;
                        added = "";
                    } else {
                        if (entity.journalType == dictionary.operateTypeValue.DONGCHONG) {
                            added = operateValue; subtracted = "";
                        } else {
                            added = ""; subtracted = operateValue;
                        }
                    } //<td><a href='#' flowId='"+ cashId + "'>查看详细</a></td>\
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
            $("#payment-tbinfo").empty();
            $("#payment-tbinfo").html(info);



        }
    };
    var panelManager = {
        init: function () {
            var me = panelManager;
            $("a[flowId]").live("click", function () {
                me.showPamentDetail($(this).attr('flowId'));
                return false;
            });
            $(".back_link").click(function () {
                me.showList();
                return false;
            });
        },
        showList: function () {
            $("#payment_detail_area").hide();
            $("#tab_area").show();
            $("#trade_detail_area").hide();
        },
        showPamentDetail: function (flowId) {
            paymentDetailPanel.render(flowId);
            $("#payment_detail_area").show();
            $("#tab_area").hide();
            $("#trade_detail_area").hide();
        }
    };
    (function (window, undefined) {
        window.setParentIframeHeight = function () {
            $('.is-in-iframe').css('display', 'none');
            iframe = document.createElement("iframe");
            //var iframeHeight=$.browser.msie?$("body").height():$("html").height();

            //获取文档的高度 modify 
            var iframeHeight = $(document).height();

            window.top.iframeAdaptiveHeight(iframeHeight);
        }
        $(function () {
            if (window.top == window.self) return;
            window.setParentIframeHeight();
        });
    })(window);
    $(function () {
        var tabs = ["payment"];
        helper.init(tabs);
        panelManager.init();
        pager.initClick();
    });

});




