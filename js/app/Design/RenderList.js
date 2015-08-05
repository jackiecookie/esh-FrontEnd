define(function (require, exports, module) {
require("js/common/fancybox/jquery.fancybox-1.3.4.pack");
var RenderList = {
    count: 1,
    currentId: null,
    currentJobState: null,
    actionUrl: '/UIDesign/ashx/GetRenderDetail.ashx?t=',
    Init: function () {
        var me = RenderList;
        var id = $('#cid').val();
        if (id) {
            me.currentId = id;
            $('[jobid=' + me.currentId + ']', '.randerListul').parent().addClass('choes');
            me.GetDetail(id, me.GetDetailCallBack);
            me.initClick();
            setInterval(me.GetDetail, 8000);
        }
    },
    GetDetail: function (id, callBack) {
        RenderList.count++;
        if (!id) {
            var me = RenderList;
            id = me.currentId;
            callBack = me.GetDetailCallBack;
        }
        $.getJSON(RenderList.actionUrl + new Date().getTime(), { id: id }, function (data) {
            if (callBack) {
                callBack(data);
            }
        });
    },
    targetAClick: function (target) {
        var me = RenderList;
        var clickA = $(target);
        var cid = clickA.attr('jobId');
        if (cid != me.currentId) {
            $('.randerListul li.choes').removeClass('choes');
            clickA.parent().addClass('choes');
            me.currentId = cid;
            me.currentJobState = null;
            me.GetDetail(cid, me.GetDetailCallBack);
        }
    },
    initClick: function () {
        var me = RenderList;
        $('.randerListul').click(function (even) {
            var target = even.target;
            if (target.tagName == "A") {
                //                var clickA = $(target);
                //                var cid = clickA.attr('jobId');
                //                if (cid != me.currentId) {
                //                    $('.randerListul li.choes').removeClass('choes');
                //                    clickA.parent().addClass('choes');
                //                    me.currentId = cid;
                //                    me.currentJobState = null;
                //                    me.GetDetail(cid, me.GetDetailCallBack);
                //                }
                me.targetAClick(target);
            } else if (target.tagName == "LI") {
                var _a = $(target).find('a');
                me.targetAClick(_a);
            }
        });
        $('#DelBtn').click(function () {
            var isconfirm = confirm('确认删除后无法恢复,确定删除么');
            if (!isconfirm) return;
            $.getJSON(me.actionUrl + new Date().getTime(), { id: me.currentId, action: 'del' }, function (data) {
                if (data && data.Success) {
                    window.location.reload();
                } else {
                    alert(data.Message);
                }
            });
        });
        $('#TJBtn').click(function () {
            var isconfirm = confirm('重新开始这个渲染么');
            if (!isconfirm) return;
            $.getJSON(me.actionUrl + new Date().getTime(), { id: me.currentId, action: 'tj' }, function (data) {
                if (data && data.Success) {
                    //window.location.reload();asd
                    me.currentJobState = null;
                    me.GetDetailCallBack($.parseJSON(data.Data));
                } else {
                    alert(data.Message);
                }
            });
        });
    },
    GetDetailCallBack: function (data) {
        var me = RenderList;
        if (data && data.JOB_ID == me.currentId && (!me.currentJobState || me.currentJobState != data.RENDER_STATUS)) {
            me.currentJobState = data.RENDER_STATUS;
            $('#senceName').text(data.NAME);
            $('#renderName').text(data.JOB_NAME);
            $('#renderType').text(me.GetRenderTypeStr(data.RENDER_TYPE));
            $('#renderQuality').text(me.GetRenderQuality(data.RENDER_GRADE));
            $('#randerMoney').text(data.RENDER_MONEY);
            $('#renderSize').text(data.IMAGE_WIDTH + "*" + data.IMAGE_HEIGHT);
            if (data.UPLOAD_TIME) $('#updateTime').text(data.UPLOAD_TIME);
            if (data.estimatetime) $('#estimated').text(data.estimatetime + '分钟');
            if (data.END_TIME) $('#endTime').text(data.END_TIME);
            me.ProRenderState(data.RENDER_STATUS, data.IMAGE_PATH, data.IMAGE_WIDTH, data.IMAGE_HEIGHT);
        }
    },
    GetRenderTypeStr: function (typeId) {
        var str = '';
        switch (typeId) {
            case 1: str = '草图'; break;
            case 2: str = '小图'; break;
            case 3: str = '中图'; break;
            case 4: str = '大图'; break;
            case 5: str = '全景图'; break;
        }
        return str;
    },
    GetRenderQuality: function (qualityId) {
        var str = '';
        switch (qualityId) {
            case 1: str = '低'; break;
            case 2: str = '中'; break;
            case 3: str = '高'; break;
        }
        return str;
    },
    ProRenderState: function (state, imgSrc, width, height) {
        var me = RenderList;
        var stateComm = null;
        var showLoadingImg = false;
        if (state == 6) {
            if (imgSrc) {
                stateComm = '渲染完成';
                me.ImgShow(imgSrc, width, height);
                me.SaveImgBtnIsShow(true, imgSrc);

            } else {
                stateComm = '渲染完成,等待获取原图片';
                me.ImgShow(false);
                me.SaveImgBtnIsShow(false);
            }
            me.ProTJBtn(false);
            me.ProDelBtn(true);

        }
        else if (state == 9) {
            stateComm = '余额不足';
            me.ProTJBtn(true);
            me.ProDelBtn(true);
            me.ImgShow(false);
            me.SaveImgBtnIsShow(false);
        } else if ( state == 7 || state == 8 || state == 10) {
            stateComm = '渲染失败';
            me.ProTJBtn(true);
            me.ProDelBtn(true);
            me.ImgShow(false);
            me.SaveImgBtnIsShow(false);
        }else if (state == 5) {
            stateComm = '正在上传图片';
            me.ProTJBtn(false);
            me.ProDelBtn(false);
            me.ImgShow(false);
            showLoadingImg = true;
            me.SaveImgBtnIsShow(false);
        } else if (state == 1 || state == 2 || state == 3) {
            stateComm = '等候渲染';
            me.ProTJBtn(false);
            me.ProDelBtn(false);
            me.ImgShow(false);
            me.SaveImgBtnIsShow(false);
        } else if (state == 4) {
            stateComm = '渲染中';
            me.ProTJBtn(false);
            me.ProDelBtn(false);
            me.ImgShow(false);
            showLoadingImg = true;
            me.SaveImgBtnIsShow(false);
        } else {
            stateComm = '未知状态';
            me.ProTJBtn(false);
            me.ProDelBtn(false);
            me.ImgShow(false);
            me.SaveImgBtnIsShow(false);
        }
        if (stateComm) {
            if (showLoadingImg) {
                //  $('#stateComm').show();
                $('#stateComm').html(stateComm + ' <img src="/Static/Images/DesignImg/0907091937c2de5203f3d445c9.gif" />');
            } else
                $('#stateComm').text(stateComm);
        }
    },
    ProTJBtn: function (isShow) {
        isShow ? $('#TJBtn').show() : $('#TJBtn').hide();
    },
    ProDelBtn: function (isShow) {
        isShow ? $('#DelBtn').show() : $('#DelBtn').hide();
    },
    ImgShow: function (imgSrc, width, height) {
        if (imgSrc) {
            var img = new Image();
            $(img).attr('src',  imgSrc);
            img.src =  imgSrc;
            img.width = width;
            img.height = height;
            ResizeImageByObj(img, 555, 237);

            $(img).attr("title", "原图");
            $('.pic-show').show().find('a').fancybox({
                'overlayShow': false,
                'transitionIn': 'elastic',
                'transitionOut': 'elastic'
                //                onComplete: function (e,l) {
                //                    var options3 =
                //            {
                //                zoomWidth: 200,
                //                zoomHeight: 200,
                //                xOffset: 20,
                //                title: false,
                //                lens: false
                //            };
                //            $("#fancybox-content img").jqzoom(options3);
                //                }
            }).attr('href', imgSrc).html(img);


        } else {
            $('.pic-show').hide();
            $('.pic-show a img').remove();
            // $('.pic-show img').attr('src', '');
        }
    },
    SaveImgBtnIsShow: function (isShow, imgPath) {
        if (isShow && imgPath) {
            $('#saveImg').show().attr('href', '/UIDesign/ashx/DowmLoadFile.ashx?file=' + imgPath);

        } else {
            $('#saveImg').hide();
        }
    }
};
$(function () {
    RenderList.Init();
});

function ResizeImageByObj(image, w, h) {
    //显示框宽度W,高度H   
    if (image.width > 0 && image.height > 0) {
        //比较纵横比  
        if (image.width / image.height >= w / h) //相对显示框：宽>高  
        {
            if (image.width > w) //宽度大于显示框宽度W，应压缩高度  
            {
                $(image).width(w);
                $(image).height((image.height * w) / image.width);
            } else //宽度少于或等于显示框宽度W，图片完全显示  
            {
                $(image).width(image.width);
                $(image).height(image.height);
            }
        } else //同理  
        {
            if (image.height > h) {
                $(image).height(h);
                $(image).width((image.width * h) / image.height);
            } else {
                $(image).width(image.width);
                $(image).height(image.height);
            }
        }
    }
}
});