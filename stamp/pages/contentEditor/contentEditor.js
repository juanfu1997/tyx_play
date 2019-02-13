// pages/contentEditor/contentEditor.js
const initialize = require("../../private/initialize");
const {util, wxfun, authorize, request, Bar, map, tem_config} = initialize;
var app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        img: util.data.img,
        lineNum: 6,//行数
        dashLineNum: 21,//虚线行每行拥有的虚线条数
        pxArpxRate: app.globaldata.pxArpxRate,
        content: '最多输入80个字符',
        inputTip: '最多输入80个字符',
        isNewInput: true //判断是否为新的一次输入以判断是否需要清空内容
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
         //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this,'dark');
        this.setData({bar});
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.showLoading({
            title: 'loading...',
        })
        // 使用 wx.createContext 获取绘图上下文 context
        var context = wx.createCanvasContext('canvas_content')
        var dashLen = 24 * this.data.pxArpxRate;//虚线长度
        var step = 9 * this.data.pxArpxRate;//每段虚线间距
        var lineStep = 80 * this.data.pxArpxRate;//每行高度
        var lOrRStep = 23 * this.data.pxArpxRate;//最左和最右端与边缘的距离
        context.beginPath();
        context.setStrokeStyle("#a4928e");
        context.setLineWidth(1);
        for (var j = 0; j < this.data.lineNum;j++){
            for (var i = 0; i < this.data.dashLineNum; i++) {
                context.moveTo(i * dashLen + (i + 1) * step + lOrRStep, lineStep * (j+1));
                context.lineTo((i + 1) * dashLen + (i + 1) * step + lOrRStep, lineStep * (j+1));
                context.stroke();
                if (j == this.data.lineNum - 1 && i == this.data.dashLineNum - 1) {
                    context.draw();
                    setTimeout(()=>{
                        wx.hideLoading();
                    },1500);
                }
            }
        }
    },

    //监听输入
    inputContent(e){
        this.data.content = e.detail.value;
    },

    //输入框失焦
    blurContent(e){
        if (e.detail.value.length == 0) {
            this.setData({
                content: this.data.inputTip,
                isNewInput: true
            })
        }
    },

    //输入框聚焦
    focusContent(e){
        if (this.data.isNewInput){
            this.setData({
                content: '',
                isNewInput: false
            })
        }
    },

    //进入下一页并保持内容
    saveContent(e){
        this.setData({
            content:this.data.content
        })
        wx.navigateTo({
            url: '../show/show?mailContent=' + this.data.content +'&isShare='+false,
        })
    }


})