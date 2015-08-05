define([], function (require, exports, module) {
    $('#WorkersPay').addClass('cur');
    var verify, btnLoading;
    require.async(['js/common/verify/verify', 'btnLoading'], function (v, b) {
        verify = v;
        btnLoading = b;
    });
    require.async(['layerExt']);
    var regBtn = function (sendRequest) {
        $('.bd .edit').live('click', function () {
            var self = $(this);
            var labels = self.prevAll('label');
            var inputP = self.parent().next().removeClass('hidden');
            for (var i = 0, len = labels.length; i < len; i++) {
                var $label = $(labels[i]);
                inputP.find('[for="' + $label.attr('for') + '"]').val($.trim($label.text()));
            }
            self.parent().addClass('hidden');
        });
        //保存名称
        $('.bd .btn-edit').live('click', function () {
            var self = $(this);
            var txtinput = self.prevAll('.txt');
            var para = {};
            for (var i = 0, len = txtinput.length; i < len; i++) {
                var obj = $(txtinput[i]);
                var _for = obj.attr('for');
                if (_for == 'time') {
                    if (!verify.type.date($.trim(obj.val()))) {
                        verify.showErroTip(obj, '请输入正确的日期！');
                        obj.focus();
                        return false;
                    }
                } else {
                    if (!verify.type.double($.trim(obj.val()))) {
                        verify.showErroTip(obj, '请输入正确的数字！');
                        obj.focus();
                        return false;
                    }
                }
            }
            var labelP = self.parent().prev().removeClass('hidden');
            for (i = 0; i < len; i++) {
                obj = $(txtinput[i]);
                _for = obj.attr('for');
                para[_for] = $.trim(obj.val());
                labelP.find('[for="' + _for + '"]').text($.trim(obj.val()));
            }
            txtinput.parent().addClass('hidden');
            var sysId = self.parents('.info').attr('attr-id');
            sendRequest('update', sysId, null, para);
        });
        //删除
        $('.bd .j-plan-del').live('click', function () {
            var self = $(this);
            var sysId = self.parents('.info').attr('attr-id');
            var index = layer.confirm('确定删除么', function () {
                layer.close(index);
                var isloading = btnLoading({
                    obj: self,
                    addClass: "disabled"
                });
                if (isloading) {
                    sendRequest('remove', sysId, function (d) {
                        if (d.Success)
                            location.reload();
                        //  self.parents('.item').remove();
                        else {
                            btnLoading.reset(self);
                        }
                    });
                }
            });

        });
    }
    module.exports = regBtn;

});