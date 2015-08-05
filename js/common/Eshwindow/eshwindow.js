/*
ESH构造窗体
*/
define(['js/common/wtaid/wtaid', 'js/common/procopy/procopy', 'css/common/ui-window/ui-window.css'], function (require, exports, module) {
    var WTaid = require('js/common/wtaid/wtaid');
    var ZDK = require('js/common/procopy/procopy');
    var Window = exports.window = function (options) {
        options.zIndex = options.zIndex || 190;
        options.isWindow = true;
        return WTaid.callee(this, arguments.callee, options);
    };
    Window.prototype = {
        create: function () {
            Window.create(this);
        },
        bind: function () {
            var self = this;
            if (self.opche.escClose) {
                $(document).bind('keyup', function (e) {
                    if (e.which == 27) {
                        self.hide();
                    }
                });
            }
        },
        inited: function () {
            this.trigger('inited');
        },
        reset: function () {
            this.resetPosition();
            this.show();
            if (this.opche.hasIframe) {
                this.Window.find('iframe.ui-window-bgd').css({
                    height: this.Window.height()
                });
            }
        },
        resetPosition: function () {
            var width = this.Window.width();
            var height = this.Window.height();
            var scroll = $(document).scrollTop();
            this.Window.css({
                'margin-left': -width / 2,
                'margin-top': -height / 2 + scroll
            });
        },
        resetTheme: function (className) {
            this.Window.addClass(className);
        },
        resetTitle: function (title) {
            this.Title.html(title);
        },
        setTitle: function (title) {
            this.Title.html(title);
            return this;
        },
        setContentNode: function (node) {
            this.Body.empty().append(node);
            this.resetPosition();
            return this;
        },
        resetBody: function (body) {
            this.Body.html(body);
        },
        hideClose: function () {
            self.Close.hide();
        },
        resetFooter: function (footer) {
            this.Footer.show();
            this.Footer.html(footer);
        },
        resetOkButton: function (footer) {
            this.Footer.show();
            this.Footer.find(".ui-window-ok").html("<i></i>" + footer);
        },
        resetCancelButton: function (footer) {
            this.Footer.show();
            this.Footer.find(".ui-window-cancel").html("<i></i>" + footer);
        },
        ok: function () {
            if (this.Footer.find(".ui-window-ok").attr("disabled") == "disabled") {
                return false;
            }
            if (false != this.trigger('onok')) {
                this.hide();
            }
        },
        cancel: function () {
            if (false != this.trigger('oncancel')) {
                this.hide();
            }
        }
    };
    Window.create = function (self) {
        var opche = self.opche,
            ctml;
        ctml = ['<div class="ui-window ' + opche.theme + '">'];
        self.opche.hasIframe && ctml.push('<iframe scrolling="no" class="ui-window-bgd" ' + (opche.height && opche.height != 'auto' ? 'style="height:' + opche.height + 'px"' : '') + '></iframe>');
        ctml.push('<div class="ui-window-header">');
        ctml.push('<a href="javascript:;" class="ui-window-close" action-type="window-close" ' + (!opche.allowClose ? 'style="display:none;"' : '') + '>×</a>');
        ctml.push('<h3>' + opche.title + '</h3></div><div class="ui-window-body"><p class="ui-initwait"> 正在加载中...</p></div>');
        if (opche.ok || opche.cancel) {
            var toolbar = '<div class="ui-window-footer">';
            if (opche.footer) {
                toolbar += opche.footer;
            } else {
                if (opche.cancel) {
                    toolbar += '<a href="javascript:void(0);" action-type="window-cancel" class="ui-window-cancel butn small-butn"><i></i>' + (typeof opche.cancel == 'string' ? opche.cancel : '取消') + '</a>';
                }
                if (opche.ok) {
                    toolbar += '<a href="javascript:void(0);" action-type="window-ok" class="ui-window-ok butn small-butn small-butn-orange"><i></i>' + (typeof opche.ok == 'string' ? opche.ok : '确定') + '</a>';
                }
            }
            ctml.push(toolbar + '</div>');
        } else {
            ctml.push('<div class="ui-window-footer" style="display:none;"></div>');
        }
        ctml.push('</div>');
        self.Window = $(ctml.join('')).appendTo(document.body);
        self.Header = self.Window.find('.ui-window-header');
        self.Title = self.Header.find('h3');
        self.Body = self.Window.find('.ui-window-body');
        self.Footer = self.Window.find('.ui-window-footer');
        self.Close = self.Window.find('.ui-window-close');
        if (toolbar) {
            self.Ok = self.Footer.find('.ui-window-ok');
            self.Cancel = self.Footer.find('.ui-window-cancel');
        }
        self.on('click:window-cancel', function () {
            self.cancel();
        }).on('click:window-ok', function () {
            self.ok();
        }).on('click:window-close', function () {
            self.hide();
        });
    };
    try {
        module.exports =ZDK.procopy(Window, WTaid);
    } finally {
       
        Window.Tips = function (title, content, timeout, icon, callback, errback, btnText) {
            var win = Window.one = Window({
                title: title,
                content: (icon ? '<div class="' + icon + '">' + content + '</div>' : content),
                id: 'winalert' + ZDK.uuid(),
                width: 430,
                mask: true,
                cache: false,
                zIndex: 9000,
                close: false,
                hasIframe: true,
                cancel: typeof (errback) == "string" ? errback : errback && true,
                ok: btnText || true
            }),
                timer;
            if (timeout) {
                timer && clearTimeout(timer);
                timer = setTimeout(function () {
                    win.hide();
                }, timeout);
            }
            callback && win.on('onok', function () {
                return callback();
            })
            errback && win.on('oncancel', function () {
                typeof (errback) == "string" ? win.hide() : errback();
            });
            return win;
        };
        ZDK.Alert = function (title, content, timeout, callback, errback, btnText) {
            Window.Tips(title, content, timeout == undefined ? 4000 : timeout, 'ui-warning', callback, errback, btnText);
        };
        ZDK.Error = function (title, content, timeout, callback, errback, btnText) {
            Window.Tips(title, content, timeout == undefined ? 4000 : timeout, 'ui-error', callback, errback, btnText);
        };
        ZDK.Success = function (title, content, timeout, callback, errback, btnText) {
            Window.Tips(title, content, timeout == undefined ? 4000 : timeout, 'ui-success', callback, errback, btnText);
        };
        ZDK.Load = function (options) {
            var opt = options ? options : {};
            var title = opt.title ? opt.title : "系统提示";
            var url = opt.url ? opt.url : "";
            var dataType = opt.dataType ? opt.dataType : "html";
            var callback = opt.callback ? opt.callback : false;
            var errback = opt.errback ? opt.errback : false;
            var loadback = opt.loadback ? opt.loadback : false;
            var width = opt.width ? opt.width : 430;
            var ok = opt.ok ? opt.ok : false;
            var cancel = opt.cancel ? opt.cancel : false;
            var zIndex = opt.zIndex ? opt.zIndex : 9000;
            var json;
            var content;
            $.ajax({
                url: url,
                type: opt.type || "get",
                dataType: dataType,
                success: function (data) {
                    json = data;
                    content = dataType ? '<div>' + data.msg + '</div>' : data;
                    var win = Window.one = Window({
                        title: title,
                        content: dataType == "html" ? data : content,
                        id: 'winalert' + ZDK.uuid(),
                        width: width,
                        mask: true,
                        cache: false,
                        zIndex: zIndex,
                        close: false,
                        hasIframe: true,
                        ok: ok,
                        cancel: cancel
                    }),
                        timer;
                    callback && win.on('onok', function () {
                        callback(win, json);
                        return false
                    });
                    errback && win.on('oncancel', function () {
                        errback();
                    });
                    loadback && loadback(win);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    content = "加载失败，请刷新页面后重试...";
                }
            });
        };
    }

});