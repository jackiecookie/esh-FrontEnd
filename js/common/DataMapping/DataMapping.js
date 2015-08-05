/*
从数据库获取的值赋值给页面控件
*/
define(['jquery'], function (require, exports, module) {
    exports.DataBindings = function (dataObj, elmContext) {
        //        elmContext = elmContext || function () { var f = $('form'); return f.length > 0 ? f : 'body'; } ();
        elmContext = elmContext || 'body';
        var $bindElm = $('[data-bind]', elmContext), beLen = $bindElm.length;
        if (beLen > 0) {
            var hooks = {
                value: 'val',
                html: 'html',
                text: 'text'
            };
            for (var i = 0; i < beLen; i++) {
                var $elm = $($bindElm[i]), hook,
                elAttr = $elm.attr('data-bind');
                if (elAttr) {
                    elAttr = elAttr.split(':');
                    var val = dataObj && dataObj['' + elAttr[1] + ''];
                    if (val != undefined) {
                        var bindType = elAttr[0].split(','), typeLen = bindType.length;
                        for (var j = 0; j < typeLen; j++) {
                            hook = hooks[bindType[j]];
                            (hook && $elm[hook](val)) || $elm.attr(bindType[j], val);
                        }
                    }
                }
            }
        }

    };
});