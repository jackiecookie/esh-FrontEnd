define(function (require, exports, module) {
    require('smartFocus');
    var $ = require('jquery'),
    fileUpload = require('js/common/UpLoad/UpLoadJs'); 
    require('smartFocus');
    $(function () {
        $("#txtImgPath").smartFocus('可以点击“本地上传”按钮或者在此文本框内输入http://"图片地址" 搜索');
        $('#btnSearchImg').click(function () {
            var imgPath = $("#txtImgPath").val();
            $("#upLoadDiv").html("搜索中...");
            location.href = "/UIDesign/searchresult?urlPath=" + imgPath;
            $("#txtImgPath").val("");
        });
    });
    var upload = function () {
        var upLoadObj = fileUpload({
            target: $('#imgUpload'),
            uploadURI: '/UIDesign/ashx/UploadSeachImg.ashx'
        });
        upLoadObj.on('onprogresstart', function () {
            $("#upLoadDiv").html("搜索中...");
        });
        upLoadObj.on('onprogresed', function (data) {
            var imgPath = data.json.filepath;
            location.href = "/UIDesign/searchresult?imgPath=" + imgPath; 
        });
    };
    upload();

});