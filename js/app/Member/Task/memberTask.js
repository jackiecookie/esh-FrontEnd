define(['pager', 'headJs', 'js/common/cssSelect/cssSelect'], function (require, exports, module) {
    require('js/common/cssSelect/cssSelect');
    var pager = require('pager'),
    autoMenuHeight = require('headJs').autoMenuHeight,
     eshList = {
         url: "/Member/ashx/Task/MemberTask.ashx",
         PAGE_SIZE: 15,
         init: function () {
             var _this = eshList;
             $("#TaskMoneySel").cssSelect();
             $('#srcTypeDiv').MultiCssSelect({
                 url: '/Member/ashx/Task/GetTasktypeTree.ashx',
                 DivElment: $('#srcTypeDiv'),
                 nodeElmentClick: true,
                 ElmText: 'TYPE_NAME'
             });
             $("#search-btn").click(_this.initList);
             eshList.initList();
         },
         initList: function () {
             var _this = eshList;
             pager.init(8, _this.url, _this.createParams, _this.renderTBodyForPayment);
         },
         createParams: function (pageIndex) {
             var _this = eshList;
             var selctedElm = $('#srcTypeDiv .selected');
             var selectbg = selctedElm.find('.smallbg'), isNode = 0;
             if (selectbg[0]) {
                 selectbg = $('.optionBox[for=' + selectbg.next().text() + ']').find('.smallbg');
                 if (selectbg[0]) {
                     isNode = 2;
                 } else {
                     isNode = 1;
                 }
             }
             var typeText = selctedElm.find('span').text();
             if (typeText == '全部') typeText = '';
             var params = {
                 Type: encodeURIComponent(typeText),
                 //beginDate: $("#start_time").val(),
                 //endDate: $("#end_time").val(),
                 //name: $("#Name").val(),
                 pageSize: _this.PAGE_SIZE,
                 pageNum: pageIndex,
                 t: $('#ischeck').val(),
                 isNode: isNode,
                 money: $('#TaskMoneySel').val()
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
                     var col1Value = entity.DEMAND_NAME,
                    col2Value = entity.CREATE_DATE,
                    col3Value = entity.MONEY,
                    col4Value = entity.TENDERSCOUNT,
                    col5Value = function () {
                        switch (entity.STATE) {
                            case 1:
                                return '竞标中';
                                break;
                            case 2:
                                switch (entity.DEMANDSTATS) {
                                    case 3:
                                        return '已中标(附件已上传)';
                                    case 4:
                                        return '任务圆满完成';
                                    case 6:
                                        return '对方已退款成功';
                                    default:
                                        return '已中标(等待上传附件)';
                                }
                            case 3:
                                return '预中标';

                        }
                    } (),
                    fid = entity.DEMAND_ID;
                     info += "<tr class='row'>\
									<td class='tacenter'> <a href='/Demand/Detail/" + fid + "'>" + col1Value + "</a></td>\
									<td class='tacenter'>" + col2Value + "</td>\
									<td class='tacenter'><strong>￥" + col3Value + "</strong></td>\
									<td class='tacenter'>" + col4Value + "</td>\
									<td class='tacenter'>" + col5Value + "</td>\
								</tr>";
                 });
             }
             $("#payment-tbinfo").empty();
             $("#payment-tbinfo").html(info);
             autoMenuHeight();
         }
     }; $(function () {
         eshList.init();
         pager.initClick();
         var isCheck = $('#ischeck').val();
         $('#li' + isCheck).addClass('current');
     });

});






