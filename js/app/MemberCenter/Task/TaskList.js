define(['jQueryAjax', 'btnLoading', 'layerExt'], function (require, exports, module) {
    require('jQueryAjax');
    var btnLoading = require('btnLoading'), layer = require('layerExt'), alertify, tip;
    require.async(['alertify', 'js/common/Tip/Tip'], function (obj1, obj2) {
        alertify = obj1; tip = obj2;
    });
    //从外面注入搜索条件
    var searchPara;
    exports.setPara = function (para) {
        searchPara = para;
    };
    //  添加当前搜索条件标识
    var addSearchCur = function () {
        var currState = $('#currState'), currTaskType = $('#currTaskType'), taskStatedd = $('#taskStatedd a[data-state=' + currState.val() + ']'), taskNamedd = $('#taskNamedd a[data-state=' + currTaskType.val() + ']');
        if (taskStatedd.length == 1) {
            taskStatedd.addClass('cur');
        } else {
            $('#taskStatedd').find('a:eq(0)').addClass('cur');
        }
        if (taskNamedd.length == 1) {
            taskNamedd.addClass('cur');
        } else {
            $('#taskNamedd').find('a:eq(0)').addClass('cur');
        }

    };
    var getTaskList = function (action) {
        searchPara.action = action;
        searchPara.mid = $('#mid').val();
        $.ajaxjson('/MemberCenter/TaskList/ashx/GetTaskList.ashx', searchPara, function (data) {
            if (data.Success) {
                $('#contentBox').html(data.Data);
                reloadAction = action;
            }
        });
    };

    var reloadAction = $('.time-down')[0] ? 'axle' : 'list';
    //初始化按钮的事件
    var initbtn = function () {
        var $pDiv = $('#contentBox');
        //刷新列表等按钮
        $pDiv.on('click', '.user-ed a', function () {
            var atitle = $(this).attr('title'), action;
            switch (atitle) {
                case '刷新':
                    action = reloadAction;
                    break;
                case '时间轴':
                    action = 'axle';
                    break;
                case '列表':
                    action = 'list';
                    break;
            }
            if (action) {
                getTaskList(action);
            }
        });
        //删除任务
        $pDiv.on('click', '.delTask', function () {
            sendRequest('deldemadn', $(this));
        });
        //托管赏金
        $pDiv.on('click', '.trusteeship', function () {
            sendRequest('trusteeship', $(this));
        });
        //关闭
        $pDiv.on('click', '.closeTheTask', function () {
            sendRequest('closeTheTask', $(this));
        });
        //申请退款
        $pDiv.on('click', '.taskrefund', function () {
            var self = $(this);
            layer.prompt({ title: '请填写您的退款理由', type: 3 }, function (val, index) {
                sendRequest('refunds', self, { liyou: val });
                layer.close(index);
            });
        });
        //查看驳回理由
        $pDiv.on('click', '.rejectreason', function () {
            sendRequest('rejectreason', $(this));
        });

        var sendRequest = function (action, $btn, para) {
            para = para || new Object();
            var id = $btn.attr('data_id');
            var isloading = btnLoading({
                obj: $btn,
                addClass: "disabled"
            });
            para.id = id;
            para.action = action;
         
            $.getJSON('/MemberCenter/TaskList/ashx/TaskHandle.ashx', para, function (data) {
                btnLoading.reset($btn);
                if (data.Success) {
                    //删除表格
                    if (action == "deldemadn") {
                        $btn.parents('.clearfix:eq(0)').remove();
                        tip('删除成功', 3000, "success");
                    } else if (action == "trusteeship") {
                        $btn.parents('.t-user-pub').find('.stopno').html('<u class=""><span class="mr5 ml5">-</span>正在竞标</u>');
                        $btn.remove();
                        tip('赏金已经成功托管', 3000, "success");
                    } else if (action == 'closeTheTask') {
                        tip('任务已成功关闭', 3000, "success");
                        $btn.parents('.t-user-pub').find('.stopno').html('<u class=""><span class="mr5 ml5">-</span>交易关闭</u>');
                        $btn.text('重新编辑').attr('href', '/Demand/StepAll/' + id).removeClass('closeTheTask');
                    } else if (action == 'refunds') {
                        //如果是重新退款的话刷新列表
                        tip('申请退款成功', 3000, "success");
                        if (searchPara.Status == 8) {
                            getTaskList(reloadAction);
                        } else {
                            $btn.parents('.t-user-pub').find('.stopno').html('<u class=""><span class="mr5 ml5">-</span>正在申请退款</u>');
                            $btn.remove();
                        }
                    } else if (action == 'rejectreason') {
                        layer.alert('退款失败理由为:' + data.Data);
                    }
                } else {
                    if (data.state) {
                        if (data.state == -10) {
                            alertify.rechang();
                        }
                    }
                }
            });
        };
    };
    $(function () {
        $('#mytask').addClass('cur');
        addSearchCur();
        initbtn();

    });

});