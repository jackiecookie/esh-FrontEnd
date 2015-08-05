define(function (require, exports, module) {
    require('js/common/cssSelect/cssSelect');
    var ZDK = require('js/common/procopy/procopy');
    ZDK.btnLoading = require('btnLoading');
    ZDK.upload = require('js/common/UpLoad/UpLoadJs');
    ZDK.verify = require('js/common/verify/verify');
    require('js/common/jqueryvalidate/jqueryvalidate');
    require('customSelect');
    var showLoginForm = require('loginPanel');
    var layer = require("layer");
    var verifyForm = require('js/common/verify/verifyform');
    var dataMapping = require('js/common/DataMapping/DataMapping').DataBindings,
    createParam = require('jQueryAjax').createParam,
    MemberFrom = {
        submiting: 0,
        //保存面料信息方法
        InitFrom: function () {
            var self = this;
            //加载上传附件信息
            //            this.initFileUpload();
            this.bindDetail();
            this.bindEvents();
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

        addFormEvent: function (eventItem) {
            var $this = $(eventItem);
            var isCheck = $this.attr("isCheck");
            var self = this;
            if (self.submiting == 1) {
                return false;
            };
            self.startSubmit($this);
            $.ajaxSubmit("/Member/ashx/MemberDesign/MemberFabric.ashx?action=save&isCheck=" + isCheck, $("#form1"), function (d) {
                self.endSubmit($this);
                if (d.Data == "1") {
                    //                    msg.ok(d.Message);
                    alert("修改成功");
                    window.close();
                    window.location.href = "/UIDesign/MemberFabricList/" + isCheck;
                }
                else if (d.Data == "-1") {
                    alert(d.Message);
                    //                    msg.error(d.Message);
                    showLoginForm();
                }
                else if (d.Data == "-2") {
                    alert(d.Message);
                    //                    msg.error(d.Message);

                }
                else {
                    //                    msg.error(d.Message);
                    self.showErroTip(d.Message, d.Data);

                }

            }, { Message: "正在保存,请稍后...", LoadingType: 2 });
            //            };
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
            var uploadCache = {};
            var progress = $('#make-filelist');
            var btn = $('#btnUpload');
            var extraInfoLoading = $('#extraInfoLoading');
            var extraInfoUpload = ZDK.upload({
                target: btn,
                uploadURI: '/Member/ashx/MemberDesign/UpLoadFlowerHandler.ashx?type=MLLibrary',
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
                updateInput(imgArr[2]);
                flag = true;

            });
            extraInfoUpload.on('onprogresreadqueue', function (data) {
                if (!uploadCache[data.progress]) {
                    var li = $('<li data-pid="' + data.progress + '"><p class="file clearfix"><span class="fl uploadfilename">' + data.name + '</span><a href="javascript:;" style="display:none;" action-type="del" class="aDel">删除</a>s</p><div class="adding clearfix"><p class="adifile"><span style="width:0%"><a href="javascript:;" style="display:none;" action-type="del">删除</a></span></p><p class="fl">正在上传中....</p><a href="javascript:;" class="fr" action-type="cancel">取消</a></div></li>').appendTo(progress);
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
                updateInput();
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
            function updateInput(imgSrc) {
                $('#extraInfoUploadInput').val(imgSrc);
            }

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
        //编辑面料详情信息
        bindDetail: function () {
            var c = this;
            var id = $('#iptSysnumber').val();
            if (id && id.length > 0) {
                $.ajaxjson('/Member/ashx/MemberDesign/MemberFabric.ashx?action=detail&id=' + id, '', function (d) {
                    if (d.Success) {
                        var data = d.Data;
                        //关键字
                        if (data.KEYWORD) {
                            for (var i = 0; i < data.KEYWORD.length; i++) {
                                $(':checkbox[dataname=' + data.KEYWORD[i] + ']').attr('checked', 'checked');
                            }
                            $('#keyword').text('');
                            $('#keyword').text(data.Info.KEYWORD);
                        }
                        else {
                            $('#keyword').text('');
                            $('#keyword').text('单击选择关键字');
                        }
                        //后处理费用
                        if (data.HCLFSYSNUMBER) {
                            for (var i = 0; i < data.HCLFSYSNUMBER.length; i++) {
                                $('.li' + data.HCLFSYSNUMBER[i]).addClass('selected');
                                $('.li' + data.HCLFSYSNUMBER[i]).find('input').prop('checked', true);
                            }
                        }
                        if (data.Info.FILEPATH) {
                            $("#imgFabric").attr("src", "/" + data.Info.FILEPATH);
                        }
                        if (data.Info.FABRICTYPE_NAME) {
                            $("#srcTypeDiv").find(".selectLt").html(data.Info.FABRICTYPE_NAME);
                        }
                        $(':input[value=' + data.Info.FL_FNUMBER + ']').prop('checked', true);
                        $(':input[value=' + data.Info.DY_FNUMBER + ']').prop('checked', true);
                        $(':input[value=' + data.Info.SYFW + ']').prop('checked', true);


                        $(':input[value=' + data.Info.RS_YSYQ + ']').prop('checked', true);
                        $(':input[value=' + data.Info.YH_RLYQ + ']').prop('checked', true);
                        $(':input[value=' + data.Info.YH_GYYQ + ']').prop('checked', true);
                        $(':input[value=' + data.Info.YH_SLDDJ + ']').prop('checked', true);
                        if (data.JXList) {
                            c.BindComponent("JXMD", data.JXList);

                        }
                        if (data.WXList) {
                            c.BindComponent("WXMD", data.WXList);

                        }
                        c.showProperty(data.Info.DY_FNUMBER, data.Info.YH_RLYQ);
                        dataMapping(data.Info, '#form1');
                        c.bindVerify();
                        $('select').customSelect();
                        c.bindRadio();
                    }
                    else {

                    }
                }, { Message: "正在获取数据", LoadingType: 2, IsShowLoading: true });
            }
            else {
                $('select').customSelect();
            }

        },
        bindEvents: function () {
            var c = this;
            $("#srcTypeDiv").MultiCssSelect({
                url: '/Member/ashx/MemberDesign/GetFabricType.ashx',
                DivElment: $('#srcTypeDiv'),
                initName: "选择",
                onClick: function (node) {
                    var val = $(node).find("span").attr('node-id');
                    if (val != '选择') {
                        $('#FABRICTYPE_SYSNUMBER').val(val);
                    } else {
                        $('#FABRICTYPE_SYSNUMBER').val('');
                    }

                }
            });
            $('.addNum').click(function () {
                var $numInput = $(this).parent().find("input");
                var num = parseInt($numInput.val()) + 1;
                if (num < 6) {
                    $numInput.val(num);
                    $(this).siblings(".reduceNum").prop("disabled", false);
                    $(this).siblings(".reduceNum").removeClass('disabled');
                    c.addComponentRow(num, $numInput.attr("data-for"));
                }
                if (num == 5) {
                    $(this).prop("disabled", true);
                    $(this).addClass('disabled');
                }
                c.bindVerify();
            });
            $('.reduceNum').click(function () {
                var $numInput = $(this).parent().find("input");
                var num = parseInt($numInput.val()) - 1;
                if (num > 0) {
                    $numInput.val(num);
                    c.DelComponentRow($numInput.attr("data-for"));
                    $(this).siblings(".addNum").prop("disabled", false);
                    $(this).siblings(".addNum").removeClass('disabled');
                }
                if (num == 1) {
                    $(this).prop("disabled", true);
                    $(this).addClass('disabled');
                }
            });
            $('.sys_spec_text li').click(function () {
                if ($(this).hasClass("selected")) {
                    $(this).removeClass("selected");
                    $(this).attr("title", "点击选择");
                    $(this).find("input").prop("checked", false);
                }
                else {
                    $(this).addClass("selected");
                    $(this).attr("title", "点击取消");
                    $(this).find("input").prop("checked", true);
                }
            });

            $("#dlproperty dd input").each(function (index) {
                $(this).click(function () {
                    var $dlProperty = $("#dlproperty");
                    var $nextdt = $dlProperty.next().find("dt");
                    var $nextdd = $dlProperty.next().find("dd");
                    $nextdt.hide();
                    $nextdd.hide();
                    $($nextdt[index]).show();
                    $($nextdd[index]).show();
                });
            });
            $("#spandyeing input").click(function () {
                var forclass = $(this).attr("forclass");
                var $lable = $("." + forclass);
                $lable.siblings("label").hide();
                $lable.siblings("label").find("input").addClass("ishide");
                $lable.show();
                $lable.find("input").first().prop("checked", true);
                $lable.find("input").removeClass("ishide");
            });
            $('#keyword').click(function () {
                $.layer({
                    type: 1,
                    fix: true,
                    title: "关键字选择",
                    btns: 2,
                    btn: ['确定', '关闭'],
                    area: ['500px', '500px'],
                    domCloseType: 2,
                    page: { dom: '#dialog-GJZ' },
                    yes: function (index) {
                        var keyword = "";
                        $('#keyworddiv :checked').each(function () {
                            var $item = $(this);
                            keyword += (keyword == "" ? $item.attr("dataname") : "；" + $item.attr("dataname"));
                        });
                        $('#keyword').text(keyword);
                        layer.close(index);
                    },
                    no: function () {
                        var keyword = $('#keyword').val().split('；');
                        if (keyword && keyword.length > 0) {
                            $('#keyworddiv :input').prop('checked', false);
                            for (var i = 0; i < keyword.length; i++) {
                                if (keyword[i] == "") {
                                    continue;
                                }
                                $(':checkbox[dataname=' + keyword[i] + ']').prop('checked', true);
                            }
                        }
                    },
                    close: function () {
                        var keyword = $('#keyword').val().split('；');
                        if (keyword && keyword.length > 0) {
                            $('#keyworddiv :input').prop('checked', false);
                            for (var i = 0; i < keyword.length; i++) {
                                if (keyword[i] == "") {
                                    continue;
                                }
                                $(':checkbox[dataname=' + keyword[i] + ']').prop('checked', true);
                            }
                        }
                    }

                });
            });
            //            //上传图片
            //            $(".uploadimg .y-btn-white").each(function () {
            //                //                var imgName = $(this).attr("rel");
            //                var $imgshow = $(this).siblings(".make-filelist").find(".uploadfile-indicator");
            //                var $imginput = $(this).siblings("#extraInfoUploadInput");
            //                new AjaxUpload(this, {
            //                    action: '/Member/ashx/MemberDesign/UpLoadFabricHandler.ashx',
            //                    name: 'myfile',
            //                    onSubmit: function (file, ext) {
            //                        if (ext && /^(jpg|png|jpeg|gif)$/.test(ext)) {
            //                            //Setting data 
            //                            this.setData({
            //                            //                                'imgName': imgName
            //                        });
            //                    } else {
            //                        alert("文件类型不正确或没有选择文件！");
            //                        return false;
            //                    }
            //                    $imgshow.html('<li class="clearfix"><p class="file clearfix"><span class="fl">' + '' + '</span><a href="javascript:;"  action-type="cancel">  </a></p><div class="adding clearfix"><p class="adifile"><span style="width:0%"></span></p><p class="fl">正在上传中....</p><a href="javascript:;" class="fr" action-type="cancel"></a></div></li>');
            //                    return true;
            //                },
            //                onComplete: function (file, data) {
            //                    if (data == "0") {
            //                        var pli = $imgshow.find('li');
            //                        if (pli && pli.length && pli.length > 1) {
            //                            $(pli[0]).remove();
            //                        }

            //                        $imgshow.find('p.fl').html('上传失败!');
            //                    }
            //                    else {

            //                        var pli = $imgshow.find('li');
            //                        if (pli && pli.length && pli.length > 1) {
            //                            $(pli[0]).remove();
            //                        }

            //                        $imgshow.find('p.fl').html('上传成功!');
            //                        $imgshow.find('p.adifile span').css('width', '100%');
            //                        $imgshow.find('div').hide();
            //                        $imgshow.addClass("tsuc");
            //                        $imgshow.find('p.file a').attr("del-val", data);
            //                        $imgshow.find('p.file .fl').html('<img src="' + data + '" style="width: 100px; height:100px" >');
            //                        $imginput.val(data);
            //                    }
            //                }
            //            });

            //        });

            $(".table1").find(".auto").live('click', function () { c.selectYarn(this); });
            c.bindVerify();
        },
        bindVerify: function () {
            var c = this;
            var rules = {
                "FABRICTYPE_SYSNUMBER": {
                    "msg": "请选择面料分类",
                    "valid": [
                    {
                        "msg": "请选择面料分类",
                        "type": "required"
                    }
                ]
                },
                "FNUMBER": {
                    "msg": "请输入面料编号",
                    "valid": [
                    {
                        "msg": "请输入面料编号",
                        "type": "required"
                    },
                    {
                        "range": [1, 40],
                        "msg": "面料编号最多可输入40位",
                        "type": "range"
                    }
                ]
                },
                "NAME": {
                    "msg": "请输入面料名称",
                    "valid": [
                    {
                        "msg": "请输入面料名称",
                        "type": "required"
                    },
                    {
                        "range": [1, 40],
                        "msg": "面料名称最多可输入40位",
                        "type": "range"
                    }
                ]
                },
                "JXMD": {
                    "msg": "请输入经密",
                    "valid": [
                    {
                        "msg": "请输入经密",
                        "type": "required"
                    },
                   {
                       "name": "^[1-9]\\d*$",
                       "msg": "请输入正确的经密，只能输入正整数",
                       "type": "reg"
                   }
                ]
                },
                "WXMD": {
                    "msg": "请输入纬密",
                    "valid": [
                    {
                        "msg": "请输入纬密",
                        "type": "required"
                    },
                   {
                       "name": "^[1-9]\\d*$",
                       "msg": "请输入正确的纬密，只能输入正整数",
                       "type": "reg"
                   }
                ]
                },
                "JXMDSX": {
                    "msg": "请选择纱线",
                    "valid": [
                    {
                        "msg": "请选择纱线",
                        "type": "required"
                    }
                ]
                },
                "WXMDSX": {
                    "msg": "请选择纱线",
                    "valid": [
                    {
                        "msg": "请选择纱线",
                        "type": "required"
                    }
                ]
                },
                "YH_HWXH": {
                    "msg": "请输入花位循环",
                    "valid": [
                    {
                        "msg": "请输入花位循环",
                        "type": "required"
                    },
                   {
                       "name": "^[1-9]\\d*$",
                       "msg": "请输入正确的花位循环，只能输入正整数",
                       "type": "reg"
                   }
                ]
                },
                "JSHHCC_CM": {
                    "msg": "请输入经向花回尺寸",
                    "valid": [
                    {
                        "msg": "请输入经向花回尺寸",
                        "type": "required"
                    },
                   {
                       "name": "^\\d+[.]*\\d*$",
                       "msg": "请输入正确的经向花回尺寸",
                       "type": "reg"
                   }
                ]
                },
                "WSHHCC_CM": {
                    "msg": "请输入纬向花回尺寸",
                    "valid": [
                    {
                        "msg": "请输入纬向花回尺寸",
                        "type": "required"
                    },
                   {
                       "name": "^\\d+[.]*\\d*$",
                       "msg": "请输入正确的纬向花回尺寸",
                       "type": "reg"
                   }
                ]
                },
                "HL": {
                    "msg": "请输入美元汇率",
                    "valid": [
                    {
                        "msg": "请输入美元汇率",
                        "type": "required"
                    },
                   {
                       "name": "^\\d+[.]*\\d*$",
                       "msg": "请输入正确的美元汇率，只能输入数字",
                       "type": "reg"
                   }
                ]
                },
                "FILE_PATH": {
                    "msg": "请上传图片",
                    "valid": [
                    {
                        "msg": "请上传图片",
                        "type": "required"
                    }
                ]
                }

            };
            verifyForm($("#form1"), function (eventItem) { c.addFormEvent(eventItem); }, rules);
        },
        showProperty: function (dyfnumber, yhrlyq) {
            $("#dlproperty dd input").each(function (index) {
                if (dyfnumber == $(this).val() && index > 0) {
                    var $dlProperty = $("#dlproperty");
                    var $nextdt = $dlProperty.next().find("dt");
                    var $nextdd = $dlProperty.next().find("dd");
                    $nextdt.hide();
                    $nextdd.hide();
                    $($nextdt[index]).show();
                    $($nextdd[index]).show();
                }
            });
            $("#spandyeing input").each(function (index) {
                if (yhrlyq == $(this).val() && index > 0) {
                    var forclass = $(this).attr("forclass");
                    var $lable = $("." + forclass);
                    $lable.siblings("label").hide();
                    $lable.show();
                    $lable.find("input").removeClass("ishide");
                }

            });

        },
        bindRadio: function () {
            $("input:radio").parent("label").removeClass("r_on");
            $('input:radio:checked').parent("label").addClass("r_on");
        },
        showErroTip: function (msg, erroritem) {
            ZDK.verify.showErroTip($(erroritem), msg);
        },
        //添加成分
        addComponentRow: function (typeIndex, type, data, isNotAdd) {
            var c = this;
            var $dd = $("#dd" + type);
            var $span = $("#span" + type);
            if (data) {
                var dataValue = data.JXCF + "|" + data.JXSZGGNAME + "|" + data.JSGG + "|" + data.JX_GUXIAN + "|" + data.JX_CFBL + "|" + data.PRICE_JS + "|" + data.JX_KONGSHU;
                var jxHtml = '';
                jxHtml += ' <div class="divtable"><div class="hr"></div>';
                jxHtml += '  <table cellpadding="0" cellspacing="0" class="table2">';
                jxHtml += '<tr>';
                jxHtml += ' <td class="td1" align="right">成分</td>';
                jxHtml += ' <td class="text1">';
                jxHtml += ' <input  type="text" readonly="readonly" value="' + data.JXCF + '" class="chengfen w_small w_length  mr-5" /> ';
                jxHtml += '</td>';

                jxHtml += ' <td rowspan="2">  <input class="errorfocusinput" value="" readonly="readonly" /> ';
                jxHtml += '<a tabindex="52" type="div" data-name="SX' + type + typeIndex + '" data-valid="' + type + 'SX" class="buto auto form-value" >选择纱线</a>';
                jxHtml += '<input name="iptcf" type="hidden" class="dataValue"  value="' + dataValue + '" /><span class="form-tip"></span>';
                jxHtml += '</td>';
                jxHtml += '</tr>';

                jxHtml += '<tr>';
                jxHtml += ' <td class="td1" align="right">粗细</td>';
                jxHtml += ' <td class="text1">  <input type="text" readonly="readonly" value="' + data.JSGG + '" class="cuxi w_small w_length  mr-5" /> </td>';
                jxHtml += '<td></td>';
                jxHtml += '</tr>';
                jxHtml += '</table><div>';
                $dd.append(jxHtml);
                $span.append("<span>" + (isNotAdd ? "" : "+") + "<input class=\"w_small w_30 form-value\" name=\"" + type + "\" data-valid=\"" + type + "\" data-name=\"" + type + typeIndex + "\" type=\"text\" value=\"" + data.JXMD + "\"  /></span>");
            }
            else {
                var jxHtml = '';
                jxHtml += ' <div class="divtable"><div class="hr"></div>';
                jxHtml += '  <table cellpadding="0" cellspacing="0" class="table2">';
                jxHtml += '<tr>';
                jxHtml += ' <td class="td1" align="right">成分</td>';
                jxHtml += ' <td class="text1">';
                jxHtml += ' <input  type="text"  readonly="readonly" class="chengfen w_small w_length  mr-5" /> ';
                jxHtml += '</td>';

                jxHtml += ' <td rowspan="2">  <input class="errorfocusinput" value="" readonly="readonly" /> ';
                jxHtml += '<a tabindex="52" type="div" data-name="SX' + type + typeIndex + '" data-valid="' + type + 'SX" class="buto auto form-value" >选择纱线</a>';
                jxHtml += '<input class="dataValue" name="iptcf" type="hidden" /><span class="form-tip"></span>';
                jxHtml += '</td>';
                jxHtml += '</tr>';

                jxHtml += '<tr>';
                jxHtml += ' <td class="td1" align="right">粗细</td>';
                jxHtml += ' <td class="text1">  <input type="text" readonly="readonly" class="cuxi w_small w_length  mr-5" /> </td>';
                jxHtml += '<td></td>';
                jxHtml += '</tr>';
                jxHtml += '</table><div>';
                $dd.append(jxHtml);
                $span.append("<span> + <input class=\"w_small w_30 form-value\"  name=\"" + type + "\" data-valid=\"" + type + "\"  data-name=\"" + type + typeIndex + "\" type=\"text\"  /></span>");
            }
        },

        BindComponent: function (type, data) {
            var c = this;
            var $dd = $("#dd" + type);
            var $table = $dd.find("table");
            var $span = $("#span" + type);
            $span.html("");
            $table.remove();
            for (var i = 0; i < data.length; i++) {
                c.addComponentRow(i, type, data[i], i == 0);
            }

        },
        //删除成分
        DelComponentRow: function (type) {
            var c = this;
            $("#dd" + type).find(".divtable").last().remove();
            $("#span" + type).find("span").last().remove();
        },
        //纱线选择方法
        selectYarn: function (eventItem) {
            currentYarn = eventItem;
            $.layer({
                type: 2,
                title: false,
                shadeClose: false,
                fix: false,
                shift: 'top',
                area: ['912px', 633],
                iframe: {
                    src: '/UIPricing/FabricPricing/SelectYarn.aspx?isShowYarn=1',
                    scrolling: 'no'
                }
            });
        }
    };

    $.extend(MemberFrom, ZDK.EventEmitter.prototype);
    $(function () {
        MemberFrom.InitFrom();
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


