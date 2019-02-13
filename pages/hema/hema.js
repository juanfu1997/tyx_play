const initialize = require("../../private/initialize");
const {util, wxfun, request, Bar} = initialize;

Page({
	data: {
        img: util.data.img,
        isModalShow: false,
        info: {}
    },
    onLoad(options) {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        this.setData({bar});
    	if (options.q) {
    		const url = decodeURIComponent(options.q);
    		const query = util.deparam(url.split('?')[1]);
    		this.getUniquecodesInfo(Number(query.id));
    	} else {
            wxfun.goHome();
        }
    },
    getUniquecodesInfo(id) {
        request.GetUniquecode(id).then(res => {
            if (res.id) {
                this.setData({info: res});
            }
        });
    },
    goHome() {
        wxfun.navigatePage('../index/index');
    },
    downloadPhoto() {
        this.checkSetting(this.savePhoto);
    },
    savePhoto() {
        util.loading();
        wx.downloadFile({
            url: this.data.info.picture,
            success(response) {
                wx.saveImageToPhotosAlbum({
                    filePath: response.tempFilePath,
                    success() {
                        util.hideLoading();
                        wxfun.toast('已保存到手机相册');
                    },
                    fail() {
                        util.hideLoading();
                    }
                });
            }
        });
    },
    checkSetting(callback) {
        const that = this;
        wx.getSetting({
            success(res) {
                const canSave = res.authSetting['scope.writePhotosAlbum'];
                console.log(res)
                if (canSave === true || canSave === undefined) {
                    callback();
                } else {
                    that.setData({isModalShow: true});
                }
            }
        });
    },
    getSetting(e) {
        const canSave = e.detail.authSetting['scope.writePhotosAlbum'];
        if (canSave === true) {
            this.setData({isModalShow: false});
            this.savePhoto();
        }
    },
    reject() {
        this.setData({isModalShow: false});
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