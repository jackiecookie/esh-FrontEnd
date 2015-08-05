define(['pager', 'headJs', 'js/common/cssSelect/cssSelect', 'js/common/jqueryDate/jqueryDate', 'layerExt', 'alertify', 'jQueryAjax'], function (require, exports, module) {
    require('js/common/cssSelect/cssSelect');
    require('jQueryAjax');
    var layer = require('layerExt'),
    alertify = require('alertify'),
    pager = require('pager'),
         datepicker = require('js/common/jqueryDate/jqueryDate'),
    autoMenuHeight = require('headJs').autoMenuHeight,
    actionURL = "/Member/ashx/Task/demandtask.ashx",
    eshList = {
        url: "/Member/ashx/Task/MemberDemand.ashx",
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
                beginDate: $("#start_time").val(),
                endDate: $("#end_time").val(),
                name: encodeURIComponent($("#Name").val()),
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
                    var entity = entityList,
                    col1Value = entity.DEMAND_NAME,
                    col2Value = entity.CREATE_DATE,
                    col3Value = entity.MONEY == null ? 0 : entity.MONEY,
                    col4Value = entity.TENDERSCOUNT == null ? 0 : entity.TENDERSCOUNT,
                    col5Value = function () {
                        switch (entity.STATUS) {
                            case 1:
                                return '竞标中';
                                break;
                            case 2:
                                return '等待上传源文件';
                                break;
                            case 3:
                                return '源文件已上传等待确认';
                                break;
                            case 4:
                                return '圆满完成';
                                break;
                            case 5:
                                return '交易关闭';
                                break;
                            case 6:
                                return '已申请退款';
                                break;
                            case 7.1:
                                return '等待设置赏金';
                                break;
                            case 7.2:
                                return '等待确认需求';
                                break;

                        }
                    } (),
                    fid = entity.DEMAND_ID,
                    col6Value = entity.STATUS >= 7 ? "<a href=\"javascript:deldemand('" + fid + "')\">删除</a>/" : "删除 /";
                    col6Value += (entity.STATUS >= 7 || entity.STATUS == 5) ? "<a href=\"" + function () {
                        //                        switch (entity.STATUS) {
                        //                            case 7.1:
                        //                                return '/Demand/StepAll/' + fid;
                        //                                break;
                        //                            case 7.2:
                        return '/Demand/StepAll/' + fid;
                        //                                break;

                        //                        }
                    } () + "\">编辑</a> /" : "编辑 /";
                    col6Value += entity.STATUS == 3 ? "<a href=\"javascript:checkapply('" + fid + "')\" class='a1'>申请退款</a>" : entity.STATUS == 1 && entity.ISTRUSTEESHIP == 1 ? "<a href=\"javascript:checkapply('" + fid + "','closeTheTask')\" class='a1'>关闭任务</a>" : "申请退款";
                    info += "<tr class='row' id='td" + fid + "'>\
									<td class='tacenter'> <a href='" + function () {
									    switch (entity.STATUS) {
									        case 7.1:
									            return '/Demand/Step2/' + fid;
									            break;
									        case 7.2:
									            return '/Demand/Step3/' + fid;
									            break;
									        default:
									            return '/Demand/Detail/' + fid;
									            break;
									    }
									} () + "'>" + col1Value + "</a></td>\
									<td class='tacenter'>" + col2Value + "</td>\
									<td class='tacenter'><strong>￥" + col3Value + "</strong></td>\
									<td class='tacenter'>" + col4Value + "</td>\
									<td class='tacenter'>" + col5Value + "</td>\
									<td class='tacenter'>" + col6Value + " </td>\
								</tr>";
                });
            }
            $("#payment-tbinfo").empty();
            $("#payment-tbinfo").html(info);
            autoMenuHeight();

        }
    };

    alertify.set({
        labels: {
            ok: "确认",
            cancel: "取消"
        }
    });
    var delconfirm = function (fun) {
        alertify.confirm("确认删除吗？？？", function (e) { if (e) fun(); });
    };

    exports.deldemand = function (id) {
        delconfirm(function () {
            $.ajaxjson(actionURL, "action=deldemadn&id=" + id, function (d) {
                if (d != null && d != undefined) {
                    if (d.Success) {
                        $("#td" + id).remove();
                    } else {
                        if (d.Data == -1) {
                            showLoginForm();
                        } else
                            msg.error(d.Message);
                    }
                } else
                    msg.error("删除失败");
            }, { Message: "正在删除,请稍后...", LoadingType: 2, IsShowLoading: false });
        });
    };

    exports.checkapply = function (id, action) {
        if (!action) {
            action = 'refunds';
            layer.prompt({ title: '请填写您的退款理由', type: 3 }, function (val, index) {
                refunds(action, id, val, index);
            });
        } else {

            alertify.confirm("如果确认关闭任务,此任务将无法恢复。是否确认关闭此任务", function (e) { if (e) refunds(action, id); });

        }
    };
    var refunds = function (action, id, val, index) {
        $.ajaxjson(actionURL, "action=" + action + "&id=" + id + '&liyou=' + val, function (d) {
            if (d != null && d != undefined) {
                if (index)
                    layer.close(index);
                if (d.Success) {
                    // window.location = "task-apply.aspx?t=" + id;
                    layer.alert(d.Message, 1, function () {
                        location.reload();
                    });
                } else {
                    if (d.Data == -1) {
                        showLoginForm();
                    } else
                        msg.error(d.Message);
                }
            } else
                msg.error("系统繁忙");

        }, { Message: "正在提交,请稍后...", LoadingType: 2, IsShowLoading: false });
    };

    $(function () {
        eshList.init();
        pager.initClick();
        var isCheck = $('#ischeck').val();
        $('#li' + isCheck).addClass('current');
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
    });
});




