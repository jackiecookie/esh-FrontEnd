/*
分页
*/
define(function (require, exports, module) {
    var pager = {
        url: "",
        createParams: null,
        renderTBody: null,
        fun: null,
        pageIndex: 1, //当前页面
        totalPageCount: 0,
        colspan: 0,
        initPage: null,
        firstPageLink: $("#firstPage"), //首页链接
        prePageLink: $("#prePage"), //上一页链接
        nextPageLink: $("#nextPage"), //下一页链接
        lastPageLink: $("#lastPage"), //末页链接		
        goButton: $("#goBtn"), //跳转按钮				
        btnSearch: $("#search-btn"), //查询按钮

        init: function (colspan, url, createParams, renderTBody, fun, initPage) {
            var me = pager;
            me.colspan = colspan;
            me.url = url;
            me.createParams = createParams;
            me.renderTBody = renderTBody;
            me.fun = fun;
            me.initPage = initPage;
            me.getData(1);
        },

        initClick: function () {
            var me = pager;
            me.firstPageLink.click(me.firstPageLinkClickHandler);
            me.prePageLink.click(me.prePageLinkClickHandler);
            me.nextPageLink.click(me.nextPageLinkClickHandler);
            me.lastPageLink.click(me.lastPageLinkClickHandler);
            me.goButton.click(me.goButtonClickHandler);

            $("#gotoPageNo").keydown(function (e) {
                var curkey = e.which;
                if (curkey == 13) {
                    me.goButtonClickHandler();
                    return false;
                }
            });

            me.btnSearch.click(me.btnSearchClickHandler);
        },

        /*----------------------分页相关函数 开始------------------------*/
        firstPageLinkClickHandler: function () {
            var me = pager;
            if (me.pageIndex <= 1)
                return;

            me.gotoPage(1);
        },
        prePageLinkClickHandler: function () {
            var me = pager;
            if (me.pageIndex <= 1)
                return;
            me.gotoPage(me.pageIndex - 1);
        },
        nextPageLinkClickHandler: function () {
            var me = pager;
            if (me.pageIndex >= me.totalPageCount)
                return;

            me.gotoPage(me.pageIndex + 1);
        },
        lastPageLinkClickHandler: function () {
            var me = pager;
            if (me.pageIndex >= me.totalPageCount)
                return;

            me.gotoPage(me.totalPageCount);
        },
        goButtonClickHandler: function () {
            var me = pager;
            var gotoPageNo = $("#gotoPageNo").val();

            var type = "^[0-9]*[1-9][0-9]*$";
            var re = new RegExp(type);

            if (gotoPageNo == "" || gotoPageNo.match(re) == null || gotoPageNo == 0 || gotoPageNo > me.totalPageCount) {
                alert("请输入正确的页码!");
                return false;
            }

            me.gotoPage(gotoPageNo);
        },
        renderPagedLinks: function (pagedList) {
            var me = pager;

            me.pageIndex = pagedList.pageIndex;
            me.totalPageCount = pagedList.totalPageCount;

            if (me.totalPageCount <= 1) {
                me.totalPageCount = 1;
                $("#pageNav").hide();
            } else {
                $("#pageNav").show();
            }

            $("#totalPage").replaceWith("<strong id='totalPage'>共" + me.totalPageCount + "页 </strong>");
            $("#gotoPageNo").val(me.pageIndex);
            $("#totalCount").val(pagedList.totalCount);

            if (me.pageIndex <= 1) {
                me.firstPageLink.attr('style', 'color: gray;');
                me.prePageLink.attr('style', 'color: gray;');
            } else {
                me.firstPageLink.removeAttr('style');
                me.prePageLink.removeAttr('style');
            }

            if (me.pageIndex >= me.totalPageCount) {
                me.nextPageLink.attr('style', 'color: gray;');
                me.lastPageLink.attr('style', 'color: gray;');
            } else {
                me.nextPageLink.removeAttr('style');
                me.lastPageLink.removeAttr('style');
            }
        },

        gotoPage: function (pageIndex) {
            var me = pager;
            me.getData(pageIndex);
        },

        /*----------------------列表相关函数 开始------------------------*/
        btnSearchClickHandler: function () {
            var me = pager;
            $(".submbitloading").html('<tr><td colspan="' + me.colspan + '"><div class="tableLoading"></div></td></tr>');
            $("#pageNav").hide();
            return false;
        },
        // fun:在渲染完分页以后执行的方法
        getData: function (pageIndex, IsDel) {
            var me = pager;
            $.getJSON(me.url + "?" + me.classToString(me.createParams(pageIndex)) + "&timestamp=" + new Date().valueOf(), '',
                function (QueryOutput) {
                    if (QueryOutput.Success == true) {
                        me.renderTBody(QueryOutput.pagedList.list, IsDel, QueryOutput.IsZb);
                        if (me.initPage) me.initPage(QueryOutput.pagedList);
                        else {
                            me.renderPagedLinks(QueryOutput.pagedList);
                        }
                        if (me.fun) me.fun(QueryOutput.pagedList);
                    } else {
                        if (QueryOutput.VipStr) {
                            me.renderTBody(QueryOutput);
                        } else
                            alert(QueryOutput.Message);
                    }
                });
        },

        //该函数作用为：将ajax参数由类方式转换成a=1&b=2的方式，否则使用encodeURIComponent转码后的中文
        classToString: function (data) {
            var info = "";
            $.each(data, function (key, value) {
                info += key + "=" + value + "&";
            });
            return info;
        }
    };
    module.exports = pager;
});




