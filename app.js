App({
	data: {
		img: 'https://www.korjo.cn/xcx/tyx_playImg/', //ftp文件夹，放图片
		host: 'https://www.korjo.cn', //域名
		appid: 122, //korjo.cn密钥管理里该小程序的id
		userid: 'playuser',
		template_id: "4LxDOdet0V8eZ_CYbBa0zvAg6HbO_Fpdm1PpbYMq6_8"
	},
    onLaunch(){
        var that = this;
        //初始化像素比
        wx.getSystemInfo({
            success: function (res) {
                that.globaldata.pxArpxRate = res.windowWidth * 1.0 / 750
            },
        })
        //加载所有地区列表
        this.getAreaList((re)=>{
            that.globaldata.areas = re.data;
        },(r)=>{
            // console.log("加载所有地区列表失败！");
        },(r)=>{

        })
    },
    globaldata: {
        baseUrl: "https://www.korjo.cn/xcx/poststamp/",
        staticBaseUrl: "https://www.korjo.cn",
        areas: [],
        pxArpxRate: 0,//像素比，px/rpx
        area: '',
        picUrl: '',
        stampUrl: '',
        defaultPic: 'https://www.korjo.cn/Upload/System/korjo/Images/defaultPic.jpg',
        defaultStamp: 'https://www.korjo.cn/Upload/System/korjo/Images/defaultStamp.png'

    },
    getAreaList(successed, failed, completed){
        wx.showLoading({
            title: 'loading...',
        })
        wx.request({
          url: 'https://www.korjo.cn/korjoApi/GetSendLetterCountryList',
            success(res) {
                if (typeof (successed) == 'function')
                    successed(res);
            },
            fail: function (r) {
                if (typeof (failed) == 'function')
                    failed(r);
            },
            complete(r) {
                wx.hideLoading();
                if (typeof (completed) == 'function') {
                    completed(r);
                }
            }
        })
    }
});