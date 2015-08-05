define(['jquery', 'js/common/verify/verify'], function (require, exports, module) {
    var verify = require('js/common/verify/verify');
   
    var trLength = 0;
    var _para = {}, sid;
    var regBtn = function (sendRequest) {
        var verifyInput = function (txtinput, para) {
            for (var i = 0, len = txtinput.length; i < len; i++) {
                var obj = $(txtinput[i]);
                sid = obj.parents('tr').attr('sid');
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
                if (para) {
                    if (!para[sid]) {
                        _para = {};
                        para[sid] = _para;
                    }
                    _para[_for] = $.trim(obj.val());
                }
            }
            return true;
        }
        var btnClick = function (ajaxCallBack) {
            var self = $(this);
            top.window.useReload = true;
            var cssFlag = 'rss_select', ptr, sysids = [], len, j, sysid;
            ptr = self.parents('tr');
            if (ptr.length === 0) {
                ptr = $('#tb').find('tr');
            }
            trLength = len = ptr.length;
            for (var i = 0; i < len; i++) {
                sysids.push($(ptr[i]).attr('sid'));
            }
            len = sysids.length;
            j = 0;
            if (!self.hasClass(cssFlag)) {
                var para = {};
                //验证
                var txtinput = ptr.find('input');
                var isok = verifyInput(txtinput, para);
                if (!isok) return false;
                //新增
                self.addClass(cssFlag);
                self.html('<i></i>取消');
                for (; j < len; j++) {
                    sysid = sysids[j];
                    sendRequest('add', sysid, para[sysid], ajaxCallBack);
                }
            } else {
                self.removeClass(cssFlag);
                self.html('<i></i>选择');
                for (; j < len; j++) {
                    sysid = sysids[j];
                    sendRequest('removeBymember', sysid);
                }

            }
        };
        $('#tb').delegate('.rss', 'click', btnClick);
        var flag = 0;
        $('#addYarnDyed').click(function () {
            btnClick(function () {
                if (trLength == ++flag)
                    top.window.colselayer && top.window.colselayer();
            });
        });
    }

    
    exports.init = function (sendRequest) {
        regBtn(sendRequest);
      
    }
});