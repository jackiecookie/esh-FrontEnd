define(['jQueryAjax', 'pager', 'js/common/cssSelect/cssSelect', 'headJs'], function (require, exports, module) {
    var jQueryAjax = require('jQueryAjax');
    require('js/common/cssSelect/cssSelect');
    var pager = require('pager'),
        autoMenuHeight = require('headJs').autoMenuHeight,
        createParam = jQueryAjax.createParam,
    eshList = {
        url: "/Member/ashx/MemberDesign/GetMemberFlowerHandler.ashx",
        PAGE_SIZE: 15,
        init: function () {
            var _this = eshList;
            $("#srcTypeDiv").MultiCssSelect({
                url: '/Member/ashx/MemberDesign/GetFlowerTypeHandler.ashx',
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
                type: encodeURIComponent($(".selectLt").text() == "全部" ? "" : $(".selectLt").text()),
                //KeyWord: $("#keyWordId").val(),
               Name: encodeURIComponent($("#Name").val()),
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
						<td class='tacenter' colspan='8' style='padding:20px;'>\
							<span class='ico ico-warning'>没有找到相关数据!</span>\
						</td> \
					</tr>";
            } else {
                jQuery.each(data, function (index, entityList) {
                    var entity = entityList;
                    var col1Value = entity.FLOWERTYPE_FNUMBER,
                    col2Value = entity.FLOWERTYPE_NAME,
                    col3Value = entity.FNUMBER,
                    col5Value = entity.GGXH,
                    col6Value = entity.DESCRIBE == null ? "" : entity.DESCRIBE,
                    fid = entity.SYSNUMBER;
                    info += "<tr class='row' id='" + fid + "'>\
<td class='taleft'><input type='checkbox'  value='" + fid + "'/></td>\
									<td class='tacenter'>" + col1Value + "</td>\
									<td class='tacenter'>" + col2Value + "</td>\
									<td class='tacenter'>" + col3Value + "</td>\
									<td class='tacenter'>" + col5Value + "</td>\
									<td class='tacenter'>" + col6Value + "</td>\
								</tr>";
                });
            }
            $("#payment-tbinfo").empty();
            $("#payment-tbinfo").html(info);
            autoMenuHeight();
        },

        btnHandel: {
            del: function () {
                var ckeckedbox = $(':checked');
                if (ckeckedbox.val()) {
                    if (confirm('确认要执行删除操作吗？')) {
                        var o;
                        var count = 0;
                        ckeckedbox.each(function (i, n) {
                            var a = $(n).val();
                            if (o)
                                o = o + a + "_";
                            else
                                o = a + "_";
                            count++;
                        });
                        var para = createParam('delete', o, 'form1');
                        $.post('/Member/ashx/MemberDesign/GetMemberFlowerHandler.ashx', para, function (data) {
                            if (data == 'ok') {
                                ckeckedbox.each(function (i, n) {
                                    var a = $(n).val();
                                    $('#' + a).remove();
                                    var dataTr = $('#tbody tr');
                                    if (dataTr.length == 0) {
                                        eshList.initList();
                                    }
                                });
                                msg.ok('成功删除【' + count + '】条花型信息');
                            }
                        });
                    }
                }
                else {
                    alert('请至少选中一个花型进行删除');
                }
            },
            edit: function () {
                var ckeckedbox = $(' :checked');
                if (ckeckedbox.length == 1) {
                    location.href = "/MemberDesign/MemberFlowerInfo/" + ckeckedbox.val();
                } else {
                    alert('选中一个花型进行修改');
                }
            },
            cpprosses:function() {
                var ckeckedbox = $(':checked');
                var self = $(this);
                var _msg = self.attr('id') == 'cpxj' ? '下架' : '上架';
                if (ckeckedbox.val()) {
                    var msg = '你确定要将这些花型{0}么'.replace('{0}', _msg);
                    if (confirm(msg)) {
                        var o, count = 0;;
                        ckeckedbox.each(function(i, n) {
                            var a = $(n).val();
                            if (o)
                                o = o + a + "_";
                            else
                                o = a + "_";
                            count++;
                        });
                        var para = createParam(_msg, o);
                        $.post('/Member/ashx/MemberDesign/GetMemberFlowerHandler.ashx', para, function(data) {
                            if (data == 'ok') {
                                ckeckedbox.each(function(i, n) {
                                    var a = $(n).val();
                                    $('#' + a).remove();
                                    var dataTr = $('#tbody tr');
                                    if (dataTr.length == 0) {
                                        eshList.initList();
                                    }
                                });
                                //      msg.ok('成功' + _msg + '【' + count + '】条花型信息');
                            }
                        });
                    }
                } else {
                    alert('至少选中一个花型进行' + _msg);
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





