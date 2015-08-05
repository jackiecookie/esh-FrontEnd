define(['pager', 'headJs', 'layer'], function (require, exports, module) {
    require('layer');
    var pager = require('pager'),
    autoMenuHeight = require('headJs').autoMenuHeight,
eshList = {
        url: "/Member/ashx/Task/TaskManage.ashx",
        PAGE_SIZE: 15,
        init: function () {
            var _this = eshList;
            $("#search-btn").click(_this.initList);
            eshList.initList();
        },
        initList: function () {
            var _this = eshList;
            pager.init(8, _this.url, _this.createParams, _this.renderTBodyForPayment);
        },
        createParams: function (pageIndex) {
            var _this = eshList;
            var params = {
                pageSize: _this.PAGE_SIZE,
                pageNum: pageIndex,
                Name: encodeURIComponent($('#Name').val())
            };
            return params;
        },
        renderTBodyForPayment: function (data) {
            var info = "", _this = eshList;
            if (data.length == 0) {
                info = "<tr class='row'> \
						<td class='tacenter' colspan='8' style='padding:20px;'>\
							<span class='ico ico-warning'>没有找到相关数据!</span>\
						</td> \
					</tr>";
            } else {
                jQuery.each(data, function (index, entityList) {
                    var entity = entityList;
                    var col1Value = entity.APPLY_DATE,
                    col2Value = entity.DEMAND_NAME,
                    col3Value = entity.MONEY,
                    col5Value = entity.IS_REFUND == "-1" ? "处理中..." : entity.IS_REFUND == "1" ? "退款成功" : "退款失败";
                    fid = entity.DEMAND_ID;
                    info += "<tr class='row'>\
									<td class='tacenter'>" + col1Value + "</td>\
									<td class='tacenter'>" + col2Value + "</td>\
									<td class='tacenter'><strong>￥" + col3Value + "</strong></td>\
									<td class='tacenter'>" + col5Value + "</td>\
                                    <td class='tacenter'>" + (entity.IS_REFUND == 0 ? "<a href='javascript:void(0)' onclick='layer.alert(\"" + entity.REFUNDREASON + "\", 8,\"失败原因\");'>查看</a>" : "<a href='/Demand/Detail/" + entity.DEMAND_ID + "'>查看</a>") + "</td>\
								</tr>";
                });
            }
            $("#payment-tbinfo").empty();
            $("#payment-tbinfo").html(info);
            autoMenuHeight();
        }
    };
    $(function () {
        eshList.init();
        pager.initClick();
    });
});





