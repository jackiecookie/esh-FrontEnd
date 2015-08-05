define(['autocomplete', 'js/common/cssSelect/cssSelect', 'js/common/jqueryvalidate/jqueryvalidate', 'jQueryAjax', 'js/lib/jquery.cityselect/jquery.cityselect.js'], function (require, exports, module) {
    //
    require('js/common/jqueryvalidate/jqueryvalidate');
    var jQueryAjax = require('jQueryAjax');
    require('jqueryJson');
    require('autocomplete');
    require('js/common/cssSelect/cssSelect');
    var citySelect = require('js/lib/jquery.cityselect/jquery.cityselect.js');
    var headJs = require('headJs');
    var iscom = $('#iscom').val() == 1;
    var identityStates = $('#identityStates').val();
    var url = '/Member/ashx/PrWorkLive.ashx';
    var autoUrl = '/Member/ashx/AutoComplete.ashx';
    var flag;
    var addfunction = function () {
        jQuery.validator.addMethod("provincerequired", function (value, element) {
            if (value) {
                var v = $(element).next().val();
                if (!v) return false;
                if (v) {
                    v = $(element).next().next().val();
                    if (!v) return false;
                }
            } else {
                return false;
            }
            return true;
        }, '此项必填');

        jQuery.validator.addMethod("isDate", function (value, element) {
            if (value) {
                var ereg = /^(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/;
                var r = value.match(ereg);
                if (r == null) {
                    return false;
                }
                var d = new Date(r[1], r[3] - 1, r[5]);
                var result = (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[5]);
                return this.optional(element) || (result);
            }
            else {
                return true;
            }
        }, '输入正确的日期');
        //真实名称校验
        jQuery.validator.addMethod("isName", function (val, ele) {
            var reg = /^[\u4e00-\u9fa5_a-zA-Z\s]{2,100}$/;
            return this.optional(ele) || (reg.test(jQuery.trim(val)));
        });
        //手机
        jQuery.validator.addMethod("isMobile", function (value, element) {
            if (value) {
                var length = value.length;
                return this.optional(element) || length == 11 && /^1[358]\d{9}$/.test(value);
            } else {
                return true;
            }
        }, "请填写正确的手机号码");
        //验证固定电话  
        jQuery.validator.addMethod("checkTel", function (value, element) {
            var pattern = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
            if (value != '') {
                if (!pattern.exec(value)) {
                    return false;
                }
            } else {
                return 'dependency-mismatch';
            };
            return true;
        }, " 输入有效电话!如:010-86961489");
        //邮箱
        jQuery.validator.addMethod("checkEmail", function (value, element) {
            var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (value != '') {
                if (!myreg.test(value)) {
                    return false;
                }
            };
            return true;
        }, " 请输入有效的E_mail！");

        //QQ
        jQuery.validator.addMethod("IsQQ", function (value, element) {
            var myreg = /^[1-9]*[1-9][0-9]*$/;
            if (value != '') {
                if (!myreg.test(value)) {
                    return false;
                }
            };
            return true;
        }, " 请输入有效的QQ！");

        //全以英文
        jQuery.validator.addMethod("english", function (value, element) {
            var myreg = /^[a-zA-Z -_@.,&\/\\()0-9?]+$/g;
            if (value != '') {
                if (!myreg.test(value)) {
                    return false;
                }
            };
            return true;
        }, " 请输入英文名称！");
    };
    var initWorkLive = function () {
        flag = 1;
        var vaildate = $('.workLive').validate({
            errorClass: "mtip-error highlight2",
            errorElement: "span"
        });
        $('#addWork').click(function () {
            $('#workField span.mtip-error ').remove();
            $('#workField span.mtip-right ').remove();
            var workList = $('.workLive');
            var companyName, post, workStarTime, workEndTime;
            for (var i = 0; i < workList.length; i++) {
                var len = $(workList[i]);
                len.removeClass("highlight2");
                if (!len.val()) {
                    len.addClass("highlight2");
                    vaildate.errorList.push({
                        message: '此项不能为空',
                        element: len
                    });
                } else {
                    var lenName = len.attr('name');
                    if (lenName == '_COMPANY_NAME' || lenName == '_POST') {
                        if (len.val().length > 30) {
                            len.addClass("highlight2");
                            vaildate.errorList.push({
                                message: '长度超过限值',
                                element: len
                            });
                        }
                    }
                }
            }
            //如果有错误显示错误
            if (vaildate.errorList.length > 0) {
                vaildate.defaultShowErrors();
                vaildate.errorList = [];
            } else {
                companyName = $('.workLive[name=_COMPANY_NAME]').val();
                post = $('.workLive[name=_POST]').val();
                workStarTime = $('.workLive[name=_JOBBEGIN_DATE]').val();
                workEndTime = $('.workLive[name=_JOBEND_DATE]').val();
                var obj = new Object();
                obj.COMPANY_NAME = companyName, obj.POST = post, obj.JOBBEGIN_DATE = workStarTime, obj.JOBEND_DATE = workEndTime;

                var action = $(this).attr('action');
                var id = '';
                if (action == 'edit') id = $(this).attr('editid');
                $.ajaxjson(url, createParam2(action, id, obj), function (d) {
                    if (d.Success) {
                        if (action != 'edit') {
                            msg.ok("保存成功");
                            $('.workLive[name=_COMPANY_NAME]').val('');
                            $('.workLive[name=_POST]').val('');
                            $('.workLive[name=_JOBBEGIN_DATE]').val('');
                            $('.workLive[name=_JOBEND_DATE]').val('');
                            obj.JOBS_ID = d.Data;
                            CreateWorkLiveTable(obj);
                        } else {
                            location.reload();
                        }
                    } else {
                        msg.ok(d.Message);
                    }
                }, { Message: "正在保存,请稍后...", LoadingType: 2, IsShowLoading: false });

                flag++;
            }
        });
    };
    var changWorkLive = function (action, elment, id, flag) {

        var elms = $('#infoForm').find('[flag=' + flag + ']');
        var _this = $(elment);
        if (action == 'edit') {
            var addWord = $('#addWork');
            for (var i = 0; i < elms.length; i++) {
                var name = $(elms[i]).attr('name');
                $('.workLive[name=_' + name + ']').val($(elms[i]).val());
                if (name == 'JOBS_ID') { addWord.attr('editid', $(elms[i]).val()); }

            }
            addWord.html('修改工作经历');
            addWord.attr('action', 'edit');
        } else {
            if (confirm("确认删除吗？？？")) {
                $.ajaxjson(url, createParam2('jobdelete', id), function (d) {
                    if (d.Success) {
                        msg.ok("删除成功");
                        _this.parent().parent().remove();
                        elms.remove();
                    } else {
                        msg.error("删除失败");
                    }
                }, { Message: "正在删除,请稍后...", LoadingType: 5, IsShowLoading: false });
            }
        }

    };
    var ajaxSubmit = function (from, saveBtn) {

        $.ajaxjson('/Member/ashx/SaveMemberInfo.ashx', createParam1('save', '', from.id), function (data) {
            if (data.Success) {
                var registType = $(saveBtn).attr("data-type");
                if (registType) {
                    if (registType == "2") {    //第二步完成注册基本信息，直接调转到首页
                        window.location = "/Index";
                    } else {    //下一步，完成实名认证
                        window.location = "/RegAuthentication?registType=" + registType;
                    }
                } else {
                    msg.ok("保存成功");
                    saveBtn.addClass('btn-orange').removeClass('btn-disable').html('保存');
                    $('.mtip-right').remove();
                }
            } else {
                saveBtn.addClass('btn-orange').removeClass('btn-disable').html('保存');
                $('.mtip-right').remove();
                msg.error("保存失败");
            }
        }, { IsShowLoading: true, Isback: false, Message: "正在提交", LoadingType: 1 });
    };
    var initCom = function () {
        var enterprisetype = $('#ENTERPRISETYPE').val();
        enterprisetype = enterprisetype.split(',');
        for (var i = 0, len = enterprisetype.length; i < len; i++) {
            $('[name=ENTERPRISETYPE][value=' + enterprisetype[i] + ']').attr('checked', true);
        }
    };
    var init = function () {
        $.ajaxjson(url, createParam2('job'), function (jobJs) {
            if (jobJs.length > 0) {
                len = jobJs.length;
                for (var j = 0; j < len; j++) {
                    CreateWorkLiveTable(jobJs[j]);
                }
            }
        });
        flag = 1;
        $('[name=SEX][value=' + $('#SexRadio').val() + ']').attr('checked', true);
        $('select#slEducational').attr('value', $('#hdEDUCATIONAL').val());
        var phobbyJs = $('#phobbyJs').val();
        if (phobbyJs) {
            phobbyJs = eval(phobbyJs);
            if (phobbyJs.length > 0) {
                var phobbys = phobbyJs[0].HOBBIES_ID.split(',');
                var len = phobbys.length;
                for (var i = 0; i < len; i++) {
                    $('[name=HOBBIES_ID][value=' + phobbys[i] + ']').attr('checked', true);
                }
            }
        }
    };

    var CreateWorkLiveTable = function (obj) {
        if (obj.JOBBEGIN_DATE && obj.JOBEND_DATE) {
            var stardate = obj.JOBBEGIN_DATE.split(" ")[0];
            var endDare = obj.JOBEND_DATE.split(" ")[0];
        }
        $('#infoForm').append(' <input type="hidden"  name="COMPANY_NAME" value="' + obj.COMPANY_NAME + '" flag="' + flag + '"/>');
        if (obj.JOBS_ID) $('#infoForm').append(' <input type="hidden"  name="JOBS_ID" value="' + obj.JOBS_ID + '"  flag="' + flag + '"/>');
        else $('#infoForm').append(' <input type="hidden"  name="JOBS_ID" value="add"  flag="' + flag + '"/>');
        $('#infoForm').append(' <input type="hidden"  name="POST" value="' + obj.POST + '"  flag="' + flag + '"/>');
        $('#infoForm').append(' <input type="hidden"  name="JOBBEGIN_DATE" value="' + stardate + '"  flag="' + flag + '"/>');
        $('#infoForm').append(' <input type="hidden"  name="JOBEND_DATE" value="' + endDare + '"  flag="' + flag + '"/>');
        var workDiv = $('#workLiveDiv');
        var workLiveTable = workDiv.find('table');
        if (workLiveTable.length == 0) {
            workDiv.append([' <table style="margin-bottom: 40px;margin-left: 40px;width:75%" class="worklive1"><thead><tr><th  width="20%">单位名称</th><th  width="20%">职位</th><th  width="20%">开始时间</th><th width="20%">离职时间</th><th  width="20%" colspan="2">操作</th></tr></thead><tbody><tr class="alt"><td>' + obj.COMPANY_NAME + '</td><td>' + obj.POST + '</td><td>' + stardate + '</td><td>' + endDare + '</td><td><a href="javascript:void(0)"  onclick="changWorkLive(\'edit\',this,\'' + obj.JOBS_ID + '\',\'' + flag + '\')">修改</a></td><td><a href="javascript:void(0)"  onclick="changWorkLive(\'del\',this,\'' + obj.JOBS_ID + '\',\'' + flag + '\')">删除</a></td></tr></tbody></table>']);
        } else {
            workLiveTable.find('tbody').append('<tr class="alt"><td>' + obj.COMPANY_NAME + '</td><td>' + obj.POST + '</td><td>' + stardate + '</td><td>' + endDare + '</td><td><a href="javascript:void(0)"  onclick="changWorkLive(\'edit\',this,\'' + obj.JOBS_ID + '\',\'' + flag + '\')">修改</a></td> <td><a href="javascript:void(0)"  onclick="changWorkLive(\'del\',this,\'' + obj.JOBS_ID + '\',\'' + flag + '\')">删除</a></td></tr>');
        }
        flag++;
    };

    function createParam1(action, keyid, formid) {
        var o = {}, o1 = {}, o3 = {}, jsonArray1 = [], jsonArray2 = [], query1 = [], query2 = [], query4 = [], identityStates;
        if (!iscom) {
            jsonArray2.push('SCHOOL_ID', 'EDUCATIONAL', 'SCHOOL_NAME', 'FACULTIES', 'BEGIN_DATE', 'END_DATE', 'CREATE_DATE', 'MODIFY_DATE', 'VALID', 'TYPE');
        } else {
            jsonArray1.push('COMPANY_NAME');
            jsonArray1.push('E_COMPANY_NAME');
        }
        jsonArray1.push('MEMBER_NAME', 'LOGIN_NAME', 'PASSWORD', 'SEX', 'BIRTHDAY', 'TEL', 'FAX', 'MOBILE', 'QQ', 'CONTACTPHONE',
        'MSN', 'EMAIL', 'BACKUP_EMAIL', 'CURRENT_AREA_ID', 'HOMETOWN_AREA_ID', 'AREA_ID', 'ADDRESS', 'POST_CODE', 'HEAD_PORTRAIT', 'MEMBER_TYPE',
        'COMPANY_TYPE', 'COMPANY_ADDRESS', 'CHECK_STATUS', 'CHECK_USER_ID', 'CHECK_DATE', 'INTEGRAL_TOTAL', 'INTEGRAL', 'MONEY_BUY',
        'CREATE_DATE', 'MODIFY_DATE', 'REMARK', 'CONSTELLATION', 'VALID', 'REGCAPITAL', 'PRODUCTCATEGORIES', 'EDUCATION', 'POSITION', 'NICKNAME',
        'PRODUCTNAME', 'PRODUCTSCOPE', 'ENTERPRISETYPE', 'RENDERING', 'SCENE', 'CUSTOMSDATA', 'ISSEND', 'AREA_ID'); //'LEGALPERSON',

        var form = $('#' + formid);
        var query = '';
        if (form) {
            query = $('#' + formid).serializeArray();
            var len = query.length;
            for (var i = 0; i < len; i++) {
                if ($.inArray(query[i].name, jsonArray1) != -1) {
                    query1.push(query[i]);
                }
                else if ($.inArray(query[i].name, jsonArray2) != -1) {
                    query2.push(query[i]);
                } else if (query[i].name == 'HOBBIES_ID') {
                    query4.push(query[i]);
                } else if (query[i].name == 'identityStates') {
                    identityStates = query[i].value;
                }
            }

            o.jsonEntity = $.toJSON(jQueryAjax.convertArray(query1));
            o1.jsonEntity = $.toJSON(jQueryAjax.convertArray(query2));
            o3.jsonEntity = $.toJSON(jQueryAjax.convertArray(query4));

        }
        o.action = action;
        o.keyid = keyid;
        o1.keyid = $('#SchoolID').val();
        var paraArr = new Array();
        paraArr.push("json=" + encodeURIComponent($.toJSON(o)), "json1=" + encodeURIComponent($.toJSON(o1)), "json3=" + encodeURIComponent($.toJSON(o3)), "identityStates=" + identityStates);
        return paraArr.join("&");
    }


    function createParam2(action, keyid, obj) {
        var o = {};
        if (obj) {
            o.jsonEntity = $.toJSON(obj);
        }
        o.action = action;
        o.keyid = keyid;
        return "json=" + encodeURIComponent($.toJSON(o));
    }

    var initAuto = function () {
        $('#txtCompanyNamePerson,#txtCompanyName,#txtSchoolName,#txtOccupationName,#txtFacultiesName').AutoComplete({
            'data': autoUrl,
            'width': 'auto',
            'maxItems': 5,
            'getajaxParams': function (input) {
                return {
                    'action': $(input).attr('name')
                };
            }
        });
    };

    var initCitySelect = function () {
        var optionObj = {
            nodata: "none",
            required: false,
            url: '/Member/ashx/GetProvince.ashx'
        };
        var province = $('#province').val();
        var city = $('#city').val();
        var dist = $('#dist').val();
        if (province && city && dist) {
            optionObj.prov = province;
            optionObj.city = city;
            optionObj.dist = dist;
            optionObj.cityId = $('#city').attr('attr-id');
        }
        $("#citySelect").citySelect(optionObj);
    };
    $(function () {
        //判断是否登录
        headJs.bindCreateHeadElmFn(function () {
            if (!headJs.loginInfo.isLogin) {
                location.href = '/registered';
                return;
            }
        })
        initAuto();
        initCitySelect();
        if (identityStates != 0) {
            var companyName = $('[name=COMPANY_NAME]');
            //var legalperson = $('[name=LEGALPERSON]');
            //companyName.attr('placeholder', '').attr('readonly', true);
            //legalperson.attr('readonly', true);
            if (identityStates == 1) {
                var renzheng = '&nbsp;<span style="color:red;">【已认证】</span>';
                companyName.parent().append(companyName.val() + renzheng);
                //legalperson.parent().append(legalperson.val() + renzheng);
            } else if (identityStates == 2) {
                var renzheng2 = '&nbsp;<span style="color:rgb(162, 162, 91);">【你已提交认证信息,审核状态下无法修改】</span>';
                companyName.parent().html(companyName.val() + renzheng2);
                //legalperson.parent().html(legalperson.val() + renzheng2);
            }
            companyName.remove();
            //legalperson.remove();
        }
        $('.menu-box .menu-options:eq(1) .menu-options-title').addClass('current');
        addfunction();
        var rules = {}, messages = {};
        if (!iscom) {
            initWorkLive();
            init();
            rules = {
                'NICKNAME': {
                    required: true,
                    isName: true,
                    minlength: 2,
                    maxlength: 20,
                    remote: RemotePara('昵称已经存在')

                    //}, 'SEX': {
                    //    required: true
                },
                'BIRTHDAY': {
                    //                    required: true,
                    isDate: true
                },
                'MOBILE': {
                    required: true,
                    isMobile: true
                },
                'TEL': {
                    //                    required: true,
                    checkTel: true
                },
                'ADDRESS': {
                    //                    required: true,
                    minlength: 2,
                    maxlength: 100
                },
                'BACKUP_EMAIL': {
                    required: true,
                    checkEmail: true
                },
                'EDUCATIONAL': {
                    required: true,
                    maxlength: 10
                },
                'END_DATE': {
                    required: true,
                    isDate: true
                },
                'SCHOOL_NAME': {
                    required: true,
                    maxlength: 30
                },
                'FACULTIES': {
                    required: true,
                    maxlength: 30
                },
                'BEGIN_DATE': {
                    required: true,
                    isDate: true
                },
                'QQ': {
                    //                    required: true,
                    IsQQ: true
                },
                'HOBBIES_ID': {
                    required: true
                },
                'CONTACTPHONE': {
                    isMobile: true,
                    required: true
                },
                '_JOBBEGIN_DATE': {
                    isDate: true
                },
                '_JOBEND_DATE': {
                    isDate: true
                },
                'PROVINCE': {
                    provincerequired: true
                },
                'AREA_ID': {
                    required: true
                }
            };
            messages = {
                'NICKNAME': {
                    isName: "只能使用汉字或英文字母,长度大于2",
                    minlength: '只能使用汉字或英文字母,长度大于2',
                    maxlength: '只能使用汉字或英文字母,长度小于20'
                },
                'ADDRESS': {
                    minlength: '只能使用汉字或英文字母,长度大于2',
                    maxlength: '只能使用汉字或英文字母,长度小于100'
                }

            };
        } else {
            initCom();

            rules = {
                'REGCAPITAL': {
                    required: true,
                    number: true
                },
                'MEMBER_NAME': {
                    required: true,
                    maxlength: 10
                },
                'E_COMPANY_NAME': {
                    required: true,
                    minlength: 2,
                    maxlength: 100,
                    english: true
                },
                'ADDRESS': {
                    //required: true,
                    minlength: 2,
                    maxlength: 100
                },
                'TEL': {
                    //required: true,
                    checkTel: true
                },
                //'EMAIL': {
                //    required: true,
                //    checkEmail: true
                //},
                'BACKUP_EMAIL': {
                    required: true,
                    checkEmail: true
                },
                //'POSITION': {
                //    required: true
                //},
                'QQ': {
                    //required: true,
                    IsQQ: true
                },
                'ENTERPRISETYPE': {
                    required: true
                },
                'CONTACTPHONE': {
                    isMobile: true,
                    required: true
                },
                'PROVINCE': {
                    provincerequired: true
                },
                'AREA_ID': {
                    required: true
                }
                //'MOBILE': {
                //    required: true,
                //    isMobile: true
                //}
            };
            messages = {
                'MEMBER_NAME': {
                    maxlength: '只能使用汉字或英文字母,长度小于10'
                },
                'ADDRESS': {
                    minlength: '只能使用汉字或英文字母,长度大于2',
                    maxlength: '只能使用汉字或英文字母,长度小于500'
                }
            };
            if (identityStates == 0) {
                rules.COMPANY_NAME = {
                    required: true,
                    minlength: 2,
                    maxlength: 100,
                    remote: RemotePara('公司名称已经存在', function (company) {
                        var eCompany = $('#txteCompanyName');
                        if (!eCompany.val()) {
                            $.getJSON(autoUrl, { action: 'getCompanyE', keyword: company }, function (data) {
                                if (data.Success)
                                    eCompany.val(data.Data);
                            });
                        }
                    })
                };
                //                rules.LEGALPERSON = {
                //                    required: true,
                //                    isName: true
                //                };
                messages.COMPANY_NAME = {
                    minlength: '只能使用汉字或英文字母,长度大于2',
                    maxlength: '只能使用汉字或英文字母,长度小于100'
                };
                //                messages.LEGALPERSON = {
                //                    isName: '输入正确的名字'
                //                };
            }
        }
        var infoForm = $("#infoForm"),
        saveBtn = $("#saveBtn", "#infoForm");
        jQuery.validator.setDefaults({
            submitHandler: function (form) {
                if (saveBtn.hasClass('btn-disable')) {
                    return false;
                }
                if (!iscom && $('.worklive1 tbody tr').length == 0) {
                    $('#workerrordiv').parent().append('<span for="job" class="mtip-error">请至少添加一条工作经历</span>');
                    return false;
                }
                saveBtn.removeClass('btn-orange').addClass('btn-disable').html('正在提交..');
                ajaxSubmit(form, saveBtn);

                //    $(form).ajaxSubmit();
                return false;
            }
        });
        var registNextOne = $("#registNextOne", "#infoForm");
        jQuery.validator.setDefaults({
            submitHandler: function (form) {
                if (registNextOne.hasClass('btn-disable')) {
                    return false;
                }
                if (!iscom && $('.worklive1 tbody tr').length == 0) {
                    $('#workerrordiv').parent().append('<span for="job" class="mtip-error">请至少添加一条工作经历</span>');
                    return false;
                }
                registNextOne.removeClass('btn-orange').addClass('btn-disable').html('正在提交..');
                ajaxSubmit(form, registNextOne);

                //    $(form).ajaxSubmit();
                return false;
            }
        });
        infoForm.validate({
            errorClass: "mtip-error",
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
            messages: messages,
            success: function (label) {
                //失去焦点验证成功
                if ((label[0].outerHTML.indexOf('BIRTHDAY') > -1) || (label[0].outerHTML.indexOf('QQ') > -1) || (label[0].outerHTML.indexOf('JOBEND_DATE') > -1))
                    label.removeClass("mtip-error focus"); //去除出生日期，QQ，工作时间必填样式
                else
                    label.removeClass("mtip-error focus").addClass("mtip-right");
            },
            onfocusinshowspan: true,
            focusCleanup: false,
            focusinshowspanfun: function (elm) {
                //文本框得到焦点，判断后面是否需要提示信息
                var onfocusSpanVal = $(elm).attr('onfocusSpanVal');
                if (onfocusSpanVal) {
                    $(elm).removeClass('mtip-error').addClass('highlight1');
                    this.showonfocusSpan(elm, onfocusSpanVal);
                }

            }
        });

    });
    function RemotePara(msg, fn) {
        var para = {
            errMsg: msg,
            type: "post",
            url: "/Member/ashx/NameExist.ashx",
            dataType: "json"
        };
        if (fn) {
            para.sussesFn = fn;
        }
        return para;
    };
    module.exports.changWorkLive = changWorkLive;

});


