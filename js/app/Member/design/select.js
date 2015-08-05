define(['jQueryAjax', 'pager', 'js/common/cssSelect/cssSelect', 'headJs'], function (require, exports, module) {
    var jQueryAjax = require('jQueryAjax');
    require('js/common/cssSelect/cssSelect');
    var pager = require('pager'),
        createParam = jQueryAjax.createParam,
        eshList = {
            url: "/Member/ashx/MemberDesign/MemberFabric.ashx",
            PAGE_SIZE: 15,
            selectType: 1,
            init: function (param) {
                var _this = eshList;
                if (param && param.selectType) {
                    _this.selectType = param.selectType;
                }
                if (param && param.url) {
                    _this.url = param.url;
                }
                if (param && param.size) {
                    _this.PAGE_SIZE = param.size;
                }
                $("#search-btn").click(_this.initList);
                eshList.initList();
                pager.initClick();
            },
            initList: function () {
                var _this = eshList;
                pager.init(8, _this.url, _this.createParams, _this.renderTBodyForPayment, _this.initPage);
            },
            createParams: function (pageIndex) {
                var _this = eshList;
                var params = null;
                if (_this.selectType == 1) {
                    params = {
                        fnumber: encodeURIComponent($("#iptfnumber").val()),
                        name: encodeURIComponent($("#iptname").val()),
                        guige: encodeURIComponent($("#iptguige").val()),
                        pageSize: _this.PAGE_SIZE,
                        pageNum: pageIndex,
                        action: "component"
                    };
                }
                else if (_this.selectType == 2) {
                    params = {
                        number: encodeURIComponent($("#iptnumber").val()),
                        qssj: encodeURIComponent($("#iptBeginTime").val()),
                        jssj: encodeURIComponent($("#iptEndTime").val()),
                        chengfei: encodeURIComponent($("#iptchengfei").val()),
                        guxing: encodeURIComponent($("#iptguxing").val()),
                        longvalue: encodeURIComponent($("#iptlongvalue").val()),
                        yaname: encodeURIComponent($("#iptYaName").val()),
                        pageSize: _this.PAGE_SIZE,
                        pageNum: pageIndex,
                        action: "price"
                    };
                }
                return params;
            },
            getItemHtml: function (dataItem) {
                var c = this;
                var itemHtml = "";
                var entity = dataItem;
                if (c.selectType == "1") {
                    sysnumber = entity.SYSNUMBER == null ? "" : entity.SYSNUMBER,
                eFnumber = entity.ELEMENT_FNUMBER == null ? "" : entity.ELEMENT_FNUMBER,
                eName = entity.ELEMENT_NAME == null ? "" : entity.ELEMENT_NAME,
                fnumber = entity.FNUMBER == null ? "" : entity.FNUMBER,
                name = entity.NAME == null ? "" : entity.NAME,
                longvalue = entity.LONGVALUE == null ? "" : entity.LONGVALUE,
                guxing = entity.GUXIANG == null ? "" : entity.GUXIANG,
                chengfei = entity.CHENGFEI == null ? "" : entity.CHENGFEI,
                itemHtml = "<tr class='row' id='" + sysnumber + "' >\
<td class='tacenter'><input type='radio' name='rdoComponert' class='rdoComponert' value='" + sysnumber + "' dataname='" + eName + "' fnumber='" + fnumber + "' guxing='" + guxing + "' chengfei='" + chengfei + "' specname='" + name + "' dataspec='" + longvalue + "' /></td>\
									<td class='tacenter'>" + eFnumber + "</td>\
									<td class='tacenter'>" + eName + "</td>\
									<td class='tacenter'>" + fnumber + "</td>\
									<td class='tacenter'>" + name + "</td>\
									<td class='tacenter'>" + longvalue + "</td>\
									<td class='tacenter'>" + guxing + "</td>\
										<td class='tacenter'>" + chengfei + "</td>\
								</tr>";
                }
                else if (c.selectType == "2") {
                    sysnumber = entity.SYSNUMBER == null ? "" : entity.SYSNUMBER,
                sj = entity.SJ == null ? "" : entity.SJ,
                timeStart = entity.SXSJ == null ? "" : entity.SXSJ,
                yarngrade = entity.YARNGRADE == null ? "" : entity.YARNGRADE,
                yanrnproarea = entity.YARNPROAREA == null ? "" : entity.YARNPROAREA,
                price = entity.PRICE == null ? "" : entity.PRICE,
                keshou = entity.KESHOU == null ? "" : entity.KESHOU,
                guxiang = entity.GUXIANG == null ? "" : entity.GUXIANG,
                chengfei = entity.CHENGFEI == null ? "" : entity.CHENGFEI,
                itemHtml = "<tr class='row' id='" + sysnumber + "' >\
<td class='tacenter'><input type='radio' name='rdoComponert' class='rdoComponert' value='" + sysnumber + "' dataprice='" + price + "' /></td>\
									<td class='tacenter'>" + sj + "</td>\
									<td class='tacenter'>" + timeStart + "</td>\
									<td class='tacenter'>" + yarngrade + "</td>\
									<td class='tacenter'>" + yanrnproarea + "</td>\
									<td class='tacenter'>" + price + "</td>\
									<td class='tacenter'>" + keshou + "</td>\
								    <td class='tacenter'>" + guxiang + "</td>\
									<td class='tacenter'>" + chengfei + "</td>\
								</tr>";
                }
                return itemHtml;
            },
            initPage: function (initJosn) {
                if (initJosn && initJosn.minPrice && initJosn.maxPrice && initJosn.avgPrice) {
                    $("#spanPrice").html("最低价" + initJosn.minPrice + "最高价" + initJosn.maxPrice + "平均价" + initJosn.avgPrice);
                }
            },
            renderTBodyForPayment: function (data) {
                var c = eshList;
                var info = "", _this = eshList;
                if (!data || data.length == 0) {
                    info = "<tr class='row'> \
						<td class='tacenter' colspan='8' style='padding:20px;'>\
							<span class='ico ico-warning'>没有找到相关数据!</span>\
						</td> \
					</tr>";
                } else {
                    jQuery.each(data, function (index, entity) {
                        info += _this.getItemHtml(entity);
                    });
                }
                $("#payment-tbinfo").empty();
                $("#payment-tbinfo").html(info);
                c.bindSelectEvents();
            },
            bindSelectEvents: function () {
                $('#payment-tbinfo').find("tr").click(function () {
                    $(this).addClass("selecttr").siblings("tr").removeClass("selecttr");
                    $(this).find(".rdoComponert").prop("checked", true);
                });
            }

        };

    module.exports = eshList;
});




