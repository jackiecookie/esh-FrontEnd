//搜索框获默认说明文字获得焦点去除文字 插件
define(function (require, exports, moudles) {
    require('jquery');
    (function ($) {
        $.fn.smartFocus = function (text) {
            $(this).data('defaultValue',text);
            if ($(this).val() == "" || $(this).val() == text) {
                $(this).css('color', '#b2b2b2');
                $(this).val(text);
            }
            $(this).focus(function () {
                if ($(this).val() == text) {
                    $(this).val('');
                    $(this).css('color', '#000');

                }
            }).blur(function () {
                if ($(this).val() == '') {
                    $(this).val(text);
                    $(this).css('color', '#b2b2b2');
                }

            });
        };
    })(jQuery);
});