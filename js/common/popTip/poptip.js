
/*
 实现各种弹出消息/tips的效果.
 点击任意控件，按钮，导航条按钮，工具条按钮（UIBarButtonItem），都会弹出消息气泡。弹出的气泡会自动定位在相应的按钮旁边，并且有小箭头指向这个按钮。气泡的文字和颜色可以自定义。
*/
define(['css/common/tip/tips.css', 'js/common/wtaid/wtaid', 'js/common/procopy/procopy'], function (require, exports, module) {
    require('css/common/tip/tips.css');
    var WTaid = require('js/common/wtaid/wtaid'),
    ZDK = require('js/common/procopy/procopy'),
    PopTip = exports.poptip = function (options) {
        options.mask = false;
        return WTaid.callee(this, arguments.callee, options);
    };
    PopTip.prototype = {
        create: function (pageurl) {
            PopTip.create(this, pageurl);
        },
        bind: function () {
            var self = this;
            self.target = $(this.opche.target);
        },
        thide: function (e) {
            var self = e.data.self;
            var target = e.target;
            if (target && target.nodeName && target.nodeName.toUpperCase() == "WEBDATEDAYITEM") {
                return false;
            }
            if (typeof self.opche.autoclose != 'undefined' && self.opche.autoclose == false) {
                return;
            }
            if (1 === e.which) {
                self.hide();
            }
        },
        reset: function () {
            var self = this,
                focetop, offset = self.target.offset(),
                ocss = {},
                width = self.target.outerWidth(true),
                height = self.target.outerHeight(),
                WWidth = self.Window.outerWidth(),
                WHeight = self.Window.outerHeight(),
                Width = $(window).width(),
                Height = $(window).height();
            ocss['left'] = offset.left;
            ocss['top'] = offset.top + height + 15;
            if (self.opche.autoreset) {
                self.Window[(focetop = (offset.top < WHeight + $(document.body).scrollTop() + 30)) ? 'removeClass' : 'addClass']('ui-poptip-reverse');
            }
            if (self.opche.arrStyle) {
                self.Arrow.css(self.opche.arrStyle);
            } else if (self.opche.right || Width - ocss['left'] < WWidth) {
                ocss['left'] = offset.left + width - WWidth;
                self.Arrow.css({
                    left: 'auto',
                    right: self.opche.arrowOffset || 7
                });
            } else {
                self.Arrow.css({
                    left: 7,
                    right: 'auto'
                });
            }
            if (self.opche.arrStyle) {
                self.Arrow.css(self.opche.arrStyle);
            } else if (self.opche.right && ocss['left'] < 10) {
                ocss['left'] = offset.left;
                self.Arrow.css({
                    left: self.opche.arrowOffset || 7,
                    right: 'auto'
                });
            }
            if (!focetop && self.opche.bottom) {
                ocss['top'] = offset.top - 15 - WHeight;
            }
            this.Window.css({
                top: ocss['top'] + (this.opche.offTop || 0),
                left: ocss['left'] + (this.opche.offLeft || 0)
            });
            this.show();
        },
        updatePosition: function () {
            var self = this,
                focetop, offset = self.target.offset(),
                ocss = {},
                width = self.target.outerWidth(true),
                height = self.target.outerHeight(),
                WWidth = self.Window.outerWidth(),
                WHeight = self.Window.outerHeight(),
                Width = $(window).width(),
                Height = $(window).height();
            ocss['left'] = offset.left;
            ocss['top'] = offset.top + height + 15;
            if (self.opche.autoreset) {
                self.Window[(focetop = (offset.top < WHeight + $(self.opche.doc.body).scrollTop() + 30)) ? 'removeClass' : 'addClass']('ui-poptip-reverse');
            }
            if (!focetop && self.opche.bottom) {
                ocss['top'] = offset.top - 15 - WHeight;
            }
            this.Window.css({
                top: ocss['top'] + (this.opche.offTop || 0),
                left: ocss['left'] + (this.opche.offLeft || 0)
            });
        },
        resetBody: function (body) {
            this.Body.html(body);
        },
        resetWidth: function (width) {
            this.Window.css({
                width: width
            });
        }
    };
    PopTip.create = function (self, pageurl) {
        var opche = self.opche,
            ctml;
        if (opche.bottom) {
            opche.theme += ' ui-poptip-reverse';
        }
        ctml = self.opche.hasIframe ? '<div class="ui-poptip-wrapper clearfix">' : '';
        self.opche.hasIframe && (ctml += '<iframe scrolling="no" class="ui-window-bgd" ' + (opche.height && opche.height != 'auto' ? 'style="height:' + opche.height + 'px"' : '') + '></iframe>');
        ctml += '<div class="ui-poptip ' + opche.theme + '" style="display:;"><div class="ui-poptip-arrow"><i></i></div><div class="ui-poptip-body"><p class="ui-initwait"> 正在加载中...</p></div></div>';
        self.opche.hasIframe && (ctml += '</div>');
        self.Window = $(ctml).appendTo(document.body);
        self.Body = self.Window.find('.ui-poptip-body');
        self.Arrow = self.Window.find('.ui-poptip-arrow');
        if (opche.arrStyle) {
            self.Arrow.css(opche.arrStyle);
        } else if (opche.right) {
            self.Arrow.css({
                left: 'auto',
                right: 20
            });
        }
    };
    module.exports = ZDK.procopy(PopTip, WTaid);
});