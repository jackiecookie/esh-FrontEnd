define(function (require, exports, module) {
    var ZDK = require('js/common/procopy/procopy');
    ZDK.btnLoading = require('btnLoading');
    ZDK.upload = require('js/common/UpLoad/UpLoadJs');
    ZDK.verify = require('js/common/verify/verify');
    /*
    * form
    */
    var my = {};
    my = function (dom, callback, options) {
        var rules = {

    };
    if (callback) this.callback = callback;
    if (options) {
        rules = $.extend(rules, options);
    }
    var inputs = inputs = dom.find(".form-value");
    this.controls = {};
    var controls = this.controls;
    inputs.each(function () {
        var input = $(this);
        var name = input.attr("data-name");
        controls[name] = {};
        var control = controls[name];
        var valid_name = input.attr("data-valid") || name;
        var rule = $.extend({}, rules[valid_name]);
        if (input.attr("data-msg")) rule.msg = input.attr("data-msg");
        control.rule = rule;
        var tip = input.parent().find(".form-tip");
        if (!tip.length) {
            tip = input.parent().parent().next();
        }
        if (!tip.length) tip = input.parent().next();
        control.tip = tip;
        control.input = input;
        control.valid = true;
    });
    inputs.focus(function () {
        focus_in($(this));
    });
    inputs.blur(function () {
        blur_out($(this));
    });
    inputs.keyup(function () {
        keyup_in($(this));
    });
    inputs.each(function () {
        var input = $(this);
        var node_type = input.attr("type");
        if (node_type == "radio" || node_type == "checkbox") {
            input.change(function () {
                var input = $(this);
                blur_out(input);

            });
        }
    });
    //鼠标进来
    function focus_in(input) {
        var node_type = input.attr("type");
        if (node_type == "div") {
            var name = input.attr("data-name");
            var control = controls[name];
            control.input.addClass("valid-input");
            control.tip.removeClass("mtip-error").empty();
            control.valid = true;
            remove_error();
        }
        //                var name = input.attr("data-name");
        //                var value = get_input_value(input);
        //                value = $.trim(value);
        //                var control = controls[name];
        //                //激活样式
        //                input.addClass("active-input");
        //                //input 去除检查正确标记
        //                input.removeClass("valid-input");
        //                control.tip.removeClass("mtip-error");
        //                if (!value || !control.valid) {
        //                    var msg = control.rule.msg;
        //                    control.tip.addClass("help_tip").html(msg);
        //                    control.valid = false;
        //                    return;
        //                }
    }
    function get_input_value(input) {
        var node_type = input.attr("type");
        if (node_type == "radio" || node_type == "checkbox") {
            var checked = input.attr("checked");
            return checked;
        } else if (node_type == "div") {
            return input.next().val();
        }
        else {
            return input.val();
        }
    }
    //鼠标离开
    function blur_out(input) {
        var name = input.attr("data-name");
        var value = get_input_value(input);
        value = $.trim(value);
        var control = controls[name];
        input.removeClass("active-input");
        //检查
        valid_item(value, control, 2);

    }
    //输入后检查
    function keyup_in(input) {
        var name = input.attr("data-name");
        var value = get_input_value(input);
        value = $.trim(value);
        var control = controls[name];
        input.removeClass("active-input");
        remove_error();
        //检查
        valid_item(value, control, 3);

    }
    function show_error(msg, input) {
        var node_type = input.attr("type");
        if (node_type == "div") {
            ZDK.verify.showErroTip(input.prev(), msg);
        }
        else {
            ZDK.verify.showErroTip(input, msg);
        }
    }
    function remove_error() {
        $('.ui-poptip.ui-verify-tips').remove();
    }
    function valid_item(value, control, showErrorType, isSubmit) {
        if ((control.valid && control.value == value) || control.input.hasClass("ishide")) {
            if (!control.input.hasClass("valid-input")) control.input.addClass("valid-input");
            return true;
        }
        if (!showErrorType) {
            showErrorType = 1;
        }
        control.tip.removeClass("help_tip");
        var rule = control.rule;
        var valid = rule.valid;
        if ((!rule.empty || (rule.empty && value != "")) && valid != undefined) {
            for (var i = 0; i < valid.length; i++) {
                var ru = valid[i];
                var type = ru.type;
                //将每个类别写成一个函数 重构 reg to ajax required max min length range function
                if (type == "reg") {
                    if (!(new RegExp(ru.name).test(value))) {
                        control.tip.removeClass("mtip-right");
                        if (showErrorType == 1) {
                            control.tip.addClass("mtip-error").html(ru.msg);
                            show_error(ru.msg, control.input);
                        }
                        else if (showErrorType == 2) {
                            control.tip.addClass("mtip-error").html(ru.msg);
                        }
                        else if (showErrorType == 3) {
                            show_error(ru.msg, control.input);
                        }
                        control.valid = false;
                        return false;
                    }
                }
                else if (type == "to") {
                    var to = controls[ru.name];
                    var to_value = get_input_value(to.input);
                    if (value != to_value) {
                        control.tip.removeClass("mtip-right");
                        if (showErrorType == 1) {
                            control.tip.addClass("mtip-error").html(ru.msg);
                            show_error(ru.msg, control.input);
                        }
                        else if (showErrorType == 2) {
                            control.tip.addClass("mtip-error").html(ru.msg);
                        }
                        else if (showErrorType == 3) {
                            show_error(ru.msg, control.input);
                        }
                        control.valid = false;
                        return false;
                    }
                }
                else if (type == "ajax") {
                    if (isSubmit) return true;
                    //用户名的远程查询
                    control.tip.addClass("help_tip").html("正在检查中...");
                    var param = {};
                    param.name = value;
                    ec.ajax({
                        url: ru.name,
                        type: "POST",
                        data: param,
                        success: function (reply) {
                            control.tip.removeClass("help_tip").empty();
                            if (reply.code == "0" && reply.data && reply.data.code == "0") {
                                control.input.addClass("valid-input");
                                control.valid = true;
                            }
                            else {
                                control.tip.removeClass("mtip-right");
                                if (showErrorType == 1) {
                                    control.tip.addClass("mtip-error").html(ru.msg);
                                    show_error(ru.msg, control.input);
                                }
                                else if (showErrorType == 2) {
                                    control.tip.addClass("mtip-error").html(ru.msg);
                                }
                                else if (showErrorType == 3) {
                                    show_error(ru.msg, control.input);
                                }
                                control.valid = false;
                            }
                        }
                    });
                    return false;
                } else if (type == "required") {
                    if (!value) {
                        control.tip.removeClass("mtip-right");
                        if (showErrorType == 1) {
                            control.tip.addClass("mtip-error").html(ru.msg);
                            show_error(ru.msg, control.input);
                        }
                        else if (showErrorType == 2) {
                            control.tip.addClass("mtip-error").html(ru.msg);
                        }
                        else if (showErrorType == 3) {
                            show_error(ru.msg, control.input);
                        }
                        control.valid = false;
                        return false;
                    }
                } else if (type == "range") {
                    var range = ru.range;
                    var min = range[0];
                    var max = range[1];
                    if (!(value.length >= min && value.length <= max)) {
                        control.tip.removeClass("mtip-right");
                        if (showErrorType == 1) {
                            control.tip.addClass("mtip-error").html(ru.msg);
                            show_error(ru.msg, control.input);
                        }
                        else if (showErrorType == 2) {
                            control.tip.addClass("mtip-error").html(ru.msg);
                        }
                        else if (showErrorType == 3) {
                            show_error(ru.msg, control.input);
                        }
                        control.valid = false;
                        return false;
                    }
                }
                else if (type == "function") {
                    var check = ru.check || function () { };
                    var flag = check.call(this, value);
                    if (!flag) {
                        control.tip.removeClass("mtip-right");
                        if (showErrorType == 1) {
                            control.tip.addClass("mtip-error").html(ru.msg);
                            show_error(ru.msg, control.input);
                        }
                        else if (showErrorType == 2) {
                            control.tip.addClass("mtip-error").html(ru.msg);
                        }
                        else if (showErrorType == 3) {
                            show_error(ru.msg, control.input);
                        }
                        control.valid = false;
                        return false;
                    }
                }
            }
        }
        //input 上加入检查正确标记
        control.input.addClass("valid-input");
        control.tip.removeClass("mtip-error").empty();
        //        control.tip.addClass("mtip-right");
        control.valid = true;
        control.value = value;
        return true;
    }
    var me = this;
    var submitbtn = dom.find(".submit");
    submitbtn.unbind("click");
    submitbtn.click(function () {
        var flag = true;
        var showType = 1;
        var valid = true;
        //            var params = {};
        for (var n in controls) {
            var c = controls[n];
//            if (!c.valid)
//                valid = false;
            var value = get_input_value(c.input);
            flag = valid_item(value, c, showType, true);
            if (!flag) {
                valid = false;
                showType = 2;
            }
            //                params[n] = c.value;
        }
        if (!valid) return false;
        if (me.callback) {
            me.callback(this);
            //                me.callback();
            return false;
        }
        return true;
    });

};
var fn = my.prototype;
fn.set_error = function (name, message) {
//    alert(1);
    //        var control = this.controls[name];
    //        if (!control) return;
    //        control.tip.addClass("mtip-error").html(message);
    //        control.valid = false;
}
fn.set_clear = function (name) {
//    var control = this.controls[name];
//    if (!control) return;
//    control.tip.removeClass("mtip-error").empty();
//    control.valid = true;
}
fn.valid_form = function (name) {

}

module.exports = my;

});