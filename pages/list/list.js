const initialize = require("../../private/initialize");
const {util, wxfun, authorize, request, Bar, alert} = initialize;

Page({
	data: {
        img: util.data.img,
        show: ''   
    },
    onLoad() {
        alert();//获取alert模板数据与方法
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        this.setData({bar});
    },
    goPhoto() {
        wxfun.navigatePage('../getphoto/getphoto');
    },
    goCalorie() {
        wxfun.navigatePage('/calorie/pages/bmi/bmi');
    },
    goLove() {
        wxfun.navigatePage('/love/pages/index/index');
    },
    goSize() {
        const appId = "wx2a5f7da038ec804d";
        const path = "pages/size/size";
        const name = "看穿你的SIZE";
        this.navToProgram(appId, path, name)
    },
    goEye() {
        const appId = "wxdc153461eca01f8b";
        const path = "pages/Eye/index/index";
        const name = "你有千里眼吗";
        this.navToProgram(appId, path, name)
    },
    navToProgram(appId, path, name) {
        const hint = "即将跳转到“" + name + "”\n您可以点击右上角的关闭按钮\n返回“亭驿下玩玩玩”";
        this.showAlert(hint, () => {
            wxfun.goMiniProgram(appId, path);
        });
    },
    goList() {
        this.setData({show: 'show'});
        setTimeout(() => {
            this.setData({show: ''});
        }, 2000);
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