define(function (require, exports, module) {
            $('#password').bind('keyup', function (e) {
                var $el = $(e.currentTarget);
                var level = PwdLevelGetter.getLevel($el.val());
                $el.removeClass('input-pwd-low');
                $el.removeClass('input-pwd-normal');
                $el.removeClass('input-pwd-good');
                $el.removeClass('input-pwd-high');
                if ($el.val() != '') {
                    if (level == 0) {
                        $el.addClass('input-pwd-low');
                    } else if (level == 1) {
                        $el.addClass('input-pwd-normal');
                    } else if (level == 2) {
                        $el.addClass('input-pwd-good');
                    } else if (level == 3) {
                        $el.addClass('input-pwd-high');
                    }
                }
            });

    exports.FvPara = {
        items: [
            {
                item: '#password',
                rule: [
                    /^.{6,16}$/, function(value) {
                        if (value == $('#oldPassword').val()) {
                            return false;
                        }

                        if (value.match(/[^a-zA-Z0-9]+/) && value.match(/[a-zA-Z]+/)) {
                            return true;
                        }

                        if (value.match(/\d+/) && value.match(/[a-zA-Z]+/)) {
                            return true;
                        }

                        if (value.match(/[^a-zA-Z0-9]+/) && value.match(/\d+/)) {
                            return true;
                        }

                        return false;
                    }
                ],
                msg: {
                    normal: '',
                    empty: '请输入新密码',
                    error: '密码不符合要求'
                }
            }, {
                item: '#password2',
                rule: [
                    function(v) {
                        return v == $('#password').val();
                    }
                ],
                msg: {
                    normal: '',
                    empty: '请确认密码',
                    error: '两次输入的密码不一致'
                }
            }
        ],
        rules: {}
    };
    //获得密码强度
    var PwdLevelGetter=exports. PwdLevelGetter = {
        getLevel: function (value) {
            if (value.match(/^\d{1,7}$/)) {
                return 0;
            } else if (value.match(/^[a-zA-Z]{1,7}$/)) {
                return 0;
            } else if (value.match(/^[^a-zA-Z0-9]{1,7}$/)) {
                return 0;
            } else if (value.match(/^\d{8,}$/)) {
                return 1;
            } else if (value.match(/^[a-zA-Z]{8,}$/)) {
                return 1;
            } else if (value.match(/^[^a-zA-Z0-9]{8,}$/)) {
                return 1;
                //字母和数字组合2-7位
            } else if (value.match(/^[a-zA-Z0-9]{2,7}$/) && value.match(/[a-zA-Z]+/) && value.match(/\d+/)) {
                return 1;
                //符号和数字组合2-7位
            } else if (value.match(/^[^a-zA-Z]{2,7}$/) && value.match(/[^a-zA-Z0-9]+/) && value.match(/\d+/)) {
                return 1;
                //符号和字母合2-7位
            } else if (value.match(/^[^\d]{2,7}$/) && value.match(/[^a-zA-Z0-9]+/) && value.match(/[a-zA-Z]+/)) {
                return 1;
                //字母和数字组合8-16位
            } else if (value.match(/^[a-zA-Z0-9]{8,}$/) && value.match(/[a-zA-Z]+/) && value.match(/\d+/)) {
                return 2;
                //符号和数字组合8-16位
            } else if (value.match(/^[^a-zA-Z]{8,}$/) && value.match(/[^a-zA-Z0-9]+/) && value.match(/\d+/)) {
                return 2;
                //符号和字幕合8-16位
            } else if (value.match(/^[^\d]{8,}$/) && value.match(/[^a-zA-Z0-9]+/) && value.match(/[a-zA-Z]+/)) {
                return 2;
                //符号、数字和字母合3-7位
            } else if (value.match(/^.{3,7}$/) && value.match(/\d+/) && value.match(/[a-zA-Z]+/) && value.match(/[^a-zA-Z0-9]+/)) {
                return 2;
                //符号、数字和字母合8-16位
            } else if (value.match(/^.{8,}$/) && value.match(/\d+/) && value.match(/[a-zA-Z]+/) && value.match(/[^a-zA-Z0-9]+/)) {
                return 3;
            }

            return 0;
        }
    };
});