const initialize = require("../../private/initialize");
const {util, wxfun, authorize, request, Bar, map, tem_config} = initialize;

var app = util;
// var util = require('../../utils/util.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        img:util.data.img,
        letterPaper:util.data.img + 'postcard_example_back.jpg',
        config:[],
        configIndex:0,
        baseUrl: app.globaldata.baseUrl,
        picUrl: util.data.img + 'tyx_positiveImg.jpg',//明信片背景图片地址
        contentPicUrl: app.globaldata.baseUrl + 'postcard_example_back.jpg',//信纸
        picFrameUrl: app.globaldata.baseUrl + 'photoframe1.png',//圆形图的框
        pxArpxRate: app.globaldata.pxArpxRate,//像素比
        area: '',//地区
        stampUrl: util.data.img + 'tyx_stamp.png',//邮票
        tapOdd: false//用于判断定位图标是否被点击，根据这个执行定位图标的动画
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        this.setData({bar});

        // this.configInitialize(tem_config.config_tyx);
        new tem_config()
        var config = this.data.config;
        var _config_ = this.data._config_;
        var configIndex = this.data.configIndex;
        // util.each(_config_,(i,v)=>{
        //     config.push(v)
        // })

        that.setData({config})
        that.configInitialize(config[configIndex]);
        that.locateInitialize();
        // console.log(config.length)
        // tem_config.exportConfig()
        // tem_config.addtext()
        //定位
        // that.locate();
    },

    //切换模板时，切换配置信息
    getPickerValue(e){
        var config = this.data.config;
        var configIndex = this.data.configIndex;
        configIndex = e.detail.value
        this.setData({ configIndex });
        wxfun.store('configIndex',configIndex)

        this.locateInitialize();
        this.configInitialize(config[configIndex]);
    },
    locateInitialize(){
        var that = this;
        var config = this.data.config;
        var _config_ = this.data._config_;
        var configIndex = this.data.configIndex;
        if(config[configIndex].config=='config_korjo'){
            that.setData({ img:'' });
            that.locate();
        }else{
            that.setData({ img:util.data.img,area:config[configIndex].config_title });
        }
        console.log('img',that.data.img+that.data.picUrl)
    },
    //初始化配置信息
    configInitialize(config){
        var that = this;
        that.setData({
            config_title:config.config_title,
            picUrl:that.data.img + config.positiveImg,
            fontStyle:config.fontStyle,
            stampUrl: that.data.img + config.stamp,
            postmark:config.postmark,
            letterPaper: that.data.img + config.letterPaper
        })
        console.log('config11',config)
    },
    // 保存当前配置信息
    saveCurrentConfig(){
        var that = this;
        var config = that.data.config;
        var configIndex = that.data.configIndex;
        var config_title = that.data.config_title;
        var picUrl = that.data.picUrl;
        var stampUrl = that.data.stampUrl;
        var postmark = that.data.postmark;
        var letterPaper = that.data.letterPaper;

        if(config[configIndex].config=="config_korjo"){

            postmark = 'https://www.korjo.cn/xcx/poststamp/' + postmark;
        }else{
            // picUrl = that.data.img + picUrl;
            // stampUrl = that.data.img + stampUrl;
            postmark = that.data.img + postmark;
            // letterPaper = that.data.img + letterPaper;
        }

        var currentConfig = {
            config : config[configIndex].config,
            config_logo:config[configIndex].config_logo,
            config_title : config_title,
            fontStyle:config[configIndex].fontStyle,
            positiveImg : picUrl,
            stamp : stampUrl,
            postmark : postmark,
            letterPaper : letterPaper
        }
        wxfun.store('currentConfig',currentConfig)
    },
    //定位
    locate:function(){
        var that = this;
        that.setData({
            tapOdd: !that.data.tapOdd
        })
        wx.showLoading({
            title: 'loading...',
        })
        //获取坐标
        map.getLocationRes((r) => {
            var lat = r.latitude;
            var lon = r.longitude;
            var loc = lat + ',' + lon;
            //根据坐标转换为地址，国家或省市
            map.getAddressByLocation(loc, (re) => {
                //获取国家名
                var nation = re.data.result.ad_info.nation;
                //获取省市
                var pro = re.data.result.ad_info.province;
                var areaName = nation;
                if (nation == '中国') {
                    //这里因为我们服务器上的北京市只写为北京，其他市也是，所以要去除市这个字才能拿到图片
                    if (pro.lastIndexOf('市') == pro.length-1){
                        pro = pro.substring(0,pro.length-1);
                    }
                    areaName = pro;
                    //获取图片和邮票
                    that.getPicAndStamp(pro);
                    //存在缓存里
                    map.setAddress(nation + ' ' + pro);
                } else {
                    map.setAddress(nation);
                    //获取图片和邮票
                    that.getPicAndStamp(areaName);
                }
                that.setData({
                    area: areaName
                })

            }, (r) => {
                //失败，使用默认
                that.initPicAndStamp();
                // console.log("坐标地址转换失败！");
            }, (r) => {
            });
        }, (r) => {
            //失败，使用默认
            that.initPicAndStamp();
            wx.showModal({
                title: '提示',
                content: '定位失败！请重新打开小程序！',
            })
            // console.log("获取坐标失败！");
        }, (r) => {

        });
    },

    //获取图片和邮票
    getPicAndStamp(areaName){
        var that = this;
        //传入地区名获取该地区图片和邮票
        map.getPicAndStampByAreaName(areaName, (ress) => {
            var picUrl = ress.data.postcard_image;
            var stampUrl = ress.data.stamp;
            if (picUrl.search(app.globaldata.staticBaseUrl) < 0) {
                picUrl = app.globaldata.staticBaseUrl + picUrl;
            }
            if (stampUrl.search(app.globaldata.staticBaseUrl) < 0) {
                stampUrl = app.globaldata.staticBaseUrl + stampUrl;
            }
            //保存图片
            map.setPicUrl(picUrl);
            map.setStampUrl(stampUrl);
            that.setData({
                picUrl: picUrl,
                stampUrl: stampUrl
            })
            wx.hideLoading();
        }, (r) => {
            //失败，使用默认
            that.initPicAndStamp();
            // console.log("获取该地区图片和邮票失败！");
        }, (r) => {
        })
    },

    //使用默认图片和邮票
    initPicAndStamp: function () {
        var that = this;
        //保存图片和邮票
        map.setPicUrl(app.globaldata.defaultPic);
        map.setStampUrl(app.globaldata.defaultStamp);
        that.setData({
            picUrl: app.globaldata.defaultPic,
            stampUrl: app.globaldata.defaultStamp
        })
        wx.hideLoading();
    },



    //跳转
    bindFillBtn: function(){
        this.saveCurrentConfig();
        wx.navigateTo({
            url: '../contentEditor/contentEditor',
        })
    }

})