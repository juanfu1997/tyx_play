// pages/show/show.js
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
        configIndex:'',
        config:[],
        baseUrl: app.globaldata.baseUrl,
        rotateAngle: 90,//页面旋转角度
        tri_icon1_rotate: 180,//三角型图标旋转角度
        hiddenGC: false,
        windowWidth: 750,//宽度，rpx
        windowHeight: 0,//高度，rpx
        rate: getApp().globaldata.pxArpxRate,
        mailContent: "",//内容
        picUrl: '',//明信片图片url
        stampUrl: '',//邮票图片
        picFrameUrl: 'http://www.korjo.cn/xcx/poststamp/photoframe1.png',//反面圆形图片的图片框的url
        hiddenCover: true,//判断是否显示刚进入时的蒙层
        triBtnText: '点击查看\n明信片正面',
        address: '未知地点',
        date: '2017/11/21',
        hiddenShareCover: true,//判断是否显示分享蒙层
        isShare: false//判断是否为分享
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this, true);
        this.setData({bar});

        var that = this;
        var currentConfig = wxfun.getStored('currentConfig')
        var configIndex = wxfun.getStored('configIndex') || 0;
        options.isShare = options.isShare=='false'?false:true;
        new tem_config();
        this.configInitialize(currentConfig);
        console.log('options',options.isShare)
        //设置填写的内容
        that.setData({
            mailContent: options.mailContent,
            currentConfig,
            configIndex,
        })

        //获取屏幕大小
        wx.getSystemInfo({
            success: function (res) {
                console.log('info',res)
                that.setData({
                    windowHeight: (res.windowHeight-that.data.bar.titleHeight) / that.data.rate
                })
                //绘制虚线
                that.drawDashLine();
            }
        })
        wx.showLoading({
            title: 'loading...',
        })
        that.setData({
            isShare: options.isShare
        })
        //不是分享页
        if (!options.isShare) {
        console.log('不是分享页',typeof(options.isShare))
            //弹出提示
            that.drawMask();
            //获取位置
            wx.getStorage({
                key: 'address',
                success: function (res) {
                    if (res.data.length > 0) {
                        that.setData({
                            address: res.data
                        })
                    }
                }
            })

            that.setData({
                date: util.formatTime(new Date()),
                hiddenCover: false
            })

            //绘制分享提示弹层
            that.drawShareCover();
            wx.hideLoading();
        } else {//此时为分享页
            console.log('是分享页',typeof(options.isShare))
            that.setData({
                address: options.address,
                date: options.date,
                stampUrl: options.stampUrl,
                picUrl: options.picUrl
            })
            wx.hideLoading();
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    //初始化配置信息
    configInitialize(config){
        var that = this;
        that.setData({
            config_title:config.config_title,
            config_logo: that.data.img + config.config_logo,
            picUrl:config.positiveImg,
            fontStyle:config.fontStyle,
            stampUrl:config.stamp,
            postmark:config.postmark,
            letterPaper:config.letterPaper
        })
        console.log('config11',config)
    },

    //绘制虚线
    drawDashLine: function () {
        var that = this;
        //绘制文本的虚线
        // 使用 wx.createContext 获取绘图上下文 context
        var lineLength = this.data.windowHeight * 0.84 * 0.49 * 0.9;//每行虚线长度
        console.log('lineLength',this.data.rate);
        if(lineLength==Infinity){return;}
        var lineNum = 5;//行数
        var dashLen = 10 * this.data.rate;//每段虚线长度
        var step = 8 * this.data.rate;//每段虚线间距
        var dashLineNum = Math.floor(lineLength / 18);//虚线行每行拥有的虚线条数
        var context = wx.createCanvasContext('mailContentCanvas')
        var lineStep = 50 * this.data.rate;//每行高度
        context.setStrokeStyle("#a4928e");
        context.setLineWidth(1);
        context.rotate(-90 * Math.PI / 180, 0, 0);
        context.translate(-(this.data.windowHeight * 0.84 * 0.49 * 0.9) * this.data.rate, 0);
        context.beginPath();
        console.log('lineNum',lineNum);
        var y;
        for (var j = 0; j < lineNum; j++) {
            y = lineStep * (j + 1);
            for (var i = 0; i < dashLineNum; i++) {
                context.moveTo(i * dashLen + (i + 1) * step, y);
                context.lineTo((i + 1) * dashLen + (i + 1) * step, y);
                context.stroke();
            }
            if (j == lineNum - 1) {
                context.draw();
            }
        }
    },

    //绘制刚编辑完成时的弹层
    drawMask: function () {
        var that = this;
        //绘制弹层coverCanvas
        var coverContext = wx.createCanvasContext('coverCanvas');
        coverContext.setFillStyle('rgba(0, 0, 0, 0.5)');
        coverContext.fillRect(0, 0, that.data.windowWidth * that.data.rate, that.data.windowHeight * that.data.rate);
        wx.downloadFile({
          url: "https://www.korjo.cn/Upload/System/korjo/Images/tip_icon1.png",
            success: function (re) {
                coverContext.drawImage(re.tempFilePath, 320 * that.data.rate, 285 * that.data.rate, 180 * that.data.rate, 130 * that.data.rate);
                coverContext.setFillStyle('rgba(255, 255, 255, 1)');
                coverContext.setTextAlign('center');
                coverContext.setFontSize(30 * that.data.rate);
                coverContext.fillText('您的明信片已经制作完毕', 375 * that.data.rate, 455 * that.data.rate);
                coverContext.fillText('请将手机放置横屏', 375 * that.data.rate, 495 * that.data.rate);
                coverContext.fillText('观看效果更好', 375 * that.data.rate, 535 * that.data.rate);
                coverContext.fillText('点击邮票可以放大查看哦(>_<)', 375 * that.data.rate, 575 * that.data.rate);
                coverContext.draw();
            },
            fail:function(r){
                // console.log("提示绘制失败");
            },
            complete(re) {
                // console.log("返回的蒙板路径：" + re.tempFilePath);
            }
        })
    },

    //绘制点击分享按钮时的弹层 所有位置信息通过计算得到，具体由css的定位宽高距离这些计算得到
    drawShareCover: function () {
        var that = this;
        //绘制弹层sharecoverCanvas
        var sharecoverContext = wx.createCanvasContext('sharecoverCanvas');
        sharecoverContext.setFillStyle('rgba(0, 0, 0, 0.8)');
        sharecoverContext.rotate(-90 * Math.PI / 180, 0, 0);
        sharecoverContext.translate(-that.data.windowHeight * that.data.rate, 0);
        sharecoverContext.fillRect(0, 0, that.data.windowHeight * that.data.rate, that.data.windowWidth * that.data.rate);
        wx.downloadFile({
          url: "https://www.korjo.cn/Upload/System/korjo/Images/shareText.png",
            success: function (re) {
                //提示图片宽度高度：248:527
                var r = 527.0 / 248.0;
                var w = 300;//提示图宽度
                sharecoverContext.drawImage(re.tempFilePath, (that.data.windowHeight - w * r - 140) * that.data.rate, (that.data.windowWidth - w - 80) * that.data.rate, w * r * that.data.rate, w * that.data.rate);
                sharecoverContext.setFillStyle('rgba(255, 255, 255, 1)');
                sharecoverContext.setTextAlign('center');
                sharecoverContext.setFontSize(30 * that.data.rate);
                sharecoverContext.fillText('快把明信片分享给你的好友吧！', (that.data.windowHeight / 2) * that.data.rate, (that.data.windowWidth - w - 120) * that.data.rate);
                sharecoverContext.draw();
            }
        })
    },

    /**
     * 用户点击右上角分享
     * 参数：
     * isShare：用于判断是否是分享页
     * address: 地区
     * date: 日期
     * stampUrl: 邮票
     * picUrl: 明信片图片
     * mailContent 内容
     */
    onShareAppMessage: function () {
        var that = this;
        return {
            title: '朋友寄给你一张明信片,请查收!',
            path: '/pages/show/show?isShare=true&address=' + that.data.address + '&date=' + that.data.date + '&stampUrl=' + that.data.stampUrl + '&picUrl=' + that.data.picUrl + '&mailContent=' + that.data.mailContent,
            imageUrl: that.data.picUrl,
            success: function (res) {
                // 转发成功
                // console.log('isShare=true&address=' + that.data.address + '&date=' + that.data.date + '&stampUrl=' + that.data.stampUrl + '&picUrl=' + that.data.picUrl + '&mailContent=' + that.data.mailContent,)
            },
            fail: function (res) {
                // 转发失败
            },
            complete(){
                // console.log('isShare=true&address=' + that.data.address + '&date=' + that.data.date + '&stampUrl=' + that.data.stampUrl + '&picUrl=' + that.data.picUrl + '&mailContent=' + that.data.mailContent,)

            },
        }
    },

    //重新编辑内容
    bindEditBtn(e) {
        wx.navigateBack({
            delta: 1
        })
    },

    //翻面
    bindTurnBtn(e) {
        this.setData({
            hiddenGC: !this.data.hiddenGC
        })
        if (this.data.hiddenGC) {
            this.setData({
                triBtnText: '点击查看\n明信片反面'
            })
        } else {
            this.setData({
                triBtnText: '点击查看\n明信片正面'
            })
        }
    },

    //分享
    bindShareBtn(e) {
        this.setData({
            hiddenShareCover: false
        })
    },

    //单击刚进来时的蒙层
    tapCover(e) {
        this.setData({
            hiddenCover: true
        })
    },

    //单击分享蒙层
    tapShareCover(e) {
        this.setData({
            hiddenShareCover: true
        })
    },

    //单击邮票
    onStamp(e){
        wx.previewImage({
            urls: [this.data.stampUrl],
        })
    }

})