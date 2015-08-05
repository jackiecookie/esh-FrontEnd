define(['alertify', 'js/common/cssSelect/cssSelect', 'js/common/UpLoad/UpLoadJs', 'js/common/jqueryvalidate/jqueryvalidate', 'layer', 'btnLoading', 'jQueryAjax', 'js/common/DataMapping/DataMapping'], function (require, exports, module) {
    require('js/common/cssSelect/cssSelect');
    var ZDK = require('js/common/procopy/procopy');
    ZDK.btnLoading = require('btnLoading');
    ZDK.upload = require('js/common/UpLoad/UpLoadJs');
    require('js/common/jqueryvalidate/jqueryvalidate');
    require('layer');
    var alertify = require('alertify');
    var dataMapping = require('js/common/DataMapping/DataMapping').DataBindings,
    createParam = require('jQueryAjax').createParam,
    MemberFlower = {
        submiting: 0,
        //保存花型信息方法
        InitFlower: function () {
            var self = this;
            //加载花型关键字
            this.initKeyWordFlowers();
            //加载花型类型信息
            this.initFlowerType();
            //加载上传附件信息
            this.initFileUpload();
            this.initDetail();
            //注册验证信息
            this.on('beforesubmit', function (evt) {
                return self.VerificationSaveMemberFlower();
            });
            //通过验证，提交数据 
            this.addFormEvent($('#memberFlowerInfoForm'), $('#savebtn'));
            //保存并发布
            this.addFormEventSaveAndPub($('#memberFlowerInfoForm'), $('#submitform1'));
            //alert('aaa');
        },
        startSubmit: function (btn) {
            this.submiting = 1;
            ZDK.btnLoading({
                obj: btn,
                addClass: "disabled"
            });
        },
        endSubmit: function (btn) {
            this.submiting = 0;
            btn.removeClass('disabled');
            ZDK.btnLoading.reset(btn);
        },
        addFormEvent: function (formObj, btnObj, evt) {
            var self = this;
            btnObj.on('click', doSubmit);
            function doSubmit(evt) {
                if (evt && evt.preventDefault)
                    evt.preventDefault();
                if (self.submiting == 1) {
                    return false;
                };

                $('#IS_CHECK').val('3');
                $('.fc-0 span.mtip-error').remove();
                $('.fc-0 span.mtip-right').remove();
                var rs = self.trigger('beforesubmit', [], 1);
                for (var i = 0; i < rs.length; i++) {
                    if (typeof rs[i] != 'undefined' && rs[i] === false) {
                        self.endSubmit(btnObj);
                        return false;
                    };
                };
                var keyid = $('#sysnumber').val();
                var action = $('#savebtn').attr('ispostback');
                self.startSubmit(btnObj);
                $.ajaxjson("/Member/ashx/MemberDesign/GetMemberFlowerHandler.ashx", createParam(action, keyid, 'memberFlowerInfoForm'), function (d) {
                    msg.ok("保存成功");
                    self.endSubmit(btnObj);
                    //webesh.loaded();
                    if (action == 'add') {
                        $('#submitform1').attr('ispostback', 'edit');
                        $('#savebtn').attr('ispostback', 'edit');
                        var data = eval(d);
                        if (data) {
                            var keyWord = data.KEYWORD.split(';');  //加载keyword
                            for (var i = 0; i < keyWord.length; i++) {
                                $(':checkbox[text=' + keyWord[i] + ']').attr('checked', 'checked');
                            }
                            if (data.KEYWORD) {
                                $('#keyword').text('');
                                $('#keyword').text(data.KEYWORD);
                            }
                            else {
                                $('#keyword').text('');
                                $('#keyword').text('单击选择关键字');
                            }
                            $('#headimg').attr('src', data.FILE_PATH);
                            $(':input[value=' + data.FLOWER_TYPE_ID + ']').attr('checked', 'checked');
                            $("#fsUploadProgress").attr('value', data.FILE_PATH);    //用于检测图片是否已经上传
                            dataMapping(data, '#memberFlowerInfoForm');

                        }
                    }
                }, { Message: "正在保存,请稍后...", LoadingType: 2 });
            };
        },
        addFormEventSaveAndPub: function (formObj, btnObj, evt) {
            var self = this;

            btnObj.on('click', doSubmit);
            function doSubmit(evt) {

                if (evt && evt.preventDefault)
                    evt.preventDefault();
                if (self.submiting == 1) {
                    return false;
                };


                $('#IS_CHECK').val('0');
                $('.fc-0 span.mtip-error').remove();
                $('.fc-0 span.mtip-right').remove();
                var rs = self.trigger('beforesubmit', [], 1);
                for (var i = 0; i < rs.length; i++) {
                    if (typeof rs[i] != 'undefined' && rs[i] === false) {
                        self.endSubmit(btnObj);
                        return false;
                    };
                };
                var keyid = $('#sysnumber').val();
                var action = $('#savebtn').attr('ispostback');
                alertify.confirm("一旦保存并发布,将进入审核状态,该产品将无法修改,是否确认提交", function (e) {
                    if (!e) return false;
                    self.startSubmit(btnObj);
                    $.ajaxjson("/Member/ashx/MemberDesign/GetMemberFlowerHandler.ashx", createParam(action, keyid, 'memberFlowerInfoForm'), function (d) {
                        self.endSubmit(btnObj);
                        msg.ok("保存成功");
                        //webesh.loaded();
                        if (action == 'add') {
                            $('#submitform1').attr('ispostback', 'edit');
                            $('#savebtn').attr('ispostback', 'edit');
                            var data = eval(d);
                            if (data) {
                                var keyWord = data.KEYWORD.split(';');  //加载keyword
                                for (var i = 0; i < keyWord.length; i++) {
                                    $(':checkbox[text=' + keyWord[i] + ']').attr('checked', 'checked');
                                }
                                if (data.KEYWORD) {
                                    $('#keyword').text('');
                                    $('#keyword').text(data.KEYWORD);
                                }
                                else {
                                    $('#keyword').text('');
                                    $('#keyword').text('单击选择关键字');
                                }
                                $('#headimg').attr('src', data.FILE_PATH);
                                $(':input[value=' + data.FLOWER_TYPE_ID + ']').attr('checked', 'checked');
                                $("#fsUploadProgress").attr('value', data.FILE_PATH);    //用于检测图片是否已经上传
                                dataMapping(data, '#memberFlowerInfoForm');
                            }
                        }
                    }, { Message: "正在保存,请稍后...", LoadingType: 2 });
                });
            };
        },
        VerificationSaveMemberFlower: function () {
            var self = this;
            var vaildate = $('.nEmpty').validate({
                errorClass: "mtip-error",
                errorElement: "span"
            });
            var nEmpty = $('.nEmpty');
            for (var i = 0; i < nEmpty.length; i++) {
                var len = $(nEmpty[i]);
                if (!len.val()) {
                    vaildate.errorList.push({
                        message: '此项不能为空',
                        element: len
                    });
                }
            }
            //如果有错误显示错误
            if (vaildate.errorList.length > 0) {
                vaildate.defaultShowErrors();
                vaildate.errorList = [];
                return false;
            } else {

            }
        },
        //初始化上传附件方法
        initFileUpload: function () {
            //  if ($('#savebtn').length === 0)return;
            var uploadCache = {};
            var progress = $('#make-filelist');
            var btn = $('#btnUpload');
            var extraInfoLoading = $('#extraInfoLoading');
            var extraInfoUpload = ZDK.upload({
                target: btn,
                uploadURI: '/Member/ashx/MemberDesign/UpLoadFlowerHandler.ashx?type=FlowerLibrary',
                progressURI: '/UITask/ashx/Demand/progressUpLoadFile.ashx',
                fileExt: '.jpg,.bmp,.png,.gif',
                file_size_limit: true,
                checkExt: true
            });
            extraInfoUpload.on('onprogresreading', function (data) {
                if (!uploadCache[data.progress]) {
                    var li = $('<li class="clearfix" data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl">' + data.name + '</span><a href="javascript:;"  action-type="cancel">删除</a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p><a href="javascript:;" class="fr" action-type="cancel">取消</a></div></li>').appendTo(extraInfoLoading);
                    uploadCache[data.progress] = li;
                }
                window.console && console.log('up_start', data);
                flag = false;
            });
            extraInfoUpload.on('onprogresing', function (data) {

                var cac = uploadCache[data.progress];
                var c = ((data.uploaded / data.total) * 100).toFixed(2) + '%';
                cac.find('p.fl').html('上传' + c);
                cac.find('p.adifile span').css('width', c);

                flag = false;
            });
            extraInfoUpload.on('onprogresed', function (data) {
                var cac = uploadCache[data.progress];
                var pli = progress.find('li');
                if (pli && pli.length && pli.length > 1) {
                    $(pli[0]).remove();
                }

                var imgArr = data.url.split('|');

                cac.find('p.fl').html('上传成功!');
                cac.find('p.adifile span').css('width', '100%');
                cac.find('div').hide();
                cac.addClass("tsuc");
                cac.find('p.file a').attr("del-val", data.url);
                cac.find('p.file .fl').html('<img src="' + imgArr[2] + '" style="width: 100px; height:100px" >');
                $('#extraInfoUploadInput').val(imgArr[2]);
                $("#iptFileSize").val(imgArr[4]);
                flag = true;

            });
            extraInfoUpload.on('onprogresreadqueue', function (data) {
                if (!uploadCache[data.progress]) {
                    var li = $('<li data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl uploadfilename">' + data.name + '</span><a href="javascript:;" style="display:none;" action-type="del" class="aDel">删除</a>s</p><div class="adding clearfix"><p class="adifile"><span style="width:0%"><a href="javascript:;" style="display:none;" action-type="del">删除</a></span></p><p class="fl">正在上传中....</p><a href="javascript:;" class="fr" action-type="cancel">取消</a></div></li>').appendTo(progress);
                    // var li = $('<li class="clearfix" data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl">' + data.name + '</span><a href="javascript:;" style="display:none;" action-type="del">删除</a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p><a href="javascript:;" class="fr" action-type="cancel">取消</a></div></li>').appendTo(progress);
                    uploadCache[data.progress] = li;
                }
                window.console && console.log('up end', data);
                flag = false;
                //上传失败，出现错误的时候回调
            });
            extraInfoUpload.on('onprogresserror', function (data, cac) {
                if (cac = uploadCache[data.progress]) {
                    cac.find('p.fl').html('上传失败').css('color', 'red');
                }
                flag = false;
                //取消上传的时候回调
            });
            extraInfoUpload.on('oncancelupload', function () {
            });

            function delcancel(li, e) {
                var key = li.attr("data-pid");
                extraInfoUpload.onCancelUpload(key);
                li.remove();
                if (!key) {
                    key = li.find('a').attr('del-val');
                    insertDeletInput(key);
                }
                //   delete self.extraInfoUploadData[key];
                $('#extraInfoUploadInput').val('');
                editDel();
                if (!e) return false;
            };
            extraInfoLoading.delegate("a", "click", function (e) {
                if ($(this).attr("action-type") == "cancel") {
                    e.preventDefault();
                    e.stopPropagation();
                    delcancel($(this).parents("li"), $(this));
                }
            });

            function insertDeletInput(key) {
                var delfilesInput = $('#delfiles');
                var delfileVal = delfilesInput.val();
                if (delfileVal) {
                    delfilesInput.val(delfileVal + ',' + key);
                } else {
                    delfilesInput.val(key);
                }
            }
        },
        //初始化花型关键字信息
        initKeyWordFlowers: function () {
            var SelectGJZ = function (t) {
                //  $dialog = this;
                var mykeyword = '';
                var mykeywordsys = '';
                var ck = $('#keyworddiv :checked');
                for (var i = 0; i < ck.length; i++) {
                    var item = $(ck[i]).attr('text');
                    mykeyword += item + ";";
                    var item = $(ck[i]).val();
                    mykeywordsys += item + ";";
                }
                if (mykeyword) {
                    $('#keyword').text('');
                    $('#keyword').text(mykeyword);
                }
                else {
                    $('#keyword').text('');
                    $('#keyword').text('单击选择关键字');
                }
                if (mykeywordsys) {
                    $('#keyWordId').val(mykeywordsys);
                }
                //       $dialog.destroy();
                layer.close(t);
            };
            $('#keyword').click(function () {
                $.layer({
                    type: 1,
                    fix: true,
                    title: "关键字选择",
                    btns: 2,
                    btn: ['确定', '关闭'],
                    area: ['auto', '500px'],
                    domCloseType: 2,
                    page: { dom: '#dialog-GJZ' },
                    yes: SelectGJZ
                });

                var keyWord = $('#keyWordId').val().split(';');  //加载keyword
                for (var i = 0; i < keyWord.length; i++) {
                    $('input[name="chkGZJ"]').each(function () {
                        if ($(this).val() == keyWord[i]) {
                            $(this).attr("checked", "checked");
                        }
                    });
                }
            });
        },
        //初始化花型类型信息
        initFlowerType: function () {
            $("#srcTypeDiv").MultiCssSelect({
                url: '/Member/ashx/MemberDesign/GetFlowerTypeHandler.ashx',
                DivElment: $('#srcTypeDiv'),
                initName: "选择",
                onClick: function (node) {
                    var $node = $(node);
                    var val = $node.text();
                    if (val != '全部') {
                        $('#FLOWERTYPE_NAME').val(val);
                        $('[name=Flowertype_sysnumberAndFnumber]').val($node.find('span').attr('node-id'));
                    } else {
                        $('#FLOWERTYPE_NAME').val('');
                    }

                },
                onLoadSuccess: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].children.length) {
                            $('body').append('<input type="hidden" name="treeNode" value=' + data[i].text + '>');
                        }
                    }
                }
            });
        },
        //编辑花型详情信息
        initDetail: function () {
            var sys = $('#sysnumber').val();
            if (sys && $('#savebtn').attr('ispostback') == 'edit') {
                $.ajaxjson('/Member/ashx/MemberDesign/GetMemberFlowerHandler.ashx', createParam('detail', sys, 'form1'), function (data) {
                    if (data) {
                        var keyWord = data.KEYWORD.split(';'); //加载keyword
                        for (var i = 0; i < keyWord.length; i++) {
                            $(':checkbox[text=' + keyWord[i] + ']').attr('checked', 'checked');
                        }
                        if (data.KEYWORD) {
                            $('#keyword').text('');
                            $('#keyword').text(data.KEYWORD);
                        } else {
                            $('#keyword').text('');
                            $('#keyword').text('单击选择关键字');
                        }
                        $("#extraInfoLoading").css({
                            visibility: 'hidden'
                        }).append('<li class="clearfix tsuc"><p class="file clearfix"><span class="fl" ><img src="' + data.FILE_PATH + '" onload="ResizeImageByObj(this, 100, 100,imgonLoadCallBack)"></span>   <a href="javascript:;" action-type="cancel" onclick="editDel()">删除</a></p></li>');
                        $(':input[value=' + data.FLOWER_TYPE_ID + ']').attr('checked', 'checked');
                        $('#srcTypeDiv .selectLt').text(data.FLOWERTYPE_NAME);
                        dataMapping(data, '#memberFlowerInfoForm');
                        var appndMsg = function (appendMsg) {
                            $('.aliyun-form-wrap').prepend('<p class="toptips" style="padding-left: 45px;">' + appendMsg + '</p>');
                        }
                        if (data.IS_CHECK == 1 || data.IS_CHECK == 0 || data.IS_CHECK == 4) {
                            var msg = data.IS_CHECK == 0 ? '进入审核状态的花型无法修改' : '已经审核通过的花型无法修改';
                            appndMsg(msg);
                            $('#btnUpload .ui-upload-btn').remove();
                            $('#savebtn').remove();
                            $('#submitform1').remove();
                        } else {
                            if (data.IS_CHECK == 2)
                                appndMsg('抱歉,您没审核通过的理由为:' + data.REASON);
                            $('#savebtn').removeClass('hide');
                            $('#submitform1').removeClass('hide');
                        }
                    }
                }, { Message: "正在获取数据", LoadingType: 2, IsShowLoading: true });
            } else {
                $('#savebtn').removeClass('hide');
                $('#submitform1').removeClass('hide');
            }
        }
    };
    $.extend(MemberFlower, ZDK.EventEmitter.prototype);
    $(function () {
        MemberFlower.InitFlower();
    });
    exports.imgonLoadCallBack = function () {
        $("#extraInfoLoading").css({
            visibility: ''
        });
    };
    exports.editDel = function () {
        $('#extraInfoUploadInput').val('');
    };
})


