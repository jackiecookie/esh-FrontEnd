define(['jQueryAjax', 'pager', 'js/common/cssSelect/cssSelect', 'headJs', 'js/common/jqueryDate/jqueryDate', 'tools', 'js/app/Design/RenderTypeConver'], function (require, exports, module) {
    require('tools');
    require('js/common/cssSelect/cssSelect');
    var createParam = require('jQueryAjax').createParam,
     pager = require('pager'),
        autoMenuHeight = require('headJs').autoMenuHeight,
          datepicker = require('js/common/jqueryDate/jqueryDate'),
       renderTypeConver = require('js/app/Design/RenderTypeConver').renderTypeConver,
    eshList = {
        url: "/Member/ashx/MemberDesign/MemberSw.ashx",
        PAGE_SIZE: 15,
        init: function () {
            var _this = eshList;
            $("#srcType").cssSelect();
            $("#search-btn").click(_this.initList);
            $("#edit-btn").click(_this.btnHandel.edit);
            $('#cpxj,#cpsj').click(_this.btnHandel.cpprosses);
            //  $("#delete-btn").click(_this.btnHandel.del);
            eshList.initList();
        },
        initList: function () {
            var _this = eshList;
            pager.init(8, _this.url, _this.createParams, _this.renderTBodyForPayment);
        },
        createParams: function (pageIndex) {
            var _this = eshList;
            var params = {
                RENDER_TYPE: encodeURIComponent($("#srcType").val()),
                beginDate: $("#start_time").val(),
                endDate: $("#end_time").val(),
                SwName: encodeURIComponent($("#Name").val()),
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
            //$("#payment-tbinfo tr").click(function () {
            //    $(this).addClass(_this.selectCss);
            //    $(this).siblings().removeClass(_this.selectCss);
            //});
            autoMenuHeight();
        },
        btnHandel: {
            edit: function () {
                var ckeckedbox = $('.tabledv :checked');
                if (ckeckedbox.length == 1) {
                    location.href = "/UIDesign/MemberSwInfo/" + ckeckedbox.val();

                } else {
                    alert('选中一个三维进行修改');
                }
            },
            cpprosses: function () {
                var ckeckedbox = $('#payment-tbinfo :checked');
                var self = $(this);
                var _msg = self.attr('id') == 'cpxj' ? '下架' : '上架';
                if (ckeckedbox.val()) {
                    var msg = '你确定要将这些三维{0}么'.replace('{0}', _msg);
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
                        $.post('/Member/ashx/MemberDesign/MemberSw.ashx', para, function (data) {
                            if (data == 'ok') {
                                ckeckedbox.each(function (i, n) {
                                    var a = $(n).val();
                                    $('#' + a).remove();
                                    var dataTr = $('#tbody tr');
                                    if (dataTr.length == 0) {
                                        eshList.initList();
                                    }
                                });
                                //  msg.ok('成功' + _msg + '【' + count + '】条三维信息');
                            }
                        });
                    }
                } else {
                    alert('选中一个三维进行' + _msg);
                }
            }
        }
    };
    $(function () {
        eshList.init();
        pager.initClick();
        var isCheck = $('#ischeck').val();
        $('.tabs li:eq(' + isCheck + ') a').addClass('current');
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





