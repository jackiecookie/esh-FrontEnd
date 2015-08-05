define(['jquery', 'jQueryAjax', 'pager'], function (require, exports, module) {
    var $ = require('jquery');
    var pager = require('pager');
    $('.menu-box .menu-options:eq(3) .menu-items-title:eq(1)').addClass('current');
    var helper = {
        timeType: {
            DESC: 0,
            ASC: 1
        },
        currentTab: "",
        order: 0,
        PAGE_SIZE: 15,
        url_pay: "/Member/ashx/Acount/getoffline.ashx",
      
        createParams_pay: function (pageIndex) {
            var me = helper;
            var params = {
                pageSize: me.PAGE_SIZE,
                pageNum: pageIndex,
                is_check: $('.f-select').val()
            };
            return params;
        },

        init: function () {
            var me = helper;
            me.initList();
        },
        initList: function () {
            var me = helper;
            pager.init(7, me.url_pay, me.createParams_pay, me.renderTBodyForPayment);
          
        },
        renderTBodyForPayment: function (data) {
            var info ,account,money,name,mobile,createTime,state;
            if (data.length == 0) {
                info = "<tr class='row'> \
						<td class='tacenter' colspan='8' style='padding:20px;'>\
							<span class='ico ico-warning'>没有找到相关数据!</span>\
						</td> \
					</tr>";
            } else {
                jQuery.each(data, function(index, entityList) {
                    account = entityList.BANKACCOUNT || '';
                    money = entityList.MONEY || '';
                    name = entityList.NAME || '';
                    mobile = entityList.MOBILE || '';
                    createTime = entityList.CREATEDTIME;
                    state = function(t) {
                        if (t == 0) return '审核中';
                        else if (t == 1) return '通过';
                        else if (t == 2)return '驳回';
                    } (entityList.IS_CHECK);
                    info += '<tr><td>' + name + '</td><td>' + money + '</td><td>' + account + '</td><td>' + mobile + '</td><td>' + createTime + '</td><td>' + state + '</td><td style="width: 24px;"><a href="/Member/Offline/detail/' + entityList.SYSNUMBER + '" target="_self">查看</a></td></tr>';
                });
            }

            $("#offlineListBody").html(info);
        }
    };
    helper.init();
    pager.initClick();
    $('.f-select').bind('change',function() {
        helper.init();
    });
});