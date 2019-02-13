const util = require("../../utils/util");
const wxfun = require("../../utils/wxfun");

//alert 的属性
let alertObj = {
    hint: "",
    title: "提示",
    show: false
};

//alert 方法
const fns = {};

fns.showAlert = function(hint, fun) {
    const alert = this.data.alert;
    alert.hint = hint;
    alert.show = true;
    alert.hasCancel = fun ? true : false;
    //点击确认的callback
    if (typeof fun === "function") {
        alert.fun = fun;
    }
    this.setData({alert})
}

fns.conform = function(e) {
    const alert = this.data.alert;
    alert.show = false;
    alert.hint = "";
    const {modal} = wxfun.getDataset(e);
    if (modal) {
        alert.fun();
    }
    this.setData({alert})
}

fns.cancel = fns.conform;

function alert() {
    const pages = getCurrentPages()
    const _this = pages[pages.length - 1];
    Object.assign(_this, fns);
    _this.setData({alert: alertObj})
}

module.exports = {
	alert
}

    

