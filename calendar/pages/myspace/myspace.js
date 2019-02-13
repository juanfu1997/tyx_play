const initialize = require("../../../private/initialize");
const {util, wxfun, authorize, request, Bar, calendar} = initialize;

Page({
	data: {
        img: util.data.img + "calendar/"      
    },
    onLoad() {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下万年历', pages, this, true);
        this.setData({bar});
          
    },
    goBackPage() {
        wxfun.goBackPage();
    }
});