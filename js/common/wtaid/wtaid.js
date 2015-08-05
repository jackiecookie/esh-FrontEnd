/*
弹出窗体
*/
define(function (require, exports, module) {
    var ZDK = require('js/common/procopy/procopy');
    var WTaid = function () { },
        SCRIPT = /<script\s*type=['"]?([^'"]+)['"]?>([\w\W]+?)<\/script>/igm,
        CACHE = {};
    WTaid.callee = function (self, callee, options) {
        if (!options.id) {
            options.id = (typeof options.content == 'string' && options.content) ? ZDK.hash(options.content) : ZDK.uuid();
        }
        var youCan = options.target;
        if (!youCan) {
            opcache();
        } else if (youCan.hasClass("childs")) {
            var _flag = youCan.attr("flag")
            if (_flag > 0 && options.cache) {
                return opcache();
            } else {
                youCan.attr("flag", ++_flag);
            }
        }
        if (!(self instanceof callee)) {
            return new callee(options);
        }

        function opcache() {
            if (options.cache == undefined || options.cache) {
                if ((wtaid = CACHE[options.id])) {
                    $.extend(wtaid.opche, options);
                    wtaid.trigger('cache', {
                        target: wtaid
                    });
                    wtaid.reset && wtaid.reset();
                    return wtaid.show();
                }
            }
        }
        self.entry(options);
    };
    WTaid.prototype = {
        entry: function (options) {
            var opche = this.opche = $.extend({
                target: null,
                title: '弹出窗口',
                id: null,
                content: '',
                iframe: false,
                cache: true,
                allowClose: true,
                escClose: false,
                cancel: true,
                ok: true,
                height: 'auto',
                width: 560,
                onInited: null,
                zIndex: 100,
                mask: true,
                theme: ''
            }, options),
                self = this,
                wtaid;
            opche.cache && (CACHE[options.id] = self);
            !($.browser.msie && ($.browser.version == "6.0") && !$.support.style) && (this.opche.hasIframe = false);
            ((self.pageurl = false) || (typeof opche.content == 'string')) && (opche.content.match(/^([^<>]+|[a-z\/.\?%@&=]+)$/i)) && (self.pageurl = opche.content);
            opche.iframe = opche.iframe && self.pageurl;
            opche.escClose = opche.escClose && opche.allowClose;
            if (self.pageurl) {
                self.jsonp = false;
                if (isJSONPRequest()) {
                    self.jsonp = true;
                }
            }
            self.init(this);

            function isJSONPRequest() {
                return self.pageurl.indexOf(location.host) == -1 || self.pageurl.indexOf('jsonpcallback') != -1;
            }
        },
        init: function (self, tc) {
            self.create();
            self.bindTarget(self.Window);
            if (!self.pageurl) {
                self.Body.html('').append(self.opche.content);
            } else {
                if (self.opche.iframe) {
                    return self.bindIframe();
                }
                self.on('click:wtaid-reasyn', function () {
                    self.Body.html('<p class="ui-initwait">正在重新连</a>');
                    self.pageurl += (self.pageurl.indexOf('?') > -1 ? '&' : '?') + 't=' + ZDK.uuid();
                    self.asyn();
                });
                self.asyn();
            }
            self.show();
            self._inited(self);
            self.opche.onInited && self.opche.onInited(self);
            self.Window.css('z-index', self.opche.zIndex);
        },
        _inited: function (self, data, tc) {
            (tc = self.opche.width) && self.resetWidth(tc);
            if ((tc = self.opche.height) && tc != 'auto') {
                self.resetHeight(tc);
            }
            self.inited && self.inited();
            self.bind && self.bind();
            self.trigger('inited', $.extend({
                target: data || null
            }));
            self.reset && self.reset();
            self.ready = true;
            self.opche.isWindow || self.Window.mousedown(function (e) {
                e.stopPropagation();
            });
            self.opche.onContentLoaded && self.opche.onContentLoaded(self);
        },
        show: function () {
            this.isshow = true;
            if (false !== this.trigger('showbefore', {
                target: this
            })) {
                this.Window.show();
            }
            this.trigger('onshow', {
                target: this
            });
            this.resetPosition && this.resetPosition();
            var self = this;
        
            setTimeout(function () {
                self.thide && $(document).bind('mousedown', {
                    self: self
                }, self.thide);
            }, 0);
            self.opche.mask && ZDK.mask();
        },
        hide: function () {
            if (this.target && this.target.attr("act-type") == "thinks") this.target.parents(".user-red").removeAttr("style");
            if (this.isshow) {
                this.isshow = false;
                if (false !== this.trigger('hidebefore', {
                    target: this
                })) {
                    this.Window.hide();
                }
                this.trigger('hide', {
                    trigger: this
                });
                this.thide && $(document).unbind('mousedown', this.thide);
                this.opche.mask && ZDK.mask(true);
                !this.opche.cache && this.Window.remove();
            }
        },
        resetHeight: function (height) {
            if (height) {
                this.Body.css('height', height);
                this.trigger('resetHeight', {
                    height: height,
                    target: this
                });
                this.resetPosition && this.resetPosition();
            }
        },
        getHeight: function () {
            return this.Body.height();
        },
        resetWidth: function (width) {
            if (width) {
                this.opche.width = width;
                this.Window.css('width', width);
                this.trigger('resetWidth', {
                    width: width,
                    targer: this
                });
            }
        },
        getWidth: function () {
            return this.Window.width();
        },
        bindIframe: function () {
            var self = this,
                pageurl = self.pageurl,
                opche = self.opche;
            self.Iframe = $('<iframe style="display:none;width:100%;border:none;" frameborder="0" scrolling="no" src="' + pageurl + '"  ></iframe>');
            self.Iframe.bind('load', function (tc) {
                self.Iframe.show();
                self.Iframe.css('height', opche.height !== 'auto' ? opche.height || 350 : 350);
                self.Body.html('').append(self.Iframe);
                self.trigger('iframeonload', {
                    iframe: self.Iframe
                });
                self.ready = true;
                self.bind && self.bind();
                (tc = self.opche.width) && self.resetWidth(tc);
                if ((tc = self.opche.height) && tc != 'auto') {
                    self.resetHeight(tc);
                }
                self._inited(self);
            });
            return $(document.body).append(self.Iframe);
        }
    };
    module.exports = ZDK.procopy(WTaid, ZDK.EventDelegate);
});