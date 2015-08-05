define(['js/common/handlebars/handlebars', 'js/lib/jquery.handlebars/jquery.handlebars.js'], function (require, exports, module) {
    require('js/lib/jquery.handlebars/jquery.handlebars.js');
    var handlebars = require('js/common/handlebars/handlebars'), verify, tips, btnLoading,
    proashx = '/MemberCenter/Setting/ashx/PersonalLetter.ashx',
    memberid = $('#mcid').val();
    require.async(['js/common/verify/verify', 'js/common/Tip/Tip', 'js/common/btnLoading/btnLoading'], function (obj, tipsobj, btnLoadingObj) {
        verify = obj;
        tips = tipsobj;
        btnLoading = btnLoadingObj;
    });
    //#region 替换换行
    handlebars.registerHelper("breaklines", function (a) {
        return a = a.replace(/(\r\n|\n|\r)/gm, "<br>"), new handlebars.SafeString(a);
    });
    //#endregion
    var pageSize = 8;
    var $dia = $(".dia");
    //#region 获得消息明细
    var getData = function (link) {
        var b = $(link),
            f = b.closest(".dia").find(".message"),
            moreBtn = f.find(".action"),
            tid = b.data('diaid'),
            i = f.find(".msgs"),
            thisindex = b.data("index") || 1,
            msgpreview = b.parents('.msg-preview'),
              jCount = msgpreview.find('.J_cont'),
             type = b.data('type');
        $.getJSON('/MemberCenter/Setting/ashx/GetPersonalLetter.ashx?d=' + new Date(), { tid: tid, pageSize: pageSize, pageIndex: thisindex, type: type }, function (data) {
            var firstMsg = '',firstSendMember;
            for (var j = 0, len = data.messages.length; j < len; j++) {
                data.messages[j].obsUserId = memberid;
                if (thisindex == 1 && j == 0) {
                    firstMsg = data.messages[j].MESSAGEBODY;
                    firstSendMember = data.messages[j].SENDERMEMBER;
                }
            }
            if (thisindex == 1) {
                jCount.removeClass('bold');
                i.handlebars($("#msg-tmpl"), data.messages);
                if (firstSendMember != memberid&&firstMsg != $.trim(jCount.text())) {
                    jCount.text(firstMsg);
                    msgpreview.prev().find('.time').text(data.messages[0].formatCreated);
                }
            } else {
                var html = handlebars.compile($("#msg-tmpl").html());
                i.append(html(data.messages));
            }
            f.show();
            b.hide();
            b.next().show();
            b.data("index", ++thisindex);
            if (data.count < thisindex) {
                moreBtn.hide();
            }
            b.data('totlecount', data.totleCount);

        });
    };
    //#endregion
    //#region 发送消息
    $dia.on("click", ".numbox .J_view", function () {
        getData(this);
    }).find('.J-okmsg').live('click', function () {
        var self = $(this);
        var msgObj = self.prev('.J-msgarea');
        var msg = msgObj.val();
        if (msg == '') {
            verify.fn.errortips(
                        msgObj,
                        null,
                        '请输入你要对他说的话',
                        'context'
                    );
            return false;
        } else {
            btnLoading({
                obj: self,
                addClass: "disabled"
            });
            var receiverMember = self.data('othermcid');
            var msgsobj = self.parents('.newmsg');
            var imgsrc = msgsobj.find('.avatar img').attr('src');

            $.getJSON('/MemberCenter/Setting/ashx/SendPersonaLletter.ashx', { msg: msg, receiverMember: receiverMember }, function (data) {
                btnLoading.reset(self);
                if (data.Success) {
                    tips('发送成功', 3000);
                    msgObj.val('');
                    var html = handlebars.compile($("#msg-tmpl").html());
                    var jView = self.parents('.dia').find('.J_view');
                    var totleCount = jView.data('totlecount');
                    jView.data('totlecount', ++totleCount);
                    var msgData = [];
                    msgData.push({
                        MESSAGEBODY: msg,
                        formatCreated: '刚刚',
                        senderAvatar: imgsrc,
                        ID: data.Data,
                        obsUserId: memberid,
                        SENDERMEMBER: memberid
                    });
                    msgsobj.next(".msgs").prepend(html(msgData));
                    msgsobj.parents('.message').prev().find('.J_cont').html('<em class="isay">我对TA说:</em>' + msg);
                } else {
                    tips('发送失败', 3000, "warning");
                }
            });
            return false;
        }
    })

    //#endregion
    //#region 删除消息按钮事件
    $dia.find('.msg-cont').live('mouseenter', function () {
        $(this).find(".delete").show();
    }).live('mouseleave', function () {
        $(this).find(".delete").hide();
    }).find('.delete').live('click', function () {
        var self = $(this);
        var id = self.data('id');
        var jView = self.parents('.dia').find('.numbox .J_view');
        var threadId = jView.data('diaid');
        var type = jView.data('type');
        $.getJSON(proashx, { action: 'del', threadId: threadId, msgid: id, type: type }, function (data) {
            var totleCount = jView.data('totlecount');
            totleCount = --totleCount;
            if (totleCount > 0) {
                jView.data('totlecount', totleCount);
                var msgs = self.parents('.J-msgs').find('.msg');
                if (msgs.length <= 1) {
                    var pageIndex = jView.data("index");
                    jView.data("index", --pageIndex);
                }
            } else {
                self.parents('.dia').remove();
            }
            self.parents('.msg').remove();
        });
    });
    //#endregion
    //#region 更多消息按钮
    $dia.find('.action').live('click', function () {
        $(this).parents('.dia').find('.numbox .J_view').click();
    });
    //#endregion
    //#region 点击消息主体事件
    $dia.find('.msg-txt').click(function () {
        $(this).next().find(':visible').click();
    });
    //#endregion
    //#region 收起按钮
    $dia.on('click', '.J_fold', function () {
        var self = $(this);
        var prev = self.prev();
        self.hide();
        prev.show();
        updateLink(prev);
        prev.data("index", 1);
        var message = prev.closest(".dia").find(".message").hide();
        message.find('.action').show();
    });
    //#endregion
    //#region 更新消息数量
    function updateLink(link) {
        var count = link.data('totlecount');
        link.text(link.text().replace(/\d+/, count));
    }
    //#endregion
    //#region 全部已读
    $('.mark').click(function () {
        $.getJSON(proashx, { action: 'allunread' }, function (data) {
            if (data.Success) {
                location.reload();
            }
        });
    });
    //#endregion
    $('.menu-box .menu-options:eq(4) .menu-options-title').addClass('current');
});