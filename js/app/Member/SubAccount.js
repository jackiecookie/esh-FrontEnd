define(['js/common/procopy/procopy', 'js/common/Eshwindow/eshwindow'], function (require, exports, module) {
    var ZDK = require('js/common/procopy/procopy');
    ZDK.window = require('js/common/Eshwindow/eshwindow');
    var alertify;
    var actionUrl = '/Member/ashx/ProSubAccount.ashx';
    require.async(['js/common/btnLoading/btnLoading', 'js/common/verify/verify', 'alertify'], function (btnloading, verify, aler) {
        ZDK.verify = verify;
        ZDK.btnloading = btnloading;
        alertify = aler;
    });
    $('.menu-box .menu-options:eq(5) .menu-options-title').addClass('current');
    var subtr = $('#subAccount-tbinfo tr');
    if (subtr.length === 0) {
        $('#subAccount-tbinfo').html('<tr class="row"> 						<td class="tacenter" colspan="8" style="padding:20px;">				' +
            '			<span class="ico ico-warning">您还没有添加子账号</span>						</td> 					</tr>');
    }
    var startSubmit = function (btn) {
        this.submiting = 1;
        ZDK.btnloading({
            obj: btn,
            addClass: "disabled"
        });
    };

    var endSubmit = function (btn) {
        this.submiting = 0;
        btn.removeClass('disabled');
        ZDK.btnloading.reset(btn);
    };
    $('#buy_submit').click(function () {
        var subAccountMoney = $('#subAccountMoney').val();
        var thml = '<style>.tit{font-size:14px; font-family:"微软雅黑"}.max-input input{font-weight:bold; font-size:14px}</style><form><p class="tit mt15">' +
            '每个子账号的售价为' + subAccountMoney + '易币.我要购买</p><div class="input-append max-input clearfix ml20 mt10">' +
            '<input type="text" style="width:83px" id="count" name="day"><span class="add-on">个</span> </div></form>';
        var buyAccount = ZDK.window({
            title: "购买子账号",
            content: thml,
            width: 400,
            mask: true,
            cache: false,
            ok: "确认购买"
        });

        buyAccount.on('onok', function (a, b) {
            var countEml = $('#count');
            if (!ZDK.verify.type.int(countEml.val())) {
                ZDK.verify.fn.errortips(
                   countEml,
                   countEml.parent(),
                   '请输入整数',
                   'count'
               );
                return false;
            }
            startSubmit(buyAccount.Ok);
            $.getJSON(actionUrl, { action: 'buy', count: countEml.val() }, function (data) {
                endSubmit(buyAccount.Ok);
                if (data.Message == "1") {
                    alertify.confirm('购买成功', function () {
                        buyAccount.hide();
                        location.reload();
                    });
                } else if (data.Message == "-1") {
                    alertify.rechang();
                } else {
                    msg.error('购买失败请重试');
                }

            });
            return false;
        });
    });
    var getMemberCk = function () {
        var checkedElm = $('#subAccount-tbinfo input:checked');
        return checkedElm;
    };
    $('#editPwd').click(function () {
        var checkedElm = getMemberCk();
        if (checkedElm.length != 1) {
            msg.alert('请选中一个子账号进行修改');
            return false;
        }
        location.href = "/Member/SubAccountEditPwd?uid=" + $(checkedElm[0]).val();
    });

    $('#jy').click(function () {
        editValid(0);
    });
    $('#qy').click(function() {
        editValid(1);
    });
    var editValid = function (valid) {
        var ids = new Array();
        var checkedElm = getMemberCk();
        for (var i = 0, len = checkedElm.length; i < len; i++) {
            ids.push($(checkedElm[i]).val());
        }
        $.getJSON(actionUrl, { action: 'editValid', ids: ids.join(','), Valid: valid }, function (data) {
            if (data.Success) {
                alertify.confirm('您选中的帐号都已经被' + (valid=="0"?"禁用":"启用"), function () {
                    location.reload();
                });
            } else {
                msg.error('修改失败请重试');
            }
        });
    };  
})