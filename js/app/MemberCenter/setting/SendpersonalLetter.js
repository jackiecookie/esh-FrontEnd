define(['js/common/Eshwindow/eshwindow', 'headJs', 'js/common/Tip/Tip'], function (require, exports, module) {
    var eshwindow = require('js/common/Eshwindow/eshwindow'), verify, tips;
    require.async(['js/common/verify/verify', 'js/common/Tip/Tip'], function (obj, tipsobj) {
        verify = obj;
        tips = tipsobj;
    });
    var headjs = require('headJs');
    $('.J-sendMsg').click(function () {
        if (headjs.loginInfo.isLogin) {
            var thml = '<style>.tit{font-size:14px; font-family:"微软雅黑"}.max-input input{font-weight:bold; font-size:14px}</style><textarea class="J-userArea area" id="msgarea" placeholder="输入您要对TA说的话"></textarea>';
            var title = "发送私信给:" + $('#nickNameh3').text();
            var sendMsg = eshwindow({
                title: title,
                content: thml,
                width: 538,
                mask: true,
                cache: false,
                ok: "确认"
            });
            sendMsg.on('onok', function (val) {
                var msgObj = $('#msgarea');
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
                    $.getJSON('/MemberCenter/Setting/ashx/SendPersonaLletter.ashx?d='+new Date(), { msg: msg, receiverMember: $('#mid').val() }, function (data) {
                        if (data.Success) {
                            tips('发送成功', 3000);
                        } else {
                            tips('发送失败', 3000, "warning");
                        }
                        sendMsg.Close.click();
                    });
                    return false;
                }
            });
        } else {
            location.href = '/login/Login';
            return;
        }
    });

});