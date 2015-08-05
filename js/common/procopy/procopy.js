define(function (require, exports, module) {
    var nocopy = 'constructor,@CLASSNAME,__proto__,',
       expando = '.ZDK' + guid,
    procopy = function (sbc) {
        var supers, POSING;
        if (arguments.length >= 2) {
            for (var len = arguments.length - 1; len > 0; len--) {
                supers = arguments[len];
                //添加对象是不能为空
                //  if (!supers)break;
                for (var p in supers.prototype) {
                    if (supers.prototype.hasOwnProperty(p) && nocopy.indexOf(p + ',') == -1) {
                        sbc.prototype[p] = supers.prototype[p];
                    }
                }
            }
        }
        return sbc;
    };
    var guid = +new Date,
        uuid = function () {
            return guid++;
        };
    var eventEmitter = function () { };
    eventEmitter.prototype = {
        addListener: function (type, handler, data) {
            (!this['#eventcache']) && (this['#eventcache'] = {});
            (!this['#eventcache'][type]) && (this['#eventcache'][type] = []);
            if (typeof handler === 'function') {
                this['#eventcache'][type].push({
                    type: type,
                    handler: handler,
                    guid: (handler[expando] = uuid()),
                    data: $.isPlainObject(data) ? data : {}
                });
            }
            return this;
        },
        on: function (type, handler, data) {
            var self = this;
            if (!jQuery.isArray(type)) {
                type = type.split(/,\s*/);
            }
            jQuery.each(type, function (key, val) {
                return self.addListener(val, handler, data);
            });
            return this;
        },
        removeListener: function (type, handler) {
            if (handler && this['#eventcache'][type]) {
                for (var len = this['#eventcache'][type].length - 1; len >= 0; len--) {
                    if (this['#eventcache'][type]['guid'] === handler[expando]) {
                        this['#eventcache'][type].splice(len, 1);
                    }
                }
            } else if (type) {
                this['#eventcache'][type] = [];
            }
        },
        trigger: function (type, data, isReturnAllResult) {
            var retValue, allResult = [];
            (!this['#eventcache']) && (this['#eventcache'] = {});
            if (type = this['#eventcache'][type]) {
                for (var len = type.length - 1; len >= 0; len--) {
                    retValue = type[len]['handler']($.extend({}, type[len]['data'], data));
                    allResult.push(retValue);
                }
            }
            return isReturnAllResult ? allResult : retValue;
        }
    };

    var eventDelegate = function () { };
    eventDelegate.prototype = {
        bindTarget: function (target, type) {
            var self = this;
            !this['@dataType'] && (this['@dataType'] = {});
            !this['@action'] && (this['@action'] = 'action-type');
            !this['@actionType'] && (this['@actionType'] = {})
            if (!this['@actionType'][type = type || 'click']) {
                target.bind(this['@actionType'][type] = type, function (e) {
                    self.eventDelegate(e);
                });
            }
        },
        eventDelegate: function (e) {
            var action, target = $(e.target);
            if (action = target.attr(this['@action'])) {
                this.trigger(e.type + ':' + action, this['@eventData'](target, e));
            }
        },
        '@eventData': function (target, event) {
            var data = [],
                d,
                i = 0,
                ret = {};
            for (var p in this['@dataType']) {
                if (d = target.attr(p)) {
                    data.push([p, d]);
                }
            }
            if (data.length) {
                while (d = data[i++]) {
                    ret[d[0]] = d[1];
                }
            }
            if (d = target.attr('action-data')) {
                d = d.split('&');
                while (i = d.pop()) {
                    if ((i = i.split('=')).length == 2) {
                        ret[i[0]] = i[1];
                    }
                }
            }
            ret['event'] = event;
            return ret;
        },
        bindData: function (type) {
            return this['@dataType'][type] = 1;
        },
        resetAction: function (type) {
            this['@action'] = type;
        }
    };
    var assert = function (fn) {
        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = '-1000px';
        document.body.appendChild(div);
        fn(div);
        document.body.removeChild(div);
    };
    var hash = function(hash) {
        var _hash = 16777619;
        for (var len = hash.length - 1; len >= 0; len--) {
            _hash ^= ((_hash << 5) + hash.charCodeAt(len) + (_hash >> 2));
        }
        return _hash & 0x7FFFFFFF;
    };
    var  mask=function () {
            var mask = $('<div class="ui-mask">' + '</div>').hide();
            var append = false;
            var num = 0;
            return function (zIndex, set) {
                if (set) {
                    return mask.css('z-index', set);
                }
                var uiMask = $(document.body).find(".ui-mask");
                if (uiMask.length) append = true;
                !append && mask.appendTo(document.body) && (append = true);
                if (typeof zIndex == 'boolean') {
                    mask.hide();
                    uiMask.hide();
                } else {
                    var body = $(document.body);
                    zIndex && mask.css('z-index', zIndex);
                    mask.show();
                    mask.css('height', body.outerHeight());
                    num++;
                }
            }
        }();
    module.exports.procopy = procopy;
    module.exports.uuid = uuid;
    module.exports.EventEmitter = eventEmitter;
    module.exports.EventDelegate = procopy(eventDelegate, eventEmitter);
    module.exports.assert = assert;
    module.exports.hash = hash;
    module.exports.mask = mask;
});