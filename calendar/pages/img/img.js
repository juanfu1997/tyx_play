const initialize = require("../../../private/initialize");
const {util, wxfun, authorize, request, Bar, calendar} = initialize;

Page({
	data: {
        img: util.data.img + "calendar/"      
    },
    onLoad() {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('设置万年历背景', pages, this, true);
        this.setData({bar});
        this.getImgs();          
    },
    getImgs() {
        const list = [];
        list.length = 9;
        this.setData({list});
    },
    goBackPage() {
        wxfun.goBackPage();
    },
    onShareAppMessage(res) {
        return {
            title: '亭驿下万年历',
        }
    }
});