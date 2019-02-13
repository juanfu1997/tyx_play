//index.js
//获取应用实例
const initialize = require("../../private/initialize");
const {util, wxfun, authorize, request, Bar, map, tem_config} = initialize;

Page({
    data: {
        baseUrl: util.globaldata.baseUrl
    },
    //跳转
    bindStartBtn: function () {
        wx.navigateTo({
            url: '../sample/sample',
        })
    },
    //分享
    onShareAppMessage:function(){

    },
    //点击ufo图标
    onTapUFO() {
      const url = 'http://www.korjo.cn/xcx/loveImg/qrcode.jpg?v=' + (+new Date)
        wx.previewImage({
            urls: [url] // 需要预览的图片http链接列表
        })
    },
    onLoad: function () {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        this.setData({bar});
    },
})
