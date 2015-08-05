define(['pager', 'headJs', 'alertify', 'jQueryAjax', 'jqueryJson'], function (require, exports, module) {
    require('jQueryAjax');
    require('jqueryJson');
    var alertify = require('alertify'),
    pager = require('pager'),
    autoMenuHeight = require('headJs').autoMenuHeight,
    actionURL = "/Member/ashx/Acount/PrivateMemberInfo.ashx",
    eshList = {
        url: actionURL,
        PAGE_SIZE: 15,
        init: function () {
            var _this = eshList;
            $("#search-btn").click(_this.initList);
            _this.initList();
        },
        initList: function () {
            var _this = eshList;
            pager.init(4, _this.url, _this.createParams, _this.renderTBodyForPayment);
        },
        createParams: function (pageIndex) {
            var _this = eshList;
            var params = {
                pageSize: _this.PAGE_SIZE,
                pageNum: pageIndex,
                action: "myPrivateMemberInfo"
            };
            return params;
        },
        renderTBodyForPayment: function (data) {
            var info = "", _this = eshList;
            if (data.length == 0) {
                info = "<tr class='row'> \
						<td class='tacenter' colspan='6' style='padding:20px;'>\
							<span class='ico ico-warning'>没有找到相关数据!</span>\
						</td> \
					</tr>";
            } else {
                jQuery.each(data, function (index, entityList) {
                    var entity = entityList;
                    var col1Value = entity.MEMBERNAME,
                        col2Value = entity.CREATETIME == null ? "" : new Date(entity.CREATETIME).toLocaleDateString(),
                        col3Value = subString(entity.JOINDECLARE),
                        col4Value = entity.CHECKTIME == null ? "" : new Date(entity.CHECKTIME).toLocaleDateString(),
                        fid = entity.CHECKID,
                        relateId = entity.RELATEID,
                        col5Value = (entity.ISCHECK != "1") ? (entity.ISCHECK == "2" ? "已审核" : "审核未通过") : "未审核",
                        col6Value = (entity.ISCHECK != "1") ? (entity.ISCHECK == "2" ? "<a class=\"a1\" href=\"javascript:DelPrivateMember('" + entity.ID + "','" + entity.PRIVATEMEMBER_ID + "')\">撤销会员</a>" : "<a class=\"a1\" href=\"javascript:DeleteRecord('" + entity.CHECK_ID + "','" + relateId + "')\">删除记录</a>") : "<a id='" + fid + "' class=\"a1\" href=\"javascript:CheckMember('" + entity.CHECKID + "','" + entity.PRIVATEMEMBER_ID + "')\">审核</a>";
                    info += "<tr class='row' id='td" + fid + "'>\
									<td class='tacenter'> <a href='javascript:ShowMemberInfo(" + JSON.stringify(entity) + ")'>" + col1Value + "</a></td>\
									<td class='tacenter'>" + col2Value + "</td>\
									<td class='tacenter'>" + col3Value + "</td>\
									<td class='tacenter'>" + col4Value + " </td>\
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
    var subString = function (value) {
        if (value == null || value == "") {
            return "";
        } else if (value.length > 20) {
            return "<a style=\" color: black;text-decoration: none;cursor:text;\" title=\"" + value + "\">" + value.substring(0, 20) + "……" + "</a>";
        }
        return value;
    };

    var createWorkLiveTable = function (obj) {
        var stardate = obj.JOBBEGIN_DATE == null ? "" : new Date(obj.JOBBEGIN_DATE).toLocaleDateString();
        var endDare = obj.JOBEND_DATE == null ? "" : new Date(obj.JOBEND_DATE).toLocaleDateString();
        return ' <tr class="alt"><td>' + obj.COMPANY_NAME + '</td><td>' + obj.POST + '</td><td>' + stardate + '</td><td>' + endDare + '</td></tr>';
    };

    //撤销会员
    exports.DelPrivateMember = function (relateId, memberId) {
        alertify.confirm("确定撤消会员！", function (e) {
            if (e) {
                $.get(actionURL, { relateId: relateId, action: "cancelMember", memberId: memberId }, function (data) {
                    if (data.success) {
                        eshList.init();
                        pager.initClick();
                        alertify.success(data.msg);
                    } else {
                        alertify.error(data.msg);
                    }
                }, "json");
            }
        });
    };
    //审核会员
    //exports.CheckMember = regValidate.CheckMember;
    exports.CheckMember = function (checkId, privateMemberId) {
        alertify.prompt2("", function (e, str, radioVal) {
            if (e) {
                $.get(actionURL, { checkId: checkId, checkReson: str, isCheck: radioVal, action: "check", privateMemberId: privateMemberId }, function (data) {
                    if (data != null) {
                        if (data.success) {
                            eshList.init();
                            pager.initClick();
                            alertify.success(data.msg);
                        } else {
                            alertify.error(data.msg);
                        }
                    }
                }, "json");
            }
        });
    };

    var removeEmpty = function (name, value) {
        for (var i = 0; i < value.length; i++) {
            if (value[i] == null || value[i] == "") {
                value.splice(i, 1);
                name.splice(i, 1);
                removeEmpty(name, value);
            }
        }
    };

    //弹出显示个人基本信息
    exports.ShowMemberInfo = function (soap) {
        var arrayName = ['性别', '昵称', '出生年月', '固定电话', '详细地址', '备用邮箱', 'QQ', '手机'];
        var arrayValue = [soap.SEX, soap.NICKNAME, (soap.BIRTHDAY == null ? "" : soap.BIRTHDAY.split(' ')[0]), soap.TEL, soap.ADDRESS, soap.EMAIL, soap.QQ, soap.CONTACTPHONE];
        removeEmpty(arrayName, arrayValue);
        var html = "<div class=\"bot-un\"><div><fieldset><legend>基本信息</legend><table id=\"basiInfo\"><tr>";
        var isRemove = false;
        for (var i = 0; i < arrayValue.length; i++) {
            html += "<td>" + arrayName[i] + "</td>" + "<td>" + arrayValue[i] + "</td>";
            isRemove = false;
            if (i % 2 == 1) {
                html += "</tr><tr>";
                isRemove = true;
            }
        }
        if (isRemove) {
            html = html.substring(0, html.length - 4);
        }
        html += "</table></fieldset></div><div id=\"workLiveDiv\"></div><div id=\"hobbyDiv\"></div></div>";
        $.get(actionURL, { action: "getJob", memberId: soap.PRIVATEMEMBER_ID }, function (data) {
            if (data != null) {
                if (data.length > 0) {
                    var jobHtml = '<fieldset><legend>工作经历</legend><table  class="worklive1"><thead><tr><th  width="20%">单位名称</th><th  width="20%">职位</th><th  width="20%">开始时间</th><th width="20%">离职时间</th></tr></thead><tbody>';
                    var len = data.length;
                    for (var j = 0; j < len; j++) {
                        jobHtml += createWorkLiveTable(data[j]);
                    }
                    jobHtml += "</tbody></table></fieldset>";
                    $("#workLiveDiv").append(jobHtml);
                }
            }
        }, "json");
        var hobbyTypeName = ["技术类", "贸易", "设计", "管理"];
        $.get(actionURL, { action: "phobby", memberId: soap.PRIVATEMEMBER_ID }, function (hobby) {
            if (hobby != null && hobby != "") {

                if (!hobby.isNull) {
                    var hobbyHtml = '<fieldset><legend>个人专长</legend><table style="width:100%;"  class="hobbyDiv">';
                    if (hobby.typeNames != "")
                        hobbyHtml += '<tr><td class="rightTd">技术类：</td><td class="leftTd" colspan="3">' + hobby.typeNames + "</td></tr>";

                    if (hobby.typeNames2 != "")
                        hobbyHtml += '<tr><td class="rightTd">贸易：</td><td class="leftTd" colspan="3">' + hobby.typeNames2 + "</td></tr>";

                    if (hobby.typeNames3 != "")
                        hobbyHtml += '<tr><td class="rightTd" >设计：</td><td class="leftTd" colspan="3">' + hobby.typeNames3 + "</td></tr>";

                    if (hobby.typeNames4 != "")
                        hobbyHtml += '<tr><td class="rightTd" >管理：</td><td class="leftTd" colspan="3">' + hobby.typeNames4 + "</td></tr>";
                    hobbyHtml += "</tr><table></fieldset>";
                    $("#hobbyDiv").append(hobbyHtml);
                }
            }
        }, "json");

        alertify.alert(html);
    };
    //删除审核未通过记录
    exports.DeleteRecord = function (checkId, relateId) {
        alertify.confirm("确定删除记录！", function (e) {
            if (e) {
                $.get(actionURL, { checkId: checkId, relateId: relateId, action: "delRecord" }, function (data) {
                    if (data.success) {
                        eshList.init();
                        pager.initClick();
                        alertify.success(data.msg);
                    } else {
                        alertify.error(data.msg);
                    }
                }, "json");
            }
        });
    };
    alertify.set({
        labels: {
            ok: "确认",
            cancel: "取消"
        }
    });
    $(function () {
        eshList.init();
        pager.initClick();
    });
});