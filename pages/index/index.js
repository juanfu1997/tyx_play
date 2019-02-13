const initialize = require("../../private/initialize");
const {util, wxfun, authorize, request, Bar} = initialize;

Page({
	data: {
        img: util.data.img       
    },
    onLoad() {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        this.setData({bar});    
    },
    goList() {
        wxfun.navigatePage('../list/list');
    },
    onShareAppMessage(res) {
        //如果有更改活动，需要更改分享图
        const imageUrl = "../../images/share.jpg";
        return {
            title: '我与盒马有个约会',
            imageUrl
        }
    }
});