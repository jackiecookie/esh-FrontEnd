define(['pager', 'headJs', 'alertify', 'jQueryAjax'], function (require, exports, module) {
    require('jQueryAjax');
    var alertify = require('alertify'),
    pager = require('pager'),
    autoMenuHeight = require('headJs').autoMenuHeight,
    actionURL = "/Member/ashx/Acount/JoinCompany.ashx",
    joinedCompanyName = "", //已加入的企业会员名称
    isJoined = 0,
    eshList = {
        url: actionURL,
        PAGE_SIZE: 15,
        init: function () {
            var _this = eshList;
            $("#search-btn").click(_this.initList);
            _this.getJoinedCompanyInfo();
            //todo 以后注释掉
            //$("#companyName").val("杭州");
            //_this.initList();
        },
        getJoinedCompanyInfo: function () {
            $.get(actionURL, { action: "getJoinedCompany" }, function (data) {
                var info = "";
                if (data.success) {
                    var quit = ')&nbsp;&nbsp;<a style="color: rgb(0, 102, 204);" ';
                    joinedCompanyName = data.companyName;
                    isJoined = data.ischeck;
                    if (data.ischeck == "1")
                        info += "(您已申请加入企业：" + data.companyName + ",请等待审核结果！" + quit + "href=\"javascript:quitCompany('" + data.memberId + "',1);\">" + "退出申请</a>";
                    else if (data.ischeck == "2") {
                        info += "(您已加入企业：" + data.companyName + quit + "href=\"javascript:quitCompany('" + data.memberId + "',2);\">" + "退出企业</a>";
                    }
                    $("#companyJoinInfo").empty();
                    $("#companyJoinInfo").html(info);
                } else {
                    $("#companyJoinInfo").empty();
                }
            }, "json");
        },
        initList: function () {
            var _this = eshList;
            var companyName = $("#companyName").val();
            if (companyName != "") {
                pager.init(4, _this.url, _this.createParams, _this.renderTBodyForPayment);
            } else {
                alertify.alert("请输入公司名称！");
                //$(".tableLoading").css("background-image", "none");
                pager.init(4, _this.url, _this.createParams, _this.renderTBodyForPayment(null));
                return false;
            }
        },
        createParams: function (pageIndex) {
            var _this = eshList;
            var params = {
                pageSize: _this.PAGE_SIZE,
                pageNum: pageIndex,
                companyName: $("#companyName").val(),
                action: "companyMemberInfo"
            };
            return params;
        },
        renderTBodyForPayment: function (data) {
            var info = "", _this = eshList;
            if (data.length == 0) {
                info = "<tr class='row'> \
						<td class='tacenter' colspan='4' style='padding:20px;'>\
							<span class='ico ico-warning'>没有找到相关数据!</span>\
						</td> \
					</tr>";
            } else {
                jQuery.each(data, function (index, entityList) {
                    var entity = entityList,
                        col1Value = getValue(entity.COMPANY_NAME),
                        col2Value = entity.MEMBER_TYPE,
                        col3Value = getValue(entity.LEGALPERSON),
                        fid = entity.MEMBER_ID,
                        col4Value = (joinedCompanyName == entity.COMPANY_NAME) ? ((isJoined == 1) ? "<span href=\"javascript:void(0)\" class=\"a1\">已申请加入</span>" : "<span href=\"javascript:void(0)\" class=\"a1\">已是此企业会员</span>") : "<a href=\"javascript:JoinInCompany('" + fid + "');\" class=\"a1\">申请加入</a>";
                    info += "<tr class='row' id='td" + fid + "'>\
									<td class='tacenter'> <a href=''>" + col1Value + "</a></td>\
									<td class='tacenter'>" + col2Value + "</td>\
									<td class='tacenter'>" + col3Value + "</td>\
									<td class='tacenter'>" + col4Value + " </td>\
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
    var getValue = function (value) {
        if (value == null || value == "undefined") {
            return "";
        }
        return value;
    };
    exports.quitCompany = function (memberId, type) {
        alertify.confirm("是否确定退出！", function (e) {
            if (e) {
                $.get(actionURL, { action: "quitCompany", memberId: memberId, type: type }, function (data) {
                    if (data != null) {
                        if (data.success) {
                            joinedCompanyName = "";
                            isJoined = 0;
                            eshList.init();
                            pager.initClick();
                            //eshList.initList();
                            alertify.success(data.msg);
                        } else {
                            alertify.error(data.msg);
                        }
                    }
                }, "json");
            }
        });
    };
    exports.JoinInCompany = function (memberId) {
        if (isJoined == 1) {
            alertify.alert("您已申请加入企业：" + joinedCompanyName + ",不能再申请加入其他企业.");
            return;
        }
        else if (isJoined == 2) {
            alertify.alert("您已加入企业：" + joinedCompanyName + ",不能再申请加入其他企业");
            return;
        }
        alertify.prompt("申请加入说明", function (e, str) {
            if (e) {
                if (str == "" || str == null) {
                    alertify.error("请输入加入说明！");
                    return;
                }
                $.ajax({
                    type: "GET",
                    url: actionURL,
                    data: { memberId: memberId, joinDeclare: str, action: "joinCompany" },
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            eshList.init();
                            pager.initClick();
                            alertify.success(data.msg);
                        } else {
                            alertify.error(data.msg);
                        }

                    },
                    error: function () {
                    }
                });
            } else {
                //alertify.error("点击取消");
            }
        }, "");
    };
    $(function () {
        eshList.init();
        pager.initClick();
    });
});