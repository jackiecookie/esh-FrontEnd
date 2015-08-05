define(function (require, exports, module) {
    require('smartFocus');
    var ZDK = require('js/common/procopy/procopy');
    ZDK.btnLoading = require('btnLoading');
    ZDK.verify = require('js/common/verify/verify');
    var alertify = require('alertify');
    var b = require('js/lib/handlebars/handlebars');
    require('js/common/webuploader/webuploader.min.js');
    var dataMapping = require('js/common/DataMapping/DataMapping').DataBindings,
        createParam = require('jQueryAjax').createParam,
        MemberFlower = {
            submiting: 0,
            //保存花型信息方法
            InitFlower: function () {
                var self = this;
                //添加文本框默认文字
                this.SmartFocus();
                //选择关键字
                this.KeyWordOnClick();
                //注册验证信息
                this.on('beforesubmit', function (evt) {
                    return self.VerificationSaveMemberFlower();
                });
                //通过验证，提交数据 
                this.addFormEvent($('#memberFlowerInfoForm'), $('#savebtn'));
                //保存并发布
                this.addFormEvent($('#memberFlowerInfoForm'), $('#submitform1'));
                this.keyUpVerify();
                this.UpLoadFile();
            },
            SmartFocus: function () {
                $("#txtNAME").smartFocus('请输入花型名称（必填）');
                $("#txtGGXH").smartFocus('请输入规格型号（必填）  例如：30x40');
                $("#txtPRICE").smartFocus('请输入交易价格（必填）');
                $("#txtDESCRIBE").smartFocus('请输入花型描述（选填）');
            },
            KeyWordOnClick: function () {
                $(".tag").on("click", ".j_tag",
                function () {
                    //checkInsert($(this).addClass("tied").find("span").prop("outerHTML"), $(this).find("span").attr("data-pkid"), $(this).parent().prev("span").prop("outerHTML"));
                    checkInsert($(this));
                }).on("click", ".j_deltag",
                function () { //移除关键字
                    var a = $(this).parent(),
                        b = a.find("span").text();
                    $tags = $(".main-bd .tag .ft .hot-tag");
                    for (var c = 0; c < $tags.length; c++) {
                        var d = $tags.eq(c).find("span").text();
                        if (b == d) {
                            $tags.eq(c).removeClass("tied"); //在关键字中呈现出来
                            break;
                        }
                    }
                    //移除已选择关键字Id
                    var id = $(this).prev().attr("data-pkid");
                    var ids = $("#hdKeyWords").val().split(',');
                    for (var i = 0; i < ids.length; i++) {
                        if (id == ids[i]) {
                            ids.splice(jQuery.inArray(id, ids), 1);
                        }
                    }
                    $("#hdKeyWords").val(ids.toString());
                    //移除关键字分类Div
                    var parentdiv = a.parent();
                    if ($(parentdiv).children().length == 2) {
                        $(parentdiv).parent().remove();
                    } else {
                        a.remove();  //从已选择关键字中移除
                    }
                });
                //选择的关键字添加到文本框中
                function checkInsert(kwNode) {
                    var parentId = kwNode.parent().prev("span").attr("data-pkid");
                    var isFirst = true;
                    var clearDiv = $('<div class="clear"></div>');
                    //判断关键字分类是否已存在 
                    $("#hcldiv").children().each(function (index, item) {
                        var pkId = $(item).attr("id");
                        if (parentId == pkId) {
                            //关键字字节点
                            var a = kwNode.addClass("tied").find("span").prop("outerHTML");
                            var c = b.compile($("#hottag-tmpl").html()),
                            d = c({
                                tag: a
                            });
                            //移除分类的clearDiv
                            $(item).children().find('div[class="clear"]').remove();
                            $($(item).children()[1]).append(d);
                            //再添加分类的clearDiv
                            $(item).children().append(clearDiv);
                            isFirst = false;
                        }
                    });
                    if (isFirst) {
                        //关键字父节点
                        var parentdiv = $('<div></div>');        //创建一个父div
                        parentdiv.attr('id', parentId);        //给父div设置id
                        parentdiv.addClass('kwParentDiv');    //添加css样式
                        var kwParent = kwNode.parent().prev("span").prop("outerHTML");
                        parentdiv.append(kwParent);

                        var kwTypeDiv = $('<div class="fl" style="width:610px;" name="kwTypeDiv"></div>');
                        //关键字字节点
                        var a = kwNode.addClass("tied").find("span").prop("outerHTML");
                        var c = b.compile($("#hottag-tmpl").html()),
                        d = c({
                            tag: a
                        });
                        kwTypeDiv.append(d);
                        kwTypeDiv.append(clearDiv);
                        parentdiv.append(kwTypeDiv);
                        $("#hcldiv").append(parentdiv); //关键字添加到文本框中
                    }

                    //存储已选择关键字Id
                    var pkId = kwNode.find("span").attr("data-pkid");
                    var ids = $("#hdKeyWords").val();
                    if (ids) {
                        ids += ",";
                    }
                    $("#hdKeyWords").val(ids + pkId);
                }
            },
            startSubmit: function (btn) {
                var text = $("#ddlFlowerType").find("option:selected").text();
                $("#hdFLOWERTYPE_NAME").val(text);
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
                    //保存状态，单保存状态为3（可继续编辑保存），保存并发布状态为0（进入待审核状态）；
                    var status = btnObj.attr("data-pkid");
                    $('#hdIsCheck').val(status);
                    var rs = self.trigger('beforesubmit', [], 1);
                    for (var i = 0; i < rs.length; i++) {   //判断是否都验证通过
                        if (typeof rs[i] != 'undefined' && rs[i] === false) {
                            self.endSubmit(btnObj); //操作按钮恢复原形
                            return false;
                        };
                    };
                    var keyid = $('#sysnumber').val();
                    var action = $('#savebtn').attr('ispostback');
                    self.startSubmit(btnObj);
                    if (status == "0") {
                        alertify.confirm("一旦保存并发布,将进入审核状态,该产品将无法修改,是否确认提交", function (e) {
                            if (!e) return false;
                            MemberFlower.SubmitForm(action, keyid, status);
                            $(".btn-cont").remove();
                        });
                    } else {
                        MemberFlower.SubmitForm(action, keyid, status);
                    }
                    self.endSubmit(btnObj);
                };
            },
            //提交表单数据保存信息
            SubmitForm: function (action, keyid, status) {
                $.ajaxjson("/MemberCenter/Design/ashx/MemberFlower.ashx", createParam(action, keyid, 'memberFlowerInfoForm'), function (d) {
                    if (d.Success) {
                        msg.ok("保存成功");
                        if (action == 'add') {  //新增状态改为编辑
                            $('#submitform1').attr('ispostback', 'edit');
                            $('#savebtn').attr('ispostback', 'edit');
                        }
                        if (status == "0") {  //保存并发布成功后，移除保存按钮
                            $(".btn-cont").remove();
                        }
                    } else {
                        msg.error("保存失败");
                    }

                }, { Message: "正在保存,请稍后...", LoadingType: 2 });
            },
            VerificationSaveMemberFlower: function () {
                //花型名称验证
                var name = $('input:text[name="NAME"]');
                if ($.trim(name.val()) == "" || $.trim(name.val()) == "请输入花型名称（必填）") {
                    ZDK.verify.showErroTip(name, '花型名称不能为空！');
                    return false;
                }
                //规格型号验证
                var ggxh = $('input:text[name="GGXH"]');
                if ($.trim(ggxh.val()) == "" || $.trim(ggxh.val()) == "请输入规格型号（必填）") {
                    ZDK.verify.showErroTip(ggxh, '规格型号不能为空！');
                    return false;
                }
                //交易价格验证
                var price = $('input:text[name="PRICE"]');
                if ($.trim(price.val()) == "" || $.trim(price.val()) == "请输入交易价格（必填）") {
                    ZDK.verify.showErroTip(price, '交易价格不能为空！');
                    return false;
                }
                //颜色分类验证
                var flowrType = $("select[name='Flowertype_sysnumberAndFnumber']");
                if (flowrType.val() == "0") {
                    ZDK.verify.showErroTip(flowrType, '请选择颜色分类！');
                    return false;
                }
                //图片验证
            },
            keyUpVerify: function () {
                //交易价格验证
                $('input:text[name="PRICE"]').live('keyup', function () {
                    if (!ZDK.verify.type.double($(this).val())) {
                        ZDK.verify.showErroTip($(this), '请输入正确交易价格，只能为数字！');
                    }
                    (this).focus();
                    $(this).val($(this).val().replace(/[^0-9.]/g, ""));
                });
            },
            //上传图片
            UpLoadFile: function () {
                var $wrap = $('#uploader');
                // 图片容器
                var $queue = $('.queueList>.filelist');
                // 没选择文件之前的内容。
                var $placeHolder = $wrap.find('.placeholder');
                // 添加的文件数量
                var fileCount = 0;
                // 添加的文件总大小
                var fileSize = 0;
                // 优化retina, 在retina下这个值是2
                var ratio = window.devicePixelRatio || 1;
                // 预览图大小 未上传到服务器之前的预览图大小
                var thumbnailWidth = 180 * ratio;
                var thumbnailHeight = 180 * ratio;
                // 可能有pedding, ready
                var state = 'pedding';
                // WebUploader实例
                var uploader;
                // 实例化
                uploader = WebUploader.create({
                    pick: {
                        id: '#filePicker',
                        multiple: false
                    },
                    formData: {
                        token: $("#hdFileToken").val(),
                        key: ''
                    },
                    dnd: '#dndArea',
                    paste: '#uploader',
                    swf: '/Static/js/common/webuploader/Uploader.swf',
                    chunked: false,
                    chunkSize: 512 * 1024,
                    server: 'http://upload.qiniu.com/',
                    accept: {
                        title: 'Images',
                        extensions: 'gif,jpg,jpeg,bmp,png',
                        mimeTypes: 'image/*'
                    },
                    // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
                    disableGlobalDnd: false,
                    compress: false,
                    fileNumLimit: 1, //多文件上传 限制文件个数
                    fileSingleSizeLimit: 20 * 1024 * 1024, // 20 M
                    auto: true
                });
                uploader.on('ready', function (a) {
                    window.uploader = uploader;
                });
                // 当有文件添加进来时执行，负责view的创建
                function addFile(file) {
                    var $li = $('<li id="' + file.id + '">' +
                    //'<p class="title">' + file.name + '</p>' +
                    '<p class="imgWrap"></p>' +
                    '<p class="progress"><span></span></p>' +
                    '<div class="file-panel" style="height: 30px">' +
                    '<span class="cancel" title="删除">删除</span>' +
                    '<span class="rotateRight"  title="向右旋转">向右旋转</span>' +
                    '<span class="rotateLeft"  title="向左旋转">向左旋转</span></div>' +
                    '</li>'),
                $prgress = $li.find('p.progress'),
                $wrap = $li.find('p.imgWrap'),
                $error = $('<p class="error"></p>'),
                $del = $li.find('span.cancel'),
                showError = function (code) {
                    switch (code) {
                        case 'exceed_size':
                            text = '文件大小超出';
                            break;

                        case 'interrupt':
                            text = '上传暂停';
                            break;

                        default:
                            text = '上传失败，请删除重试';
                            break;
                    }

                    $error.text(text).appendTo($li);
                };
                    if (file.getStatus() === 'invalid') {
                        showError(file.statusText);
                    } else {
                        //预览图
                        uploader.makeThumb(file, function (error, src) {
                            var img;
                            if (error) {
                                return;
                            }
                            img = $('<img src="' + src + '">');
                            $wrap.empty().append(img);
                        }, thumbnailWidth, thumbnailHeight);
                        file.rotation = 0;
                    }
                    file.on('statuschange', function (cur, prev) {
                        //隐藏上传进度
                        if (prev === 'progress') {
                            $prgress.hide();
                        }
                        // 上传失败
                        if (cur === 'error' || cur === 'invalid') {
                            showError(file.statusText);
                            // 中断
                        } else if (cur === 'interrupt') {
                            showError('interrupt');
                            //显示进度层
                        } else if (cur === 'progress') {
                            $error.remove();
                            $prgress.css('display', 'block');
                        }

                        $li.removeClass('state-' + prev).addClass('state-' + cur);
                    });
                    // 删除按钮
                    $del.on('click', function () {
                        uploader.removeFile(file); //删除文件
                    });
                    $li.appendTo($queue);
                }
                // 删除队列文件
                function removeFile(file) {
                    var $li = $('#' + file.id);
                    $li.off().find('.file-panel').off().end().remove();
                }
                //设置状态
                function setState(val) {
                    if (val === state) {
                        return;
                    }
                    state = val;
                    switch (state) {
                        case 'pedding':
                            $placeHolder.removeClass('element-invisible');
                            $queue.hide();
                            uploader.refresh();
                            break;
                        case 'ready':
                            $placeHolder.addClass('element-invisible');
                            $queue.show();
                            uploader.refresh();
                            break;
                    }
                }
                //上传进度
                uploader.onUploadProgress = function (file, percentage) {
                    var $li = $('#' + file.id),
                $percent = $li.find('.progress span');
                    $percent.text((percentage * 100).toFixed(0) + '%');
                };
                //当文件被加入队列以后触发。
                uploader.onFileQueued = function (file) {
                    fileCount++;
                    fileSize += file.size;
                    if (fileCount === 1) {
                        $placeHolder.addClass('element-invisible');
                    }
                    // 当有文件添加进来时执行，负责view的创建
                    addFile(file);
                    //设置ready状态
                    setState('ready');
                };
                //上传之前
                uploader.onUploadBeforeSend = function (block, data) {
                    var file = block.file;
                    var tm = new Date();
                    var str = tm.getMilliseconds() + tm.getSeconds() * 60 + tm.getMinutes() * 3600 + tm.getHours() * 60 * 3600 + tm.getDay() * 3600 * 24 + tm.getMonth() * 3600 * 24 * 31 + tm.getYear() * 3600 * 24 * 31 * 12;
                    var date = tm.getFullYear() + "" + (tm.getMonth() + 1) + "" + tm.getDate() + "" + tm.getHours();
                    var key = "FlowerLibrary/" + date + "/" + str + /\.[^\.]+$/.exec(file.name);
                    data.key = key;
                };
                //当文件被移除队列后触发。
                uploader.onFileDequeued = function (file) {
                    fileCount--;
                    fileSize -= file.size;
                    if (!fileCount) {
                        setState('pedding');
                    }
                    removeFile(file);
                };
                //上传完成之后
                uploader.onUploadSuccess = function (file, response) {
                    $("#hdFileKey").val(response.key);
                    var $item = $('#' + file.id);
                    $item.attr("data-key", response.key);
                    //获取上传后的图片地址
                    var newImg = $item.find("img");
                    uploadAjax.getFileSrc(response.key, function (data) {
                        newImg.attr("src", data);
                    });
                };
                //上传错误信息
                uploader.onError = function (code) {
                    if (code == 'F_EXCEED_SIZE') {
                        alert("图片大小超出20M，请重新选择图片");
                    }
                    else {
                        alert('Eroor: ' + code);
                    }
                };
                //文件ajax操作
                var uploadAjax = {
                    getFileSrc: function (key, callback) {
                        var param = {};
                        param.action = "getCloudPicUrl";
                        param.picType = 'flower'; //类型
                        param.key = key + "?imageView/2/w/180"; //文件key
                        param.styleName = ""; //图片样式名称
                        $.ajaxtext('/ashx/CommonHandler.ashx', param, function (data) {
                            callback && callback(data);
                        }, { IsShowLoading: false });
                    }
                };

                var rotation = 0; //旋转坐标
                //图片旋转(判断浏览器是否支持过度属性)
                var supportTransition = (function () {
                    var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
                    s = null;
                    return r;
                })();
                //操作按钮 旋转  删除
                $('.file-panel>span').live('click', function () {
                    var index = $(this).index(), $li = $(this).parent().parent(), deg;
                    switch (index) {
                        case 0:
                            rotation = 0;
                            //这里判断是否编辑页面
                            if (typeof ($li.attr("data-isedit")) != "undefined" && $li.attr("data-isedit") == "1") {
                                $(".queueList>.placeholder").removeClass("element-invisible");
                                $li.remove();
                            }
                            break;
                        case 1:
                            rotation += 90; //图片左旋转
                            break;
                        case 2:
                            rotation -= 90; //图片右旋转
                            break;
                    }
                    if (supportTransition) {
                        deg = 'rotate(' + rotation + 'deg)';
                        $li.find(".imgWrap").css({
                            '-webkit-transform': deg,
                            '-mos-transform': deg,
                            '-o-transform': deg,
                            'transform': deg
                        });
                    } else {
                        $li.find(".imgWrap").css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~ ~((rotation / 90) % 4 + 4) % 4) + ')');
                    }
                });

            }
        };
    $.extend(MemberFlower, ZDK.EventEmitter.prototype);
    $(function () {
        MemberFlower.InitFlower();
    });

})