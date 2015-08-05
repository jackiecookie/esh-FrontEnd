define(function (require, exports, module) {
    var Alipw = require('js/common/AliControls/control');
    Alipw.importClass('Alipw.Window');
    $('.menu-box .menu-options:eq(3) .menu-options-title').addClass('current');
    $("#messages").find(".i-del-btn").click(function (event) {
        var self = this;
        event.stopPropagation();
        var delPop = new Alipw.Window({
            width: 430,
            height: 180,
            title: '删除消息',
            html: '<span style="padding:20px 0;display:block;">您确认删除吗</span>',
            buttons: [{
                label: '确定',
                handler: function () {

                    $.ajax({
                        type: "POST",
                        url: "/Member/ashx/MemberMsgPro.ashx",
                        data: {
                            "msg_id": $(self).parent().parent().attr('data'),
                            "action": "del",
                            'dataSoure': $(self).parent().parent().data('soure')
                        },
                        dataType: 'json',
                        success: function (data) {
                            delPop.close();
                            if (data.Success) {
                                //if (parseInt($('.pm_new_total').text()) <= 1)
                                location.reload();
                            } else {
                                alert('删除失败');
                            }
                        }
                    });

                }
            }, {
                label: '取消',
                handler: function () {
                    delPop.close();
                }
            }]
        });
    });
    $(function () {


        $(".message-item:odd").addClass('alt');

        $(".message-title").click(function () {

            var $messageItem = $(this).parents(".message-item");

            $messageItem.toggleClass('message-open');

            if (!$messageItem.hasClass('message-readed')) {
                $messageItem.addClass('message-readed');

                $('.pm_new_total').each(function () {
                    var number = $(this).text() - 1;
                    $(this).text(number);
                    $('.lnk-message').text(number);
                });

                $.ajax({
                    type: "POST",
                    url: "/Member/ashx/MemberMsgPro.ashx",
                    data: {
                        "msg_id": $(this).attr('data'),
                        "action": "readed",
                        'dataSoure': $(this).data('soure')
                    },
                    dataType: 'json',
                    success: function (data) {
                        //  if (data.status != 200) {
                        //alert( data.msg );
                        //  }
                    }
                });
            }

            if (window != top) {
                window.setParentIframeHeight();
            }

            return false;
        });
        $("#messages").find(".message-item").mouseover(function () {
            $(this).find(".i-del-btn").css("visibility", "visible");
        }).mouseout(function () {
            $(this).find(".i-del-btn").css("visibility", "hidden");
        })
    });
});
