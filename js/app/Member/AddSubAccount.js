define(function (require, exports, module) {
    var pwdCommon = require('js/app/Member/PassWordCommon');
    var Fv = require('js/common/Esh_validator/Esh_validator');
    var jQueryAjax = require('jQueryAjax');
    var FvPara = pwdCommon.FvPara;
    FvPara.items.push({
        item: '#department',
        msg: {
            normal: '',
            empty: '请输入部门'
        }
    }, {
        item: '#remark',
        msg: {
            normal: '',
            empty: '请输入备注'
        }
    }, {
        item: '#logName',
        msg: {
            normal: '只能由中英文,数字及 _和-组成,长度在6-16位之间',
            empty: '请输入用户名',
            ajaxError: '该用户名已经存在',
            error: '用户名不符合要求'

        },
        rule: [/^.{6,16}$|[\u4e00-\u9fa5]+/, function (value) {
            if (/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)) return false;
            if (/^[0-9]+$/.test(value)) return false;
            if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(value)) return false;
            return true;
        } ],
        ajax: function (v, callback) {
            $.getJSON("/Member/ashx/Register/checkUnique.ashx?email=" + escape(v) + "&r=" + Math.random(), function (date) {
                var exist = date.Data == 1;
                callback(!exist);

            });
        }
    });
    var form = $('#form');
    $('#btn_submit').click(function () {
        form.submit();
    });
    var fv = new Fv(FvPara);
    var btn_submit = $('#btn_submit');
    form.bind('submit', function (e) {
        e.preventDefault();
        if (btn_submit.hasClass('btn-fmsubmit-disabled')) {
            return false;
        }
        fv.v2c(function (success) {
            if (success) {
                btn_submit.addClass('btn-fmsubmit-disabled').find('span').text('提交中');
                var para = jQueryAjax.createParam('add', '', 'form');
                $.getJSON("/Member/ashx/AddSubAccount.ashx", para, function (d) {
                    if (d.Success) {
                        btn_submit.removeClass('btn-fmsubmit-disabled').find('span').text('提交');
                        location.href = '/Member/SubAccount';
                    } else {
                        msg.error('添加失败,请重试');
                        btn_submit.removeClass('btn-fmsubmit-disabled').text('提交');
                    }
                });
                return false;
            }
        }, true);
    });
});