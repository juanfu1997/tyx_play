const util = require("../../utils/util");
const wxfun = require("../../utils/wxfun");

function Bar(title, pages=[], _this, isDark) {
	this.icon = isDark ? "../../images/pre_dark.png" : "../../images/pre.png";
    this.titleHeight = wxfun.getBarHeight();
    this.title = title;
    //是否隐藏返回箭头
    this.hideArrow = pages.length >= 2 ? false : true;
    _this.goBackPage = wxfun.goBackPage;
}

module.exports = Bar;