define(['jquery', 'layerExt'], function (require, exports, module) {
    var layer = require('layerExt');
    var statisticsCountry = $('#statisticsCountry').html(), saSupplier = $('#saSupplier').html(), saBuyer = $('#saBuyer').html(), chinaSupplier = $('#chinaSupplierDiv').html();
    var supplierOutHtml = '<div class="bg_map"><p>销往各国的供应商</p><ul>{0}<div class="clear"></div></ul></div>';
    var moreCountry = '<div class="bg_map"><p><a href="javascript:void(0)" class="dataMoreCountry">更多国家</a></p></div>';
    var supplierCountry = chinaSupplier + statisticsCountry + supplierOutHtml.replace('{0}', ($('#usa_russia_Supplier').html() + saSupplier)) + moreCountry;
    var buyerCountry = saBuyer + statisticsCountry + $('#usa_russia_Buyer').html() + moreCountry;
    var hasPriceBuyer = saBuyer + statisticsCountry + moreCountry;
    var hasPriceSupplier = statisticsCountry + chinaSupplier + supplierOutHtml.replace('{0}', (saSupplier)) + moreCountry;
    $('.m-dlwb .buyCountry').click(function () {
        larerShow(buyerCountry, '采购商');
    });
    $('.m-dlwb .supplierCountry').click(function () {
        larerShow(supplierCountry, '供应商');
    });

    $('.m-dlwb #priceSupplier').click(function () {
        larerShow(hasPriceSupplier, '含有单价的供应商');
    });

    $('.m-dlwb #hasPriceBuyer').click(function () {
        larerShow(hasPriceBuyer, '含有单价的采购商');
    });


    $('.map .dataMoreCountry').live('click', function() {
        $.layer({
            type: 1,
            title: false,
            fix: false,
            area: ['800px', '550px'],
            border: [0],
            fadeIn: 300,
            page: {
                html: '<img src="/Static/Images/DataImg/Not-online.png" alt="未上线国家" />'
            }
        });
    });
 
    var larerShow = function (html, title) {
        html = ' <div class="map">' + html + '</div>';
        $.layer({
            type: 1,
            title: title,
            shadeClose: false,
            fix: false,
            shift: 'top',
            border: [0],
            area: ['auto', 'auto'],
            page: { html: html }
        });
    };
    $('.m-dlwb .TabTitle3 .litab').mouseover(function () {
        var self = $(this);
        self.addClass('active');
        self.siblings('.litab').removeClass('active');
        var index = self.attr('index');
        $('.Tabcontent:eq(' + index + ')').removeClass('none').siblings('.Tabcontent').addClass('none'); ;
    });
});