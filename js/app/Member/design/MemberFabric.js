define(['jQueryAjax', 'pager', 'js/common/cssSelect/cssSelect', 'headJs'], function (require, exports, module) {
    var jQueryAjax = require('jQueryAjax');
    require('js/common/cssSelect/cssSelect');
    var pager = require('pager'),
        autoMenuHeight = require('headJs').autoMenuHeight,
        createParam = jQueryAjax.createParam,
        eshList = {
            url: "/Member/ashx/MemberDesign/MemberFabric.ashx",
            PAGE_SIZE: 15,
            //selectCss: 'bggary',
            init: function () {
                var _this = eshList;
                //获取面料分类信息
                $("#srcType").MultiCssSelect({
                    url: '/Member/ashx/MemberDesign/GetFabricType.ashx',
                    DivElment: $('#srcTypeDiv')
                });
                $("#search-btn").click(_this.initList);
                $("#edit-btn").click(_this.btnHandel.edit);
                $("#delete-btn").click(_this.btnHandel.del);
                $('#cpxj,#cpsj').click(_this.btnHandel.cpprosses);
                eshList.initList();
            },
            initList: function () {
                var _this = eshList;
                pager.init(8, _this.url, _this.createParams, _this.renderTBodyForPayment);
            },
            createParams: function (pageIndex) {
                var _this = eshList;
                var params = {
                    MLtype: encodeURIComponent($(".selectLt").text() == "全部" ? "" : $(".selectLt").text()),
                    MLName: encodeURIComponent($("#MLName").val()),
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
                        //  var mlName = entity.NAME,
                        var faName = entity.FA_NAME,
                    flName = entity.FL_NAME,
                    dyName = entity.FNUMBER,
                    priceA = entity.PRICE_A == null ? 0 : entity.PRICE_A,
                    priceB = entity.PRICE_B == null ? 0 : entity.PRICE_B,
                    mlgz = entity.MLGZ,
                    fid = entity.SYSNUMBER;
                        info += "<tr class='row' id='" + fid + "' >\
<td class='taleft'><input type='checkbox'  value='" + fid + "' hasshaxian='" + entity.ISCONTAINSX + "' /></td>\
									<td class='tacenter'>" + faName + "</td>\
									<td class='tacenter'>" + flName + "</td>\
									<td class='tacenter'>" + dyName + "</td>\
									<td class='tacenter'>" + priceA + "</td>\
									<td class='tacenter'>" + priceB + "</td>\
										<td class='tacenter'>" + mlgz + "</td>\
								</tr>";
                    });
                }
                $("#payment-tbinfo").empty();
                $("#payment-tbinfo").html(info);
                //$("#payment-tbinfo tr").click(function () {
                //    $(this).addClass(_this.selectCss);
                //    $(this).siblings().removeClass(_this.selectCss);
                //});
                autoMenuHeight();
            },
            btnHandel: {
                del: function () {
                    var ckeckedbox = $(':checked');
                    if (ckeckedbox.val()) {
                        if (confirm('确认要执行删除操作吗？')) {
                            var o;
                            ckeckedbox.each(function (i, n) {
                                var a = $(n).val();
                                if (o)
                                    o = o + a + "_";
                                else
                                    o = a + "_";
                            });
                            var para = createParam('del', o, 'form1');
                            $.post("/Member/ashx/MemberDesign/MemberFabric.ashx", para, function (data) {
                                if (data == 'ok') {
                                    ckeckedbox.each(function (i, n) {
                                        var a = $(n).val();
                                        $('#' + a).remove();
                                        var dataTr = $('#tbody tr');
                                        if (dataTr.length == 0) {
                                            eshList.initList();
                                        }
                                    });
                                }
                            });
                        }
                    }
                    else {
                        alert('请至少选中一个面料进行删除');
                    }
                },
                edit: function () {
                    var ckeckedbox = $(' :checked');
                    if (ckeckedbox.length == 1) {
                        var hasshaxian = ckeckedbox.attr('hasshaxian');
                        if (hasshaxian == '1') {
                            location.href = "/UIDesign/MemberFabricInfo?sysnumber=" + ckeckedbox.val();
                        } else {
                            location.href = "/UIDesign/MemberFabricInfo?sysnumber=" + ckeckedbox.val();
                        }
                    } else {
                        alert('选中一个面料进行修改');
                    }
                },
                cpprosses: function () {
                    var ckeckedbox = $(':checked');
                    var self = $(this);
                    var _msg = self.attr('id') == 'cpxj' ? '下架' : '上架';
                    if (ckeckedbox.val()) {
                        var msg = '你确定要将这些面料{0}么'.replace('{0}', _msg);
                        if (confirm(msg)) {
                            var o, count = 0; ;
                            ckeckedbox.each(function (i, n) {
                                var a = $(n).val();
                                if (o)
                                    o = o + a + "_";
                                else
                                    o = a + "_";
                                count++;
                            });
                            var para = createParam(_msg, o);
                            $.post('/Member/ashx/MemberDesign/MemberFabric.ashx', para, function (data) {
                                if (data == 'ok') {
                                    ckeckedbox.each(function (i, n) {
                                        var a = $(n).val();
                                        $('#' + a).remove();
                                        var dataTr = $('#tbody tr');
                                        if (dataTr.length == 0) {
                                            eshList.initList();
                                        }
                                    });
                                    //      msg.ok('成功' + _msg + '【' + count + '】条面料信息');
                                }
                            });
                        }
                    } else {
                        alert('至少选中一个面料进行' + _msg);
                    }
                }
            }
        };
    $(function () {
        eshList.init();
        pager.initClick();
        var isCheck = $('#ischeck').val();
        $('.tabs li:eq(' + isCheck + ') a').addClass('current');
    });

});




