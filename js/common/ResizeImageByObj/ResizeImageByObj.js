/*
    压缩图片显
*/
define([],function (require, exports, module) {
    var resizeImageByObj = function (imageobj, w, h,callBack) {
        var jqImageObj = $(imageobj);
        var objWidth = jqImageObj.width(), objHeight = jqImageObj.height();
        if (jqImageObj) {
            if (objWidth > 0 && objHeight > 0) {
                //比较纵横比  
                if (objWidth / objHeight >= w / h) //相对显示框：宽>高  
                {
                    if (objWidth > w) //宽度大于显示框宽度W，应压缩高度  
                    {
                        jqImageObj.width(w);
                        jqImageObj.height((objHeight * w) / objWidth);
                    } else //宽度少于或等于显示框宽度W，图片完全显示  
                    {
                        jqImageObj.width(objWidth);
                        jqImageObj.height(objHeight);
                    }
                } else //同理  
                {
                    if (objHeight > h) {
                        jqImageObj.height(h);
                        jqImageObj.width((objWidth * h) / objHeight);
                    } else {
                        jqImageObj.width(image.width);
                        jqImageObj.height(image.height);
                    }
                }
            }
            if (callBack) callBack();

        }
    };
    exports.resizeImageByObj=resizeImageByObj;
});

