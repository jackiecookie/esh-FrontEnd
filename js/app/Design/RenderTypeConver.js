define([], function (require, exports, module) {

    exports.renderTypeConver = function (renderType) {
        var typeName;
        switch (renderType) {
            case "nullxnull":
                typeName = "未设置";
                break;
            case "500x300":
                typeName = "草图";
                break;
            case "1000x600":
                typeName = "小图";
                break;
            case "2000x1200":
                typeName = "中图";
                break;
            case "4000x2400":
                typeName = "大图";
                break;
            case "3500x3500":
                typeName = "全景图";
                break;
        }
        return typeName;
    };


})