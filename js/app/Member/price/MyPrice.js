define(['jQueryAjax', 'pager', 'js/common/cssSelect/cssSelect', 'headJs', 'layer', 'layerExt', 'laytpl'], function (require, exports, module) {
    var jQueryAjax = require('jQueryAjax');
    var layer = require('layer'); 
    var laytpl = require("laytpl");
    require('js/common/cssSelect/cssSelect');
    var pager = require('pager'),
        autoMenuHeight = require('headJs').autoMenuHeight,
        createParam = jQueryAjax.createParam,
        eshList = {
            url: "/Member/ashx/Price/MyPrice.ashx",
            PAGE_SIZE: 15,
            //selectCss: 'bggary',
            init: function () {
                $("#ddlType").cssSelect();
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
                    type: $('#ddlType').val(),
                    name: encodeURIComponent($("#txtName").val()),
                    pageSize: _this.PAGE_SIZE,
                    pageNum: pageIndex,
                    t: $('#ischeck').val()
                };
                return params;
            },
            renderTBodyForPayment: function (data) {
                var info = "", _this = eshList;
                if (!data || data.length == 0) {
                    info = "<tr class='row'> \
						<td class='tacenter' colspan='8' style='padding:20px;'>\
							<span class='ico ico-warning'>没有找到相关数据!</span>\
						</td> \
					</tr>";
                } else {
                    jQuery.each(data, function (index, entityList) {
                        var entity = entityList;
                        var Name = entity.COLLECTNAME,
                    createTime = entity.COLLECTTIME,
                    fid = entity.SYSNUMBER;
                        var TypeName = "";  //收藏类型 1：单品核价，2:套件核价，3:自由核价,4：面料核价
                        //var urlHref = "/singlepricing/singleresult?ks=" + fid + "&pricetype=";
                        switch (entity.COLLECTTYPE) {
                            case "1":
                                TypeName = "单品核价";
                                break;
                            case "2":
                                TypeName = "套件核价";
                                break;
                            case "3":
                                TypeName = "自由核价";
                                break;
                            case "4":
                                TypeName = "面料核价";
                                break;
                        }

                        info += "<tr class='row' >\
									<td class='tacenter'>" + Name + "</td>\
									<td class='tacenter'>" + TypeName + "</td>\
									<td class='tacenter'>" + createTime + "</td>\
									<td class='tacenter'><a href='javascript:void(0);' data-type='" + entity.COLLECTTYPE + "' data='" + entity.RECORDID + "' class='DetailA'>查 看</td>\
								</tr>";
                    });
                }
                $("#payment-tbinfo").empty();
                $("#payment-tbinfo").html(info);
                $(".DetailA").click(function () {
                    var type = $(this).attr("data-type");
                    var fid = $(this).attr("data");
                    switch (type) {
                        case "1": case "2": case "3":
                            location.href = "/singlepricing/singleresult?ks=" + fid + "&pricetype=" + type;
                            break;
                        case "4":
                            $.ajaxjson("/UIPricing/ashx/FabricPricingHandler.ashx", createParam("GetCostComputeById", fid), function (d) { 
                                //同步渲染 模板引擎
                                var resultTemplate = laytpl($("#resultTemplate").html()).render(d.Data);
                                $("#priceResult").html(resultTemplate);
                                $.layer({
                                    title: "面料核价结果",
                                    type: 1,   //0-4的选择,
                                    btns: 1,
                                    btn: [ '关闭'],
                                    shadeClose: false,
                                    fix: false,
                                    shift: 'top',
                                    area: ['680px', 'auto'],
                                    page: {
                                        dom: '#popupResult'
                                    }
                                });
                                $(".fabric_step_2 tbody tr").hover(function () {
                                    $(this).addClass("hover");
                                }, function () {
                                    $(this).removeClass("hover");
                                }); 
                            }, { Message: "正在加载,请稍后...", LoadingType: 2 });
                            break;
                    }

                });

                //$("#payment-tbinfo tr").click(function () {
                //    $(this).addClass(_this.selectCss);
                //    $(this).siblings().removeClass(_this.selectCss);  
                //});
                autoMenuHeight();
            }
        };
    $(function () {
        eshList.init();
        pager.initClick();
        var isCheck = $('#ischeck').val();
        $('.tabs li:eq(' + isCheck + ') a').addClass('current');
    });

});




