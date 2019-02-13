const initialize = require("../../../private/initialize");
const {util, wxfun, authorize, request, Bar, calendar} = initialize;

Page({
	data: {
        img: util.data.img,
        switchStatus: ""      
    },
    onLoad() {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('我的事件', pages, this, true);
        this.setData({bar});
          
    },
    goBackPage() {
        wxfun.goBackPage();
    },
    goImg() {
        wxfun.navigatePage("../img/img");
    }
});