define(function (require, exports, module) {
    require('js/common/jqueryvalidate/jqueryvalidate');
    var createParam = require('jQueryAjax').createParam;
    require('js/common/webuploader/webuploader.min.js');
    var headJs = require('headJs');
    var alertify = require('alertify'),
    iscom = $('#iscom').val() == 1,
ajaxSubmit = function (from) {
    $.ajaxjson('/Member/ashx/SaveEntity.ashx', createParam('saveidentity', '', from.id), function (data) {
        if (data.Success) {
            var registType = $("#saveBtn").attr("data-type");
            if (registType) {//第三步完成注册实名认证，直接调转到首页
                window.location = "/Index";
            } else {
                msg.alert("保存成功,我们会尽快为你审核");
                location.reload();
            }
        } else {
            msg.error("保存失败");
        }
    }, { IsShowLoading: true, Isback: false, Message: "正在提交", LoadingType: 1 });
};
    var BaseData = function () {
        var arr = {
            oldData: '',
            result: ''
        };
        return arr;
    };
    var MemberOldData = {
        IdReslut: BaseData(),
        //EIDCARD: BaseData(),
        //TFN: BaseData(),
        IDCARD: BaseData(),
        NAME: BaseData()
    };
    var addfunction = function () {
        //验证身份证号码
        jQuery.validator.addMethod("idCardNo", function (value, element, para) {
            //验证身份证号方法 
            var testIdCardNo = function (idcard) {
                var Errors = new Array("验证通过!", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!");
                var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "xinjiang", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
                var idcard, Y, JYM;
                var S, M;
                var idcard_array = new Array();
                idcard_array = idcard.split("");
                if (area[parseInt(idcard.substr(0, 2))] == null) return Errors[4];
                switch (idcard.length) {
                    case 15:
                        if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性 
                        } else {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性 
                        }
                        if (ereg.test(idcard))
                            return Errors[0];
                        else
                            return Errors[2];
                        break;
                    case 18:
                        if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式 
                        } else {
                            ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式 
                        }
                        if (ereg.test(idcard)) {
                            S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
                            Y = S % 11;
                            M = "F";
                            JYM = "10X98765432";
                            M = JYM.substr(Y, 1);
                            if (M == idcard_array[17])
                                return Errors[0];
                            else
                                return Errors[3];
                        } else
                            return Errors[2];
                        break;
                    default:
                        return Errors[1];
                        break;
                }
            };
            return testIdCardNo(value) == '验证通过!';

        }, "非法身份证号");
        jQuery.validator.addMethod("isSH", function (value, element) {
            var reg = /^\d+$/;
            var length = value.length;
            return this.optional(element) || length == 15 || length == 18 || length == 20 && reg.test(value);
        }, jQuery.validator.format("非法税号"));

    };

    var RemotePara = function (action, msg) {
        var para = {
            errMsg: msg,
            type: "post",
            url: "/Member/ashx/NumberIsUsed.ashx",
            // data: { action: action, number: $('[name=' + action + ']').val() },
            dataType: "json"
        };
        return para;
    };
    $(function () {
        //判断是否登录
        headJs.bindCreateHeadElmFn(function () {
            if (!headJs.loginInfo.isLogin) {
                location.href = '/registered';
                return;
            }
        })
        addfunction();
        //重新提交按钮
        var rebutton = $('#ressq');
        if (rebutton) {
            rebutton.click(function () {
                var memberid = $(this).attr('_id');
                $.ajaxjson('/Member/ashx/SaveEntity.ashx', createParam('delete', memberid), function (data) {
                    if (data.Success) {
                        location.reload();
                    } else {
                        msg.error("保存失败");
                    }
                }, { IsShowLoading: false, Isback: false, Message: "正在提交", LoadingType: 1 });
            });
        }
        var rules, messages;
        if (iscom) {
            rules = {
                'ENAME': {
                    required: true,
                    maxlength: 30,
                    minlength: 2
                },
                //                'EPERSON': {
                //                    required: true
                //                },
                //                'EIDCARD': {
                //                    required: true,
                //                    idCardNo: true,
                //                    remote: RemotePara('EIDCARD', '身份证已存在')
                //                },
                //                'TFN': {
                //                    required: true,
                //                    isSH: true,
                //                    remote: RemotePara('TFN', '该法人税号已经存在')
                //                },
                'NAME': {
                    required: true,
                    remote: RemotePara('NAME', '该营业执照已经存在')
                },
                'IDCARD': {
                    required: true,
                    remote: RemotePara('IDCARD', '该组织机构代码已经存在')
                }
            };
        } else {
            rules = {
                'NAME': {
                    required: true
                },
                'IDCARD': {
                    required: true,
                    idCardNo: true,
                    remote: RemotePara('IDCARD', '身份证已存在')
                }
            };
        }
        var infoForm = $("#infoForm"),
        saveBtn = $("#saveBtn", "#infoForm");
        jQuery.validator.setDefaults({
            submitHandler: function (form) {
                if (!$('#hdFileKey').val()) { // || !$('#IMG_BACK').val()
                    alertify.alert('请上传附件');
                    return false;
                }
                if (saveBtn.hasClass('btn-disable')) {
                    return false;
                }

                alertify.confirm("提交之后信息将进入审核状态,且在审核通过之后无法再修改,是否确认提交", function (e) {
                    if (e) {
                        saveBtn.removeClass('btn-orange').addClass('btn-disable').html('正在提交..');
                        ajaxSubmit(form);
                        saveBtn.addClass('btn-orange').removeClass('btn-disable').html('保存');
                        //    $(form).ajaxSubmit();
                        return false;
                    }
                });

            }
        });
        infoForm.validate({
            errorClass: "mtip-error highlight2",
            errorElement: "span",
            onkeyup: false,
            errorPlacement: function (error, element) {
                var p;
                if (element.is(":checkbox") || element.is(":radio") || element.is("input[type=file]")) {
                    p = element.parent().parent();
                } else {
                    p = element.parent();
                }
                if (p.find("span").length > 0) {
                    p.find("span").remove();
                }
                error.appendTo(p);
            },
            rules: rules,
            success: function (label) {
                label.removeClass("mtip-error highlight2").addClass("mtip-right");
            },
            onfocusinshowspan: true,
            focusCleanup: false,
            focusinshowspanfun: function (elm) {
                var onfocusSpanVal = $(elm).attr('onfocusSpanVal');
                if (onfocusSpanVal) {
                    $(elm).addClass('highlight1');
                    this.showonfocusSpan(elm, onfocusSpanVal);
                }

            }
        });
        UpLoadFile();
    });
    function UpLoadFile() {
        var $wrap = $('.uploader');
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
        if ($('.filePicker')[0]) {
            uploader = WebUploader.create({
                pick: {
                    id: '.filePicker',
                    multiple: false
                },
                formData: {
                    token: $(".file").val(),
                    key: ''
                },
                dnd: '.dndArea',
                paste: '.uploader',
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
            uploader.on('ready', function () {
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
                var key = "Authentication/" + date + "/" + str + /\.[^\.]+$/.exec(file.name);
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
                    param.picType = 'authentication'; //类型
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
        };
    }

});



