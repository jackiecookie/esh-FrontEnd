define(['btnLoading', 'layer'], function (require, exports, module) {
    //如果没有当前选中的条件就在全部加cur
    (function () {
        var curObj = $('#filterList a.cur');
        if (curObj.length == 0) {
            $('#qba').addClass('cur');
        }
    })();
    var ashxUrl = '/MemberCenter/DataPlatformList/ashx/MCDataPlatform.ashx';
    var mctype = $('#mctype').val();
    var layer = require('layer');
    var btnLoading = require('btnLoading');
    $('#myData').addClass('cur');
    //修改名称
    $('.bd .edit').live('click', function () {
        var self = $(this);
        var toplink = self.prev('.toplink');
        var text = toplink.text();
        toplink.parent().addClass('hidden');
        self.parent().next().removeClass('hidden').find('.txt').val(text);
    });
    //保存名称
    $('.bd .btn-edit').live('click', function () {
        var self = $(this);
        var txtinput = self.prev('.txt');
        var text = txtinput.val();
        if (text.length > 50) {
            alert('名字过长');
            return false;
        }
        txtinput.parent().addClass('hidden');
        self.parent().prev().removeClass('hidden').find('.toplink').text(text);
        var sysId = self.parents('.info').attr('attr-id');
        $.getJSON(ashxUrl, { action: 'editSearchName', sysId: sysId, name: text });
    });
    //删除
    $('.bd .j-plan-del').live('click', function () {
        var self = $(this);
        var sysId = self.parents('.info').attr('attr-id');
        var delaction = mctype == 1 ? 'delSearch' : 'delSubscrib';
        var index = layer.confirm('确定删除么', function () {
            layer.close(index);
            var isloading = btnLoading({
                obj: self,
                addClass: "disabled"
            });
            if (isloading) {
                $.getJSON(ashxUrl, { action: delaction, sysId: sysId }, function (d) {
                    if (d.Success)
                        location.reload();
                    //  self.parents('.item').remove();
                    else {
                        btnLoading.reset(self);
                    }
                });
            }
        });

    });



});