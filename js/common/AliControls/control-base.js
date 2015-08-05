/*
易上弘底层js控件 底层支持js
*/
define(['css/common/AliControls/style.css'], function (require, exports, module) {
    var Alipw = function () {
        var c = navigator.userAgent.toLowerCase();
        var b = c.match(/msie ([\d.]+)/) ? c.match(/msie ([\d.]+)/)[1] : undefined;
        var f = typeof (b) != "undefined";
        var k = b && parseInt(b) == 6;
        var i = b && parseInt(b) == 7;
        var h = b && parseInt(b) == 8;
        var g = b && parseInt(b) == 9;
        var l = /applewebkit/.test(c);
        var d = c.match(/opera\/([\d.]+)/);
        var e;
        var p;
        var m;
        var n;
        var o;
        var a = [];
        var j = {

            ieVersion: b,
            isIE: f,
            isIE6: k,
            isIE7: i,
            isIE8: h,
            isIE9: g,
            isWebKit: l,
            isOpera: d,
            theme: "default",
            useShims: false,
            apply: function (s, t, r) {
                if (r) {
                    Alipw.apply(s, r);
                }
                if (s && t && typeof t == "object") {
                    for (var q in t) {
                        s[q] = t[q];
                    }
                }
                return s;
            },
            override: function (q, s) {
                if (s) {
                    var r = q.prototype;
                    Alipw.apply(r, s);
                    if (Alipw.ie() && s.hasOwnProperty("toString")) {
                        r.toString = s.toString;
                    }
                }
            },
            extend: function () {
                var r = function (t) {
                    for (var s in t) {
                        this[s] = t[s];
                    }
                };
                var q = Object.prototype.constructor;
                return function (x, u, w) {
                    if (typeof u == "object") {
                        w = u;
                        u = x;
                        x = w.constructor != q ? w.constructor : function () {
                            u.apply(this, arguments);
                        };
                    }
                    var t = function () { }, v, s = u.prototype;
                    t.prototype = s;
                    v = x.prototype = new t();
                    v.constructor = x;
                    x.superclass = s;
                    if (s.constructor == q) {
                        s.constructor = u;
                    }
                    x.override = function (y) {
                        Alipw.override(x, y);
                    };
                    v.superclass = v.supr = (function () {
                        return s;
                    });
                    v.override = r;
                    Alipw.override(x, w);
                    x.extend = function (y) {
                        return Alipw.extend(x, y);
                    };
                    return x;
                };
            } (),
            getDoc: function () {
                if (!e) {
                    e = jQuery(window.document);
                }
                return e;
            },
            getWin: function () {
                if (!p) {
                    p = jQuery(window);
                }
                return p;
            },
            getBody: function () {
                if (!m) {
                    m = jQuery(window.document.body);
                }
                return m;
            },
            getComp: function (q) {
                return Alipw.ComponentManager.getComponent(q);
            },
            getModule: function (r) {
                var q = Alipw.ComponentManager.getComponent(r);
                if (q instanceof Alipw.Module) {
                    return q;
                }
                return null;
            },
            addModuleScript: function (q) {
                Alipw.Module.__moduleScriptFn = q;
                q.__Alipw_needToReload = true;
            },
            adjustImgSize: function (s, w, x, r) {
                if (typeof (r) == "undefined") {
                    r = true;
                }
                var v = new Image();
                v.src = s.src;
                var u = v.width;
                var t = v.height;
                if (!s._adjustSizeTryTime) {
                    s._adjustSizeTryTime = 0;
                }
                if ((u == 0 || t == 0) && s._adjustSizeTryTime < 100) {
                    s._adjustSizeTryTime++;
                    setTimeout(function () {
                        Alipw.adjustImgSize(s, w, x, r);
                    }, 10);
                    return;
                }
                if (u <= w && t <= x) {
                    s.style.width = u + "px";
                    s.style.height = t + "px";
                    if (r) {
                        s.style.paddingLeft = s.style.paddingRight = parseInt((w - u) / 2) + "px";
                        s.style.paddingTop = s.style.paddingBottom = parseInt((x - t) / 2) + "px";
                    }
                } else {
                    var q = w;
                    var y = (w * t) / u;
                    if (y > x) {
                        y = parseInt(x);
                        q = parseInt((x * u) / t);
                    }
                    s.style.width = q + "px";
                    s.style.height = y + "px";
                    if (r) {
                        s.style.paddingLeft = s.style.paddingRight = parseInt((w - q) / 2) + "px";
                        s.style.paddingTop = s.style.paddingBottom = parseInt((x - y) / 2) + "px";
                    }
                }
            },
            isSet: function (q) {
                if (typeof (q) != "undefined" && q != null) {
                    return true;
                } else {
                    return false;
                }
            },
            ie: function () {
                var q = navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/);
                return q ? q[1] : undefined;
            },
           
            getFileInfo: function () {
                if (!o) {
                    var t = document.getElementsByTagName("script");
                    var r;
                    for (var s = 0, q = t.length; s < q; s++) {
                        r = t[s].src.toString().match(/(.*)alipw\/classes\/(.+)\.js/i);
                        if (r) {
                            o = {
                                rootPath: r[1],
                                classPath: r[1] + "alipw/classes/",
                                mode: r[2].replace("alipw-", "")
                            };
                        }
                    }
                }
                return o;
            },
            removeItemFromArray: function (t, r) {
                for (var s = 0, q = r.length; s < q; s++) {
                    if (r[s] == t) {
                        r.splice(s, 1);
                        s--;
                        q = r.length
                    }
                }
            },
            indexOfArray: function (t, r) {
                for (var s = 0, q = r.length; s < q; s++) {
                    if (r[s] === t) {
                        return s
                    }
                }
                return -1
            },
            getDocWidth: function () {
                if (Alipw.ie()) {
                    if (document.compatMode == "BackCompat") {
                        return document.body.scrollWidth
                    } else {
                        return document.documentElement.scrollWidth
                    }
                } else {
                    return jQuery(document).width()
                }
            },
            getDocHeight: function () {
                if (Alipw.ie()) {
                    if (document.compatMode == "BackCompat") {
                        return document.body.scrollHeight
                    } else {
                        return document.documentElement.scrollHeight
                    }
                } else {
                    return jQuery(document).height()
                }
            },
            isInNode: function (r, q) {
                var t = q.getElementsByTagName("*");
                for (var s = 0; s < t.length; s++) {
                    if (t[s] == r) {
                        return true
                    }
                }
                return false
            },
            isReady: function () {
                return Alipw.isDOMReady && Alipw.ClassManager.getStatus() == "complete"
            },
            isDOMReady: false,
            importClass: function () {
                if (Alipw.mode == "all") {
                    return
                }
                Alipw.ClassManager.loadClass.apply(Alipw.ClassManager, arguments)
            },
            each: function (r, u, t) {
                if (!(u instanceof Function)) {
                    return
                }
                if (r instanceof Array) {
                    for (var s = 0, q = r.length; s < q; s++) {
                        if (u.call(t, s, r[s]) == false) {
                            break
                        }
                    }
                } else {
                    if (r instanceof Object) {
                        for (var s in r) {
                            if (u.call(t, s, r[s]) == false) {
                                break;
                            }
                        }
                    }
                }
            },
            clone: function (r, q) {
                return jQuery.extend(q, {}, r);
            },
            createFuncProxy: function (r, q) {
                return function () {
                    r.apply(q, arguments);
                };
            },
            getWinProxy: function () {
                if (!Alipw.WinProxy.initialized) {
                    Alipw.WinProxy.initialize();
                }
                return Alipw.WinProxy;
            },
            getObjectByName: function (r) {
                var u = r.split(".");
                var t;
                for (var s = 0, q = u.length; s < q; s++) {
                    if (!t && s == 0) {
                        t = window[u[s]];
                    } else {
                        if (t) {
                            t = t[u[s]];
                        } else {
                            break;
                        }
                    }
                }
                return t;
            },
            classLoadedHandler: function () {
                for (var r = 0, q = a.length; r < q; r++) {
                    a[r]();
                }
                a = [];
            },
            convertEl: function (r) {
                var q;
                if (typeof (r) == "string" && r.substr(0, 1) != "#") {
                    q = jQuery("#" + r);
                } else {
                    q = jQuery(r);
                    if (q.length > 1) {
                        q = jQuery(q[0]);
                    }
                }
                return q;
            }
        };
        return j;
    } ();
    var A = Alipw;
    Alipw.Event = function () {
        var a = function (d, c, e, b) {
            jQuery.extend(this, e);
            this.type = d.replace(/alipw\-/g, "");
            this.currentTarget = c;
            this.target = c;
            this.jQueryEvent = b;
        };
        a.prototype = {
            preventDefault: function () {
                if (this.jQueryEvent) {
                    this.jQueryEvent.preventDefault();
                }
                this.isDefaultPrevented = true;
            },
            stopPropagation: function () {
                if (this.jQueryEvent) {
                    this.jQueryEvent.stopPropagation();
                }
            }
        };
        return a;
    } ();
    Alipw.EventManager = function () {
        var b = new Array();
        b.getFnProxy = function (f, d) {
            for (var e = 0, c = b.length; e < c; e++) {
                if (b[e].fn == f && b[e].object == d) {
                    return b[e].proxy;
                }
            }
            return null;
        };
        var a = {
            addListener: function (d, h, g, f, i) {
                var e;
                if (d instanceof Alipw.Component) {
                    e = d.el;
                } else {
                    if (d instanceof Alipw.Nonvisual) {
                        e = d.evtProxy;
                    } else {
                        return;
                    }
                } if (!i) {
                    h = "alipw-" + h;
                }
                if (i && d instanceof Alipw.Component) {
                    e.bind(h, f ? jQuery.proxy(g, f) : g);
                } else {
                    var c = b.getFnProxy(g, d);
                    if (!c) {
                        c = function (j, k) {
                            k.currentTarget = d;
                            k.jQueryEvent = j;
                            g.call(this, k, k);
                        };
                        b.push({
                            proxy: c,
                            fn: g,
                            object: d
                        });
                    }
                    e.bind(h, f ? jQuery.proxy(c, f) : c);
                }
            },
            removeListener: function (d, g, f, h) {
                var e;
                if (d instanceof Alipw.Component) {
                    e = d.el;
                } else {
                    if (d instanceof Alipw.Nonvisual) {
                        e = d.evtProxy;
                    } else {
                        return;
                    }
                } if (!h) {
                    g = "alipw-" + g;
                }
                if (h && d instanceof Alipw.Component) {
                    e.unbind(g, f);
                } else {
                    var c = b.getFnProxy(f, d);
                    if (c) {
                        e.unbind(g, c);
                    }
                }
            },
            fireEvent: function (d, f, i, c, h) {
                var e;
                if (d instanceof Alipw.Component) {
                    e = d.el;
                } else {
                    if (d instanceof Alipw.Nonvisual) {
                        e = d.evtProxy;
                    } else {
                        return
                    }
                } if (!h) {
                    f = "alipw-" + f;
                }
                if (!Alipw.isSet(c)) {
                    c = true;
                }
                if (h && d instanceof Alipw.Component) {
                    if (c) {
                        e.trigger(f, i);
                    } else {
                        e.triggerHandler(f, i);
                    }
                } else {
                    var g = new Alipw.Event(f, d, i);
                    if (c) {
                        e.trigger(f, g);
                    } else {
                        e.triggerHandler(f, g);
                    }
                    return g.isDefaultPrevented ? false : true;
                }
            },
            enableHashChangeEvent: function () {
                var c = this;
                this.hashChangeManager = new Object();
                this.hashChangeManager.lastHash = window.location.hash;
                this.hashChangeManager.timer = setInterval(function () {
                    if (window.location.hash !== c.hashChangeManager.lastHash) {
                        var d = new Object();
                        d.lashHash = c.hashChangeManager.lastHash.replace("#", "");
                        d.hash = window.location.hash.replace("#", "");
                        Alipw.getWinProxy().fireEvent("hashChange", d);
                        c.hashChangeManager.lastHash = window.location.hash;
                    }
                }, 100);
            }
        };
        return a;
    } ();
    Alipw.ClassManager = function () {
        var c = {
            "Alipw.ClassManager": "loaded",
            "Alipw.Component": "loaded",
            "Alipw.ComponentManager": "loaded",
            "Alipw.BoxComponent": "loaded",
            "Alipw.Shadow": "loaded",
            "Alipw.Container": "loaded",
            "Alipw.Nonvisual": "loaded",
            "Alipw.Template": "loaded",
            "Alipw.Module": "loaded",
            "Alipw.Event": "loaded",
            "Alipw.EventManager": "loaded",
            "Alipw.WinProxy": "loaded"
        };
        var b = {
            "Alipw.Container": ["Alipw.BoxComponent"],
            "Alipw.Panel": ["Alipw.Container", "Alipw.Button"],
            "Alipw.Window": ["Alipw.ResizeSupporter", "Alipw.DragSupporter", "Alipw.Panel", "Alipw.ScreenMask", "Alipw.WindowManager", "Alipw.AnimationProxy"],
            "Alipw.Taskbar": ["Alipw.Window", "Alipw.TaskbarItem"],
            "Alipw.Button": ["Alipw.BoxComponent"],
            "Alipw.Msg": ["Alipw.Window", "Alipw.Template"],
            "Alipw.ScreenMask": ["Alipw.FixedWrapper"],
            "Alipw.FixedWrapper": ["Alipw.Container"],
            "Alipw.ResizeSupporter": ["Alipw.BorderContainer"],
            "Alipw.BorderContainer": ["Alipw.Container"],
            "Alipw.ColorPicker": ["Alipw.BoxComponent"],
            "Alipw.Gallery": ["Alipw.DataProxy"],
            "Alipw.Slider": ["Alipw.Component"],
            "Alipw.Scrollbar": ["Alipw.Slider"],
            "Alipw.ValidatorGroup": ["Alipw.Validator"],
            "Alipw.List": ["Alipw.BorderContainer", "Alipw.ListItem", "Alipw.DataStore"],
            "Alipw.ComboBox": ["Alipw.BorderContainer", "Alipw.List"],
            "Alipw.DatePicker": ["Alipw.BorderContainer", "Alipw.utils.Date"],
            "Alipw.ToolTip": ["Alipw.BorderContainer"]
        };
        var a = Alipw.classPath;
        var d = function (g) {
            c[g] = "loading";
       
        };
        var f = function () {
            for (var g in c) {
                if (c[g] == "pending") {
                    d(g);
                    return
                }
            }
        };
        var e = {
            loadingAdapter: null,
            getStatus: function (h) {
                if (Alipw.isSet(h)) {
                    return c[h]
                } else {
                    for (var g in c) {
                        if (c[g] != "loaded") {
                            return "loading"
                        }
                    }
                    return "complete"
                }
            },
            setStatus: function (h, g) {
                c[h] = g
            },
            loadClass: function () {
                if (e.loadingAdapter) {
                    e.loadingAdapter.call(e, arguments, b);
                    return
                }
                var g = e.getStatus();
                e.addClass.apply(e, arguments);
                if (g == "complete") {
                    f()
                }
            },
            addClass: function () {
                var h = arguments;
                for (var j = 0, g = h.length; j < g; j++) {
                    if (c[h[j]]) {
                        continue
                    }
                    var k = b[h[j]];
                    if (k instanceof Array) {
                        e.addClass.apply(e, k)
                    }
                    c[h[j]] = "pending"
                }
            },
            classComplete: function (g) {
                Alipw.Config.applySettings(g)
            },
            complete: function () {
                Alipw.classLoadedHandler()
            }
        };
        return e
    } ();
    Alipw.Config = function () {
        var b = new Object();
        var a = {
            set: function (d, c) {
                if (!b[d]) {
                    b[d] = new Object()
                }
                Alipw.apply(b[d], c);
                if (Alipw.mode == "all") {
                    a.applySettings(d)
                }
            },
            get: function (c) {
                return b[c]
            },
            applySettings: function (c) {
                var d = Alipw.getObjectByName(c);
                if (d) {
                    if (d.prototype) {
                        Alipw.apply(d.prototype, b[c])
                    } else {
                        Alipw.apply(d, b[c])
                    }
                }
            }
        };
        return a
    } ();
    Alipw.Component = function () {
        var a = function (b) {
            this.config = b || (new Object());
            this.commitProperties();
            this.initialize();
            this.createDom();
            this._runAutoRender()
        };
        a.prototype = {
            autoRender: true,
            visibleRender: true,
            renderTo: null,
            defaultEl: "div",
            baseCls: "",
            subCls: "",
            cls: "",
            overCls: "",
            downCls: "",
            enabled: true,
            destroyed: false,
            visible: true,
            floating: false,
            floatingManagement: true,
            draggable: false,
            tooltip: "",
            position: "",
            inlineStyle: null,
            listeners: null,
            commitProperties: function () {
                Alipw.apply(this, this.config)
            },
            initialize: function () {
                Alipw.ComponentManager.register(this)
            },
            createDom: function () {
                this.el = $(document.createElement(this.defaultEl));
                if (this.listeners) {
                    for (var b in this.listeners) {
                        if (this.listeners[b] instanceof Function) {
                            this.addEventListener(b, this.listeners[b], this)
                        }
                    }
                }
                this.el.attr("id", this.id);
                if (this.baseCls) {
                    this.el.attr("class", this.baseCls)
                }
                if (this.subCls) {
                    this.el.addClass(this.subCls)
                }
                if (this.cls) {
                    this.el.addClass(this.cls)
                }
                if (this.zIndex) {
                    this.el.css("z-index", this.zIndex)
                }
                if (this.position == "fixed") {
                    if (parseInt(Alipw.ie()) == 6) {
                        this.el.css("position", "absolute");
                        this.x = this.getX() - jQuery(window).scrollLeft();
                        this.y = this.getY() - jQuery(window).scrollTop();
                        jQuery(window).bind("scroll", jQuery.proxy(this.scrollHandler_Component, this));
                        this.addEventListener("destroy", function (c) {
                            jQuery(window).unbind("scroll", this.scrollHandler_Component)
                        }, this)
                    } else {
                        this.el.css("position", "fixed")
                    }
                }
                if (this.inlineStyle) {
                    this.el.css(this.inlineStyle)
                }
            },
            render: function (b) {
                if (!b) {
                    if (this.renderTo) {
                        b = this.renderTo
                    } else {
                        b = document.body
                    }
                }
                this.fireEvent("beforeRender", {}, false);
                if (b instanceof Alipw.Container) {
                    b.appendChild(this, false)
                } else {
                    b = Alipw.convertEl(b);
                    b.append(this.el)
                }
                this.removed = false;
                this.fireEvent("afterRender", {}, false);
                if (!this.rendered) {
                    this.renderComplete();
                    this.rendered = true;
                    this.creationCompleteFn_Component();
                    this.fireEvent("creationComplete", {}, false)
                }
            },
            renderComplete: function (b) {
                this.addEventListener("afterLayout", this.afterLayoutHandler_Component, this);
                if (this.visibleRender && this.el.is(":hidden")) {
                    var f = jQuery('<div style="position:absolute; left:-99999px; top:-99999px;"></div>');
                    var e = this.el.next();
                    var d = this.el.parent();
                    jQuery(document.body).append(f);
                    f.append(this.el);
                    this.doLayout();
                    if (e[0]) {
                        this.el.insertBefore(e)
                    } else {
                        d.append(this.el)
                    }
                    f.remove()
                } else {
                    this.doLayout()
                } if (this.overCls) {
                    this.addEventListener("mouseover", this.mouseOverHandlerForOverCls_Component, this, true);
                    this.addEventListener("mouseout", this.mouseOutHandlerForOverCls_Component, this, true)
                }
                if (this.downCls) {
                    var c = Alipw.createFuncProxy(this.mouseUpHandlerForDownCls_Component, this);
                    this.addEventListener("mousedown", this.mouseDownHandlerForDownCls_Component, this, true);
                    jQuery(document).bind("mouseup", c);
                    this.addEventListener("destroy", function (g) {
                        jQuery(document).unbind("mouseup", c)
                    }, this)
                }
            },
            addEventListener: function (d, c, b, e) {
                Alipw.EventManager.addListener(this, d, c, b, e)
            },
            removeEventListener: function (c, b, d) {
                Alipw.EventManager.removeListener(this, c, b, d)
            },
            fireEvent: function (c, e, b, d) {
                return Alipw.EventManager.fireEvent(this, c, e, b, d)
            },
            regEvents: function (d) {
                for (var c = 0, b = d.length; c < b; c++) {
                    Rainy.EventManager.register(d[c])
                }
            },
            update: function () {
                this.renderComplete(true)
            },
            show: function () {
                if (!this.rendered) {
                    this.render()
                }
                this.setVisible(true)
            },
            hide: function () {
                this.setVisible(false)
            },
            remove: function (b) {
                if (this.destroyed) {
                    return
                }
                this.fireEvent("beforeRemove", {}, false);
                if (b) {
                    this.el.remove()
                } else {
                    this.el.detach()
                }
                this.removed = true;
                this.fireEvent("afterRemove", {}, false)
            },
            destroy: function () {
                if (this.destroyed) {
                    return
                }
                this.fireEvent("destroy", {}, false);
                this.remove(true);
                if (this.parentContainer) {
                    this.parentContainer = null
                }
                Alipw.ComponentManager.unregister(this);
                this.el = null;
                this.destroyed = true
            },
            setVisible: function (e, d, b) {
                if (!Alipw.isSet(d)) {
                    d = e
                }
                if (e) {
                    this.el.show();
                    this.el.css("visibility", "visible")
                } else {
                    this.el.hide();
                    if (d) {
                        this.el.show();
                        this.el.css({
                            visibility: "hidden"
                        })
                    } else {
                        this.el.hide();
                        this.el.css({
                            visibility: "hidden"
                        })
                    }
                }
                var c = this.visible;
                this.visible = e;
                if (c != e && !b) {
                    this.fireEvent("visibilityChange", {}, false)
                }
            },
            getVisible: function () {
                if (this.el.is(":hidden")) {
                    return false
                } else {
                    return true
                }
            },
            getZIndex: function () {
                return this.zIndex
            },
            getX: function () {
                var b = this.el.offset().left;
                if (this.position == "fixed") {
                    return b - jQuery(window).scrollLeft()
                } else {
                    return b
                }
            },
            getY: function () {
                var b = this.el.offset().top;
                if (this.position == "fixed") {
                    return b - jQuery(window).scrollTop()
                } else {
                    return b
                }
            },
            setPosition: function (b, f, e, d, c) {
                if (!Alipw.isSet(d)) {
                    d = true
                }
                if (!Alipw.isSet(c)) {
                    c = true
                }
                if (Alipw.isSet(b)) {
                    if (this.position == "fixed") {
                        if (parseInt(Alipw.ie()) == 6) {
                            this.el.css("left", (b + jQuery(window).scrollLeft()) + "px");
                            this._ie6_fixedX = b
                        } else {
                            this.el.css("left", b + "px")
                        }
                    } else {
                        if (c) {
                            this.el.offset({
                                left: b
                            })
                        } else {
                            this.el.css({
                                left: b
                            })
                        }
                    }
                }
                if (Alipw.isSet(f)) {
                    if (this.position == "fixed") {
                        if (parseInt(Alipw.ie()) == 6) {
                            this.el.css("top", (f + jQuery(window).scrollTop()) + "px");
                            this._ie6_fixedY = f
                        } else {
                            this.el.css("top", f + "px")
                        }
                    } else {
                        if (c) {
                            this.el.offset({
                                top: f
                            })
                        } else {
                            this.el.css("top", f + "px")
                        }
                    }
                }
                if (Alipw.isSet(e)) {
                    this.el.css("z-index", e)
                }
                if (d) {
                    this.fireEvent("move", {}, false)
                }
            },
            enable: function () {
                this.enabled = true
            },
            disable: function () {
                this.enabled = false
            },
            doLayout: function (c) {
                var d = this;
                var b = function () {
                    d.fireEvent("beforeLayout", {}, false);
                    d._doLayout();
                    d.fireEvent("afterLayout", {}, false)
                };
                if (this.__doLayoutBuffer) {
                    clearTimeout(this.__doLayoutBuffer)
                }
                if (c) {
                    this.__doLayoutBuffer = setTimeout(b, 1)
                } else {
                    b()
                }
            },
            _doLayout: function () { },
            _runAutoRender: function () {
                if (this.autoRender) {
                    this.render()
                }
            },
            afterLayoutHandler_Component: function (b) {
                if (this.parentContainer) {
                    this.parentContainer.doLayout(true)
                }
            },
            scrollHandler_Component: function () {
                var b = jQuery(window);
                if (this.position == "fixed") {
                    if (parseInt(Alipw.ie()) == 6) {
                        this.el.css({
                            left: b.scrollLeft() + this._ie6_fixedX,
                            top: b.scrollTop() + this._ie6_fixedY
                        })
                    }
                }
            },
            creationCompleteFn_Component: function () {
                if (this.draggable) {
                    var c = typeof (this.draggable) == "object" ? this.draggable : {};
                    this.dragSupporter = new Alipw.DragSupporter(jQuery.extend({
                        target: this
                    }, c));
                    this.addEventListener("destroy", function () {
                        if (this.dragSupporter) {
                            this.dragSupporter.destroy();
                            this.dragSupporter = null
                        }
                    }, this);
                    this.addEventListener("dragstart", this.dragStartHandler_Component, this);
                    this.addEventListener("dragend", this.dragEndHandler_Component, this)
                }
                if (this.tooltip) {
                    var b;
                    if (typeof (this.tooltip) == "object") {
                        b = this.draggable
                    } else {
                        if (typeof (this.tooltip) == "string") {
                            b = {
                                html: this.tooltip
                            }
                        }
                    }
                    this.tooltip = new Alipw.ToolTip(jQuery.extend({
                        target: this
                    }, b))
                }
            },
            dragStartHandler_Component: function () {
                if (!this.dragSupporter.useProxy) {
                    if (this.shadow) {
                        this.shadow.disable()
                    }
                }
            },
            dragEndHandler_Component: function (c, b) {
                if (this.shadow) {
                    this.shadow.enable()
                }
            },
            mouseOverHandlerForOverCls_Component: function (b) {
                if (this.destroyed) {
                    return
                }
                this.el.addClass(this.overCls)
            },
            mouseOutHandlerForOverCls_Component: function (b) {
                if (this.destroyed) {
                    return
                }
                this.el.removeClass(this.overCls)
            },
            mouseDownHandlerForDownCls_Component: function (b) {
                if (this.destroyed) {
                    return
                }
                this.el.addClass(this.downCls)
            },
            mouseUpHandlerForDownCls_Component: function (b) {
                if (this.destroyed) {
                    return
                }
                this.el.removeClass(this.downCls)
            }
        };
        return a
    } ();
    Alipw.ComponentManager = function () {
        var b = new Object();
        var a = new Array();
        var d = new Array();
        var c = {
            zseed: 8000,
            register: function (e) {
                if (e.floating && e.floatingManagement) {
                    a.push(e);
                    e.zIndex = this.zseed + a.length * 5
                }
                if (!e.id) {
                    d.push(e);
                    e.id = "Alipw-comp-" + d.length
                }
                b[e.id] = e
            },
            unregister: function (f) {
                Alipw.removeItemFromArray(f, a);
                this.updateZIndex();
                for (var g = 0, e = d.length; g < e; g++) {
                    if (d[g] == f) {
                        delete d[g]
                    }
                }
                delete b[f.id]
            },
            getComponent: function (e) {
                return b[e]
            },
            bringToFront: function (e) {
                if (e.floating && e.floatingManagement) {
                    Alipw.removeItemFromArray(e, a);
                    a.push(e);
                    this.updateZIndex()
                }
            },
            sendToBack: function () { },
            updateZIndex: function () {
                for (var f = 0, e = a.length; f < e; f++) {
                    a[f].zIndex = this.zseed + (f + 1) * 5;
                    if (a[f].rendered) {
                        a[f].setPosition(null, null, a[f].zIndex)
                    }
                }
            }
        };
        return c
    } ();
    Alipw.BoxComponent = Alipw.extend(Alipw.Component, {
        width: null,
        height: null,
        minWidth: 1,
        minHeight: 1,
        maxWidth: null,
        maxHeight: null,
        autoHeight: null,
        resizable: false,
        showShadow: false,
        shadowMode: "drop",
        constructor: function (a) {
            Alipw.BoxComponent.superclass.constructor.apply(this, arguments)
        },
        commitProperties: function () {
            Alipw.BoxComponent.superclass.commitProperties.apply(this, arguments);
            if (!this.height && !Alipw.isSet(this.autoHeight)) {
                this.autoHeight = true
            }
        },
        initialize: function () {
            Alipw.BoxComponent.superclass.initialize.apply(this, arguments)
        },
        createDom: function () {
            Alipw.BoxComponent.superclass.createDom.apply(this, arguments)
        },
        render: function (a) {
            Alipw.BoxComponent.superclass.render.apply(this, arguments)
        },
        renderComplete: function (b) {
            Alipw.BoxComponent.superclass.renderComplete.apply(this, arguments);
            if (this.showShadow) {
                if (!this.shadow) {
                    this.createShadow_BoxComponent()
                }
                this.shadow.show()
            } else {
                if (this.shadow) {
                    this.shadow.setVisible(false)
                }
            } if (this.resizable) {
                var a = typeof (this.resizable) == "object" ? this.resizable : {};
                this.resizeSupporter = new Alipw.ResizeSupporter(jQuery.extend({
                    target: this,
                    maxWidth: this.maxWidth,
                    maxHeight: this.maxHeight,
                    minWidth: this.minWidth,
                    minHeight: this.minHeight
                }, a));
                this.addEventListener("destroy", function () {
                    if (this.resizeSupporter) {
                        this.resizeSupporter.destroy();
                        this.resizeSupporter = null
                    }
                }, this)
            }
        },
        _doLayout: function () {
            Alipw.BoxComponent.superclass._doLayout.apply(this, arguments);
            if (this.width) {
                this.el.width(this.width)
            }
            if (this.autoHeight) {
                this.height = null;
                this.el.css("height", "auto");
                var a = this.getHeight();
                if (this.maxHeight && a > this.maxHeight) {
                    this.height = this.maxHeight;
                    this.el.height(this.maxHeight)
                }
                if (this.minHeight && a < this.maxHeight) {
                    this.height = this.minHeight;
                    this.el.height(this.minHeight)
                }
            } else {
                if (this.height) {
                    this.el.height(this.height)
                }
            }
        },
        setWidth: function (a) {
            this.width = a;
            this.doLayout();
            this.fireEvent("resize", {}, false)
        },
        setHeight: function (a) {
            this.height = a;
            this.autoHeight = false;
            this.doLayout();
            this.fireEvent("resize", {}, false)
        },
        setSize: function (b, a) {
            this.width = b;
            this.height = a;
            this.doLayout();
            this.fireEvent("resize", {}, false)
        },
        getWidth: function () {
            return this.el.innerWidth()
        },
        getHeight: function () {
            return this.el.innerHeight()
        },
        createShadow_BoxComponent: function (a) {
            if (this.shadow) {
                return
            }
            if (this instanceof Alipw.Shadow) {
                return
            }
            this.shadow = new Alipw.Shadow({
                target: this,
                position: this.position,
                mode: this.shadowMode
            });
            this.addEventListener("destroy", function () {
                if (this.shadow) {
                    this.shadow.destroy()
                }
            }, this)
        }
    });
    Alipw.Shadow = Alipw.extend(Alipw.BoxComponent, {
        floating: true,
        mode: "drop",
        target: null,
        floatingManagement: false,
        baseCls: "alipw-shadow",
        constructor: function (a) {
            Alipw.Shadow.superclass.constructor.apply(this, arguments)
        },
        commitProperties: function () {
            Alipw.Shadow.superclass.commitProperties.apply(this, arguments)
        },
        initialize: function () {
            Alipw.Shadow.superclass.initialize.apply(this, arguments)
        },
        createDom: function () {
            Alipw.Shadow.superclass.createDom.apply(this, arguments);
            if (Alipw.ie() && parseInt(Alipw.ie()) < 7) {
                this.el.attr("class", "alipw-ie-shadow")
            } else {
                this.el.append(['<div class="xst">', '<div class="xstl"></div>', '<div class="xstc"></div>', '<div class="xstr"></div>', "</div>", '<div class="xsc">', '<div class="xsml"></div>', '<div class="xsmc"></div>', '<div class="xsmr"></div>', "</div>", '<div class="xsb">', '<div class="xsbl"></div>', '<div class="xsbc"></div>', '<div class="xsbr"></div>', "</div>"].join(""))
            } if (this.target instanceof Alipw.BoxComponent) {
                var a = Alipw.createFuncProxy(this.applyToElement, this);
                this.target.addEventListener("resize", a);
                this.target.addEventListener("move", a);
                this.target.addEventListener("visibilityChange", a);
                this.target.addEventListener("afterRemove", a);
                this.target.addEventListener("afterRender", a);
                this.addEventListener("destroy", function () {
                    this.target.removeEventListener("resize", a);
                    this.target.removeEventListener("move", a);
                    this.target.removeEventListener("visibilityChange", a);
                    this.target.removeEventListener("afterRemove", a);
                    this.target.removeEventListener("afterRender", a)
                }, this)
            }
        },
        render: function (a) {
            Alipw.Shadow.superclass.render.apply(this, arguments);
            if (this.target) {
                this.applyToElement()
            }
        },
        renderComplete: function () {
            Alipw.Shadow.superclass.renderComplete.apply(this, arguments)
        },
        _doLayout: function () {
            Alipw.Shadow.superclass._doLayout.apply(this, arguments);
            if (!(Alipw.ie() && parseInt(Alipw.ie()) < 7)) {
                if (this.width) {
                    if (this.width < 12) {
                        this.width = 12
                    }
                    this.el.find(".xstc").width(this.width - 12);
                    this.el.find(".xsmc").width(this.width - 12);
                    this.el.find(".xsbc").width(this.width - 12)
                }
                if (this.height) {
                    if (this.height < 12) {
                        this.height = 12
                    }
                    this.el.find(".xsc").height(this.height - 12)
                }
            } else {
                this.el.width(this.width - 9);
                this.el.height(this.height - 9)
            }
        },
        enable: function () {
            Alipw.Shadow.superclass.enable.apply(this, arguments);
            this.setVisible(true);
            this.applyToElement()
        },
        disable: function () {
            Alipw.Shadow.superclass.disable.apply(this, arguments);
            this.setVisible(false)
        },
        applyToElement: function (f) {
            var h = this.target;
            if (h instanceof Alipw.BoxComponent && h.floating) {
                var b, a, c, d;
                if (this.mode == "drop") {
                    b = a = -3;
                    c = d = 8
                } else {
                    if (this.mode == "frame") {
                        b = a = -5;
                        c = d = 10
                    } else {
                        if (this.mode == "sides") {
                            b = -5;
                            a = -3;
                            c = 10;
                            d = 8
                        }
                    }
                }
                this.setWidth(h.getWidth() + c);
                this.setHeight(h.getHeight() + d);
                this.setPosition(h.getX() + b, h.getY() + a, h.getZIndex() - 1, true, false);
                if (this.enabled) {
                    var g;
                    if (h.removed) {
                        g = false
                    } else {
                        g = h.visible
                    }
                    this.setVisible(g)
                } else {
                    this.setVisible(false)
                }
            }
        }
    });
    Alipw.Container = Alipw.extend(Alipw.BoxComponent, {
        html: "",
        constructor: function () {
            Alipw.Container.superclass.constructor.apply(this, arguments)
        },
        commitProperties: function () {
            Alipw.Container.superclass.commitProperties.apply(this, arguments)
        },
        initialize: function () {
            Alipw.Container.superclass.initialize.apply(this, arguments);
            this.items = new Array()
        },
        createDom: function () {
            Alipw.Container.superclass.createDom.apply(this, arguments)
        },
        renderComplete: function () {
            Alipw.Container.superclass.renderComplete.apply(this, arguments);
            if (this.html) {
                this.appendChild(this.html)
            }
        },
        appendChild: function (c, b) {
            if (!Alipw.isSet(b)) {
                b = true
            }
            var a = this.getBody();
            if (c instanceof Alipw.Component) {
                a.append(c.el);
                this.items.push(c);
                c.parentContainer = this
            } else {
                a.append(c)
            } if (b) {
                this.doLayout()
            }
        },
        removeChild: function (c, b) {
            if (!Alipw.isSet(b)) {
                b = true
            }
            var a = this.getBody();
            if (c instanceof Alipw.Component) {
                c.remove();
                c.parentContainer = null;
                Alipw.removeItemFromArray(c, this.items)
            } else {
                jQuery(c).detach()
            } if (b) {
                this.doLayout()
            }
        },
        getBody: function () {
            return this.el
        },
        scrollX: function (b) {
            var a = this.getBody();
            a.scrollTop(a.scrollLeft() + b)
        },
        scrollY: function (b) {
            var a = this.getBody();
            a.scrollTop(a.scrollTop() + b)
        }
    });
    Alipw.Nonvisual = function () {
        var a = function (b) {
            this.config = b || (new Object());
            this.commitProperties(b);
            if (this.autoInit) {
                this.initialize()
            }
        };
        a.prototype = {
            autoInit: true,
            initialized: false,
            enabled: true,
            listeners: null,
            commitProperties: function () {
                Alipw.apply(this, this.config)
            },
            initialize: function () {
                this.evtProxy = jQuery(new Object());
                this.initialized = true;
                if (this.listeners) {
                    for (var b in this.listeners) {
                        if (this.listeners[b] instanceof Function) {
                            this.addEventListener(b, this.listeners[b], this)
                        }
                    }
                }
            },
            addEventListener: function (d, c, b) {
                Alipw.EventManager.addListener(this, d, c, b, false)
            },
            removeEventListener: function (c, b) {
                Alipw.EventManager.removeListener(this, c, b, false)
            },
            fireEvent: function (b, c) {
                return Alipw.EventManager.fireEvent(this, b, c, false, false)
            },
            regEvents: function (b) { },
            update: function () { },
            destroy: function () {
                this.fireEvent("destroy")
            },
            enable: function () {
                this.enabled = true
            },
            disable: function () {
                this.enabled = false
            }
        };
        return a
    } ();
    Alipw.WinProxy = function () {
        var a = new Alipw.Nonvisual({
            autoInit: false
        });
        return a
    } ();
    Alipw.Template = Alipw.extend(Alipw.Nonvisual, {
        constructor: function () {
            Alipw.Template.superclass.constructor.apply(this, arguments)
        },
        commitProperties: function () {
            Alipw.Template.superclass.commitProperties.apply(this, arguments);
            if (typeof (this.config) == "string") {
                this.html = this.config
            } else {
                if (this.config instanceof Array) {
                    this.html = this.config.join("")
                }
            }
        },
        initialize: function () {
            Alipw.Template.superclass.initialize.apply(this, arguments)
        },
        set: function (c) {
            for (var a in c) {
                var b = new RegExp("\\{\\$" + a + "\\}", "g");
                this.html = this.html.replace(b, c[a])
            }
            return this
        },
        compile: function () {
            this.el = jQuery(this.html);
            return this.el
        }
    });
    Alipw.Module = Alipw.extend(Alipw.Component, {
        template: "",
        templateUrl: "",
        scripts: null,
        scriptUrls: null,
        loadingCls: "",
        commitProperties: function () {
            Alipw.Module.superclass.commitProperties.apply(this, arguments)
        },
        initialize: function () {
            Alipw.Module.superclass.initialize.apply(this, arguments);
            if (!this.scripts) {
                this.scripts = new Array()
            }
            if (!this.scriptUrls) {
                this.scriptUrls = new Array()
            }
            this.context = new Object();
            this.__componentMgr = new Array()
        },
        createDom: function () {
            Alipw.Module.superclass.createDom.apply(this, arguments)
        },
        renderComplete: function () {
            Alipw.Module.superclass.renderComplete.apply(this, arguments)
        },
        destroy: function () {
            for (var b = 0, a = this.__componentMgr.length; b < a; b++) {
                this.__componentMgr[b].destroy()
            }
            Alipw.Module.superclass.destroy.apply(this, arguments)
        },
        addScript: function (a) {
            this.scripts.push(a)
        },
        load: function (b) {
            this.fireEvent("beforeModuleLoad", {}, false);
            if (this.loadingCls) {
                this.el.addClass(this.loadingCls)
            }
            this.el.empty();
            for (var c = 0, a = this.scripts.length; c < a; c++) {
                if (this.scripts[c].__Alipw_needToReload) {
                    this.scripts.splice(c, 1);
                    a = this.scripts.length;
                    c--
                }
            }
            if (this.templateUrl) {
                this.loadTemplate_Module(b)
            } else {
                this.loadScripts_Module()
            }
        },
        create: function (c, b) {
            var a;
            if (c) {
                a = new c(b);
                this.__componentMgr.push(a)
            }
            return a
        },
        loadTemplate_Module: function (a) {
            var e = this;
            if (!a) {
                a = new Object()
            }
            var b = a.url || this.templateUrl;
            var d = a.method || "GET";
            var c = a.params;
            jQuery.ajax({
                url: b,
                type: d,
                data: c,
                success: function (f) {
                    e.template = f;
                    e.loadScripts_Module()
                }
            })
        },
        loadScripts_Module: function () {
            if (this.destroyed) {
                return
            }
            var d = this;
            var a = this.scriptUrls.length;
            var b = 0;
            var c = function () {
                if (d.destroyed) {
                    return
                }
                var e = Alipw.loadScript({
                    url: d.scriptUrls[b],
                    success: function () {
                        if (Alipw.Module.__moduleScriptFn instanceof Function) {
                            d.addScript(Alipw.Module.__moduleScriptFn);
                            Alipw.Module.__moduleScriptFn = null
                        }
                        b++;
                        if (b >= a) {
                            d.renderContent_Module()
                        } else {
                            c()
                        }
                    }
                });
                d.addEventListener("destroy", function () {
                    jQuery(e).remove()
                })
            };
            if (a > 0) {
                c()
            } else {
                this.renderContent_Module()
            }
        },
        renderContent_Module: function () {
            if (this.destroyed) {
                return
            }
            if (this.loadingCls) {
                this.el.removeClass(this.loadingCls)
            }
            this.fireEvent("moduleLoaded", {}, false);
            if (this.template) {
                this.el.append(jQuery(this.template))
            }
            for (var b = 0, a = this.scripts.length; b < a; b++) {
                if (this.destroyed) {
                    return
                }
                this.scripts[b].call(this)
            }
            this.fireEvent("moduleRendered", {}, false)
        }
    });
    Alipw.ClassManager.loadingAdapter = function (classesToLoad, classRequires) {
        var allRequires = new Object();
        var classQueue = new Array();
        queue.apply(null, classesToLoad);
        getAllRequires.apply(null, classesToLoad);
        for (var i = 0, len = classQueue.length; i < len; i++) {
            Alipw.ClassManager.setStatus(classQueue[i], 'loaded');
            Alipw.ClassManager.classComplete(classQueue[i]);
        }
        //load global complete interface
        if (Alipw.ClassManager.getStatus() == "complete") {
            Alipw.ClassManager.complete();
        }
        function getAllRequires() {
            var pendingClasses = arguments;
            for (var i = 0, len = pendingClasses.length; i < len; i++) {
                if (allRequires[pendingClasses[i]]) {
                    continue;
                }

                var requires = classRequires[pendingClasses[i]];
                if (requires instanceof Array) {
                    getAllRequires.apply(null, requires);
                }
                allRequires[pendingClasses[i]] = true;
            }
        };
        function queue() {
            var pendingClasses = arguments;
            for (var i = 0, len = pendingClasses.length; i < len; i++) {
                if (Alipw.ClassManager.getStatus(pendingClasses[i])) {
                    continue;
                }
                var requires = classRequires[pendingClasses[i]];
                if (requires instanceof Array) {
                    queue.apply(null, requires);
                }

                //set class pending status
                Alipw.ClassManager.setStatus(pendingClasses[i], 'pending');
                classQueue.push(pendingClasses[i]);
            }
        }
    };
    module.exports = Alipw;
})
