define(function (require, exports, module) {
    var pwdCommon = require('js/app/Member/PassWordCommon');
    var Fv = require('js/common/Esh_validator/Esh_validator');
    //account.identify = new Object();
    $(function () {
        var btn_submit = $('#btn_submit');

       
        var FvPara = pwdCommon.FvPara;
        FvPara.items.push({
            item: '#oldPassword',
            rule: [/^.{1,}$/],
            tipcls: { right: 'tip-right-none' }, // 去勾
            msg: {
                normal: '',
                empty: '请输入当前密码',
                error: '密码输入有误'
            }
        });
        var fv = new Fv(FvPara);
        $('#form').bind('submit', function (e) {
           var action= $(this).attr('action');
            e.preventDefault();

            fv.v2c(function (success) {
                if (success) {
                    if (btn_submit.hasClass('btn-fmsubmit-disabled')) {
                        return false;
                    }
                    btn_submit.addClass('btn-fmsubmit-disabled').text('提交中...');
                   var editId= $('#editId').val();
                   $.getJSON(action + "?action=changpwd&p=" + $("#password").val() + "&o=" + $("#oldPassword").val(), editId ? { editId: editId} : null, function (d) {
                        if (d.Success) {
                            btn_submit.removeClass('btn-fmsubmit-disabled').text('提交');
                            $('.fm-text').val('');
                            $('.fm-text').css('fm-text');
                            $('.tip-empty').remove();
                            msg.alertFn("修改成功", function () {
                                location.reload();
                            });
                        } else {
                            msg.error(d.Message);
                            btn_submit.removeClass('btn-fmsubmit-disabled').text('提交');
                        }
                    });
                    return false;
                }
            }, true);
        });
    });





});

