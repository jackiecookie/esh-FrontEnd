define(['jqueryJson',  'layer'], function (require, exports, module) {
    require('jqueryJson');
    var layer = require('layer');
    $.ajaxjson = function (url, dataMap, fnSuccess, options) {
        var loadi;
        options = $.extend({}, $.ajaxjson.defaults, options || {});
        $.ajax({
            type: "POST",
            url: url,
            data: dataMap,
            dataType: "json",
            beforeSend: function () {
                if (options.IsShowLoading == true) {
                    loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
                   
                }
            },
            success: function (d) { layer.close(loadi); fnSuccess(d); },
            error: function (err) { layer.close(loadi); layer.alert(options.ErrorMsg, 8, !1);}
        });
    };
    $.ajaxjson.defaults = {
        Message: '正在加载中...', //正在操作中的显示文字  LoadingType为1时才有
        ErrorMsg: '系统繁忙，请联系网站客服帮您解决此问题！', //出错时显示的文字
        IsShowLoading: true, //是否显示正在加载 默认显示
        LoadingType: 1, //现在加载类型默认为1
        Isback: true//是否显示遮罩层
    };
    $.ajaxtext = function (url, dataMap, fnSuccess, options) {
        var loadi;
        options = $.extend({}, $.ajaxtext.defaults, options || {});
        $.ajax({
            type: "POST",
            url: url,
            data: dataMap,
            dataType: "text",
            beforeSend: function () {
                if (options.IsShowLoading == true) {
                    loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
//                    $.hLoading.show({ msg: options.Message, Isback: options.Isback, timeout: 10000000, loadingType: options.LoadingType });
                }
            },
            success: function (d) { layer.close(loadi); fnSuccess(d); },
            error: function (err) { layer.close(loadi); layer.alert(options.ErrorMsg, 8, !1); }
        });
    };

    $.ajaxtext.defaults = {
        Message: '正在加载中...', //正在操作中的显示文字  LoadingType为1时才有
        ErrorMsg: '系统繁忙，请稍后再试！', //出错时显示的文字
        IsShowLoading: true, //是否显示正在加载 默认显示
        LoadingType: 1, //现在加载类型默认为1
        Isback: true//是否显示遮罩层
    };


    //将form转为AJAX提交
    $.ajaxSubmit = function (url, frm, fnSuccess, options) {

        options = $.extend({}, $.ajaxSubmit.defaults, options || {});
        var loadi;
        $.ajax({
            type: "POST",
            url: url,
            data: convertArray($(frm).serializeAll()),
            dataType: "json",
            beforeSend: function () {
                if (options.IsShowLoading == true) {
                    loadi = $.layer({ type: 3, border: [0], bgcolor: '' });
//                    $.hLoading.show({ msg: options.Message, Isback: options.Isback, timeout: 10000000, loadingType: options.LoadingType });
                }
            },
            success: function (d) { layer.close(loadi); fnSuccess(d); },
            error: function (err) { layer.close(loadi); layer.alert(options.ErrorMsg, 8, !1); }
        });

    };
    $.ajaxSubmit.defaults = {
        Message: '正在加载中...', //正在操作中的显示文字  LoadingType为1时才有
        ErrorMsg: '系统繁忙，请稍后再试！', //出错时显示的文字
        IsShowLoading: true, //是否显示正在加载 默认显示
        LoadingType: 1, //现在加载类型默认为1
        Isback: true//是否显示遮罩层
    };
    function createParam(action, keyid, formid) {
        if (formid == undefined || formid == null) formid = "aspnetForm";
        var o = {};
        var form = $('#' + formid);
        var query = '';
        if (form) {
            query = $('#' + formid).serializeArray();
            query = convertArray(query);
            o.jsonEntity = $.toJSON(query);
        }
        o.action = action;
        o.keyid = keyid;
        return "json=" + encodeURIComponent($.toJSON(o));
    }
    function Param(action, keyid, formid) {
        if (formid == undefined || formid == null) formid = "aspnetForm";
        var o = {};
        var form = $('#' + formid);
        o.action = action;
        o.keyid = keyid;
        var json = "json=" + $.toJSON(o);
        if (form) {
            json += "&" + convertArray($('#' + formid).serializeArray());
        }
        return json;
    }
    function convertArray(o) {
        var v = {};
        for (var i in o) {
            if (o[i].name != '__VIEWSTATE') {
                if (typeof (v[o[i].name]) == 'undefined')
                    v[o[i].name] = o[i].value;
                else
                    v[o[i].name] += "," + o[i].value;
            }
        }
        return v;
    }

    $.fn.serializeAll = function() {
        //先将所有disabled去掉
        var disabled = new Array();
        $(':disabled[name]', this).each(function() {
            $(this).attr("disabled", false);
            disabled.push($(this));
        });

        var data = $(this).serializeArray();

        //从新将原有disabled属性的设置为disabled
        for (var i = 0; i < disabled.length; i++) {
            disabled[i].attr("disabled", true);
        }
        //    $(':disabled[name]', this).each(function () {
        //        data.push({ name: this.name, value: $(this).val() });
        //    });
        return data;
    };
    module.exports.createParam = createParam;
    module.exports.Param = Param;
    module.exports.convertArray = convertArray;
});


