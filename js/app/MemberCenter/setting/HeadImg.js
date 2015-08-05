define(['js/lib/jquery.uploadify/jquery.uploadify.v2.1.4.js', 'layer'], function (require, exports, moudles) {

    require('js/lib/jquery.uploadify/jquery.uploadify.v2.1.4.js');

    var sourcePic2Url = $('#HeadImgSrc').val();
    var token = $('#uploadToken').val();
    $('.toolbar li:eq(0)').addClass('cur');
    var initFlash = function (oldImg) {
        $('#swfDiv').uploadify({
            'uploader': "/Static/swf/uploadify.swf",
            'token': token,
            'auto': true,
            'fileExt': '*.jpg;*.png;*.jpeg',
            'fileDesc': '图片文件(jpg/jpeg/png)',
            'multi': false,
            'tbName': 'avatar',
            'maxLength': 2560,
            'queueID': 'upload_queue',
            'width': 720,
            'height': 500,
            'fileDataName': 'file',
            'sizeLimit': 2 * 1024 * 1024,
            'queueSizeLimit': 20,
            'oldImg': oldImg,
            onCompressError: function(event, data) {
                alert('[' + data.fileName + ']文件格式错误，图片处理失败。');
            },
            onQueueFull: function(event, queueSizeLimit) {
                alert('最多一次只能上传' + queueSizeLimit + '张照片，超过限制的照片会被取消上传。');
                return false;
            },
            onError: function(event, ID, fileObj, error) {
                if (error.info == '500') error.info = '服务器产生异常，请检查文件格式及大小，重新再尝试。';
                if (error.type == 'File Size') error.info = '文件过大，请压缩后再上传。';
                alert(error.info);
                return false;
            },
            onComplete: function(event, ID, fileObj, response, data) {
                $.getJSON('/MemberCenter/Setting/ashx/UploadHeadImg.ashx', { key: fileObj.keyName }, function (jsonData) {
                    console.log(response);
                    if (jsonData.success) {
                     top.   $('#avatar_img').attr('src', jsonData.HeadPath);
                    }
                   top. layer.close(top.window.layIndex);
                });

            }
        });
    };
    initFlash(sourcePic2Url);
});