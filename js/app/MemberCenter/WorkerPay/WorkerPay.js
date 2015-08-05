define(['js/common/mcifreamVerify/mcpricePageCommon'], function (require, exports, module) {
    //全局变量用于识别是否刷新页面
    window.useReload = false;
    var layerObj, toolObj, changeUrl = false,
    actionurl = '/MemberCenter/WorkersPay/ashx/WorkerPay.ashx';
    var workerPayType = $('#WorkerPayType').val();
    var workerType = $('#WorkerType').val();
    var workerPayMold = $('#WorkerPayMold').val();
    var yhType = $('#YhType').val();
    require.async(['layerExt', 'tools'], function (obj, obj1) {
        layerObj = obj;
        toolObj = obj1;
        var isWorkerPayMoldZero = workerPayMold === '0';
        if ((isWorkerPayMoldZero || (workerPayMold === '1' && yhType === '0')) && $('.case-list .item')[0]) {
            var cookieKey = isWorkerPayMoldZero ? 'WorkerPayMoldZero' : 'WorkerPayMoldOne' + workerPayType;
            var cookieValue = toolObj.cookieHelp.GetCookie(cookieKey);
            if (!cookieValue) {
                var para = !isWorkerPayMoldZero ? {
                    YhType: '1'
                } : null;
                var action = isWorkerPayMoldZero ? 'hasAfterProcessing' : 'HasMemberPrice';
                var msg = isWorkerPayMoldZero ? '您已经添加了染色工缴,建议您同时也添加后处理染厂费用' : '您已经添加了印花报价,建议你同时添加缩率及损耗';
                sendRequest(action, '', function (data) {
                    if (!data.Success) {
                        layer.alert(msg, {
                    });
                }
                toolObj.cookieHelp.SetCookie(cookieKey, true);
            }, para);
        }
    }
});
var addworkpay = function (e) {
    var notnormal = e.data;
    if ((notnormal && yhType == '0') || (!notnormal && yhType == '1')) changeUrl = true;
    var afterProcessingType = $('#AfterProcessingType').val();
    var title = $('#addworkerpay').text();
    var layClose = function () {
        if (window.useReload) {
            if (!changeUrl)
                location.reload();
            else {
                changeUrl = false;
                location.href = toolObj.urlHelp.replacePara('YhType', yhType == '1' ? '0' : '1');
            }
        }
    };
    var layIndex = $.layer({
        type: 2,
        title: title,
        shadeClose: false,
        fix: false,
        shift: 'top',
        area: ['912px', 730],
        iframe: {
            src: '/MemberCenter/WorkersPay/AddWorkerPay.aspx?AfterProcessingType=' + afterProcessingType + '&WorkerPayType=' + workerPayType + '&WorkerPayMold=' + workerPayMold + (notnormal ? '&YhType=1' : '') + '&WorkerType=' + workerType,
            scrolling: 'no'
        }, close: layClose
    });
    window.colselayer = function () {
        layerObj.close(layIndex);
        layClose();
    }
};
$('#addworkerpay').click(addworkpay);
$('#addyhsl').click(true, addworkpay);
var sendRequest = function (action, sysid, fn, para) {
    para = $.extend({
        action: action,
        sysid: sysid,
        WorkerPayType: workerPayType,
        WorkerPayMold: workerPayMold,
        YhType: yhType
    }, para);
    $.getJSON(actionurl, para, fn);
}
$('.bathbtn a').click(function () {
    layerObj.confirm('确认删除所有自定义价格信息么', function () {
        sendRequest('bathDelete', '', function (data) {
            if (data.Success) {
                location.reload();
            }
        });
    });
});



var mcpricePageCommon = require('js/common/mcifreamVerify/mcpricePageCommon');

mcpricePageCommon(sendRequest);
});