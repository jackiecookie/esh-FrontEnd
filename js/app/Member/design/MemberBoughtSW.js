define(['jQueryAjax', 'pager', 'js/common/cssSelect/cssSelect', 'headJs', 'js/common/jqueryDate/jqueryDate', 'tools', 'js/app/Design/RenderTypeConver'], function (require, exports, module) {
    require('jQueryAjax');
    require('tools');
    require('js/common/cssSelect/cssSelect');
    var pager = require('pager'),
        autoMenuHeight = require('headJs').autoMenuHeight,
          datepicker = require('js/common/jqueryDate/jqueryDate'),
            renderTypeConver = require('js/app/Design/RenderTypeConver').renderTypeConver,
    eshList = {
        url: "/Member/ashx/MemberDesign/MemberBoughtSW.ashx",
        PAGE_SIZE: 15,
        init: function () {
            var _this = eshList;
            $("#srcType").cssSelect();
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
                RENDER_TYPE: $("#srcType").val(),
                beginDate: $("#start_time").val(),
                endDate: $("#end_time").val(),
                SwName: $("#Name").val(),
                pageSize: _this.PAGE_SIZE,
                pageNum: pageIndex,
                t: $('#ischeck').val()
            };
            return params;
        },
        renderTBodyForPayment: function (data) {
            var info = "", _this = eshList;
            if (data.length == 0) {
                info = "<tr class='row'> \
						<td class='tacenter' colspan='7' style='padding:20px;'>\
							<span class='ico ico-warning'>没有找到相关数据!</span>\
						</td> \
					</tr>";
            } else {
                jQuery.each(data, function (index, entityList) {
                    var entity = entityList;
                    var col1Value = entity.NAME,
                    col2Value = new Date(entity.CREATE_TIME).format('yyyy-MM-dd'),
                    col3Value = entity.PRICE,
                    col4Value = renderTypeConver(entity.IMAGE_WIDTH + "x" + entity.IMAGE_HEIGHT),
                    col5Value = entity.IMAGE_WIDTH + "x" + entity.IMAGE_HEIGHT,
                    col6Value = entity.REMARK == null ? "" : entity.REMARK,
                    fid = entity.SYSNUMBER;
                    info += "<tr class='row' id='" + fid + "'>\
<td class='taleft'><input type='checkbox'  value='" + fid + "'/></td>\
									<td class='tacenter'>" + col1Value + "</td>\
									<td class='tacenter'>" + col2Value + "</td>\
									<td class='tacenter'>" + col3Value + "</td>\
									<td class='tacenter'>" + col4Value + "</td>\
									<td class='tacenter'>" + col5Value + "</td>\
									<td class='tacenter'>" + col6Value + "</td>\
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
        datepicker([$('#start_time').val(), $('#end_time').val()], function (date) {
            if (date.length > 1) {
                $('#start_time').val(date[0]);
                $('#end_time').val(date[1]);
            }
            else {
                $('#start_time').val(date[0]);
                $('#end_time').val(date[0]);
            }
        }, null, $('#datepicker'));

        $("#detail-btn").click(function () {
            var ckeckedbox = $('.tabledv :checked');
            if (ckeckedbox.length == 1) {
                location.href = "/UIDesign/SWBuyDetail/" + ckeckedbox.val();

            } else {
                alert('选中一个三维查看详情');
            }
        });
    });
});





