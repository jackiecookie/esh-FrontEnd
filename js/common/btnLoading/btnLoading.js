/*
页面提交数据时按钮提示信息
*/
define(function (require, exports, module) {
    var ZDK = require('js/common/procopy/procopy');
    var btnloading = module.exports = function (options) {
        var op = options ? options : {};
        if (!op.obj) {
            return false;
        }
        op.nodeName = op.obj.get(0).nodeName;
        op.txt = op.txt ? op.txt : "提交中";
        op.dynamic = (typeof op.dynamic != "undefined" ? op.dynamic : true);
        var isloading = op.obj.attr("isloading");
        if (isloading === "loading") {
            return false;
        } else {
            op.obj.attr("isloading", "loading");
            op.obj.data("oldtext", op.obj.html());
            op.obj.data("oldclass", op.obj.attr("class"));
            op.obj.attr("disabled", "disabled");
            if (op.addClass) {
                op.obj.addClass(op.addClass);
            }
            if (op.removeClass) {
                op.obj.removeClass(op.removeClass);
            }
            if (op.dynamic) {
                op.obj.html(op.txt + "&nbsp;&nbsp;&nbsp;");
                var n = 0;
                op.obj.get(0).loadingtimer = setInterval(function() {
                    if (n == 0) {
                        op.obj.html(op.txt + ".&nbsp;&nbsp;");
                        n++;
                    } else if (n == 1) {
                        op.obj.html(op.txt + "..&nbsp;");
                        n++;
                    } else if (n == 2) {
                        op.obj.html(op.txt + "...");
                        n = 0;
                    }
                }, 200);
            } else {
                op.obj.html(op.txt);
            }
            return true;
        }
    };
    btnloading.reset = function(obj) {
        obj.attr("isloading", "");
        obj.html(obj.data("oldtext"));
        obj.attr("class", obj.data("oldclass"));
        if (obj.get(0).loadingtimer) {
            clearInterval(obj.get(0).loadingtimer);
        }
        obj.removeAttr("disabled");
    };
    return ZDK.procopy(btnloading, ZDK.EventEmitter);
});