const initialize = require("../../private/initialize");
const {util, wxfun, authorize, request, Bar} = initialize;

Page({
	data: {
        img: util.data.img       
    },
    onLoad(options) {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        const res = wx.getSystemInfoSync();
        this.setData({bar, swiperH: res.windowHeight - bar.titleHeight});
        this.getUserId();
    },
    goNext() {
        let {current} = this.data;
        current = current == 1 ? 0 : 1;
        this.setData({current});
    },
    getUserId() {
        const userid = wxfun.getStored(util.data.userid);
        if (userid) {
            this.disGetUserBtn();
            return;
        } 
        authorize.isLogin({
            success: (openid) => {
                this.data.openid = openid;
                this.checkOpenid(openid);
            }
        })
    },
    ableGetUserBtn() {
        this.setData({getUserInfo: 'getUserInfo'});
    },
    disGetUserBtn() {
        this.setData({getUserInfo: ''});
    },
    changeSwiper(e) {
        const current = e.detail.current;
        let bg = '';
        //第二个swiper item背景图不一样
        if (current == 1) {
            bg = 'bg02';
        }
        this.setData({bg, current});
    },
    goPhoto() {
        const getUserInfo = this.data.getUserInfo;
        if (!getUserInfo) {
            wxfun.navigatePage("../photo/photo");
        }
    },
    getUser(e) {
        const userObj = e.detail.userInfo || {};
        if (userObj.avatarUrl) {
            this.saveUser(userObj);
        }
    },
    saveUser(userInfo) {
        if (userInfo.nickName) {
            const data = {
                username: userInfo.nickName,
                photo: userInfo.avatarUrl,
                openid: this.data.openid
            }
            request.SaveUser(data).then(res => {
                if (res.id) {
                   wxfun.store(util.data.userid, res.id);
                   wxfun.navigatePage("../photo/photo");
                   this.disGetUserBtn();
                }
            })
        }
    },
    checkOpenid(openid) {
        request.GetUserInfoByOpenId(openid).then(res => {
            if (!res.id) {
                //还未注册
                this.ableGetUserBtn();               
            } else {
                this.disGetUserBtn();
                wxfun.store(util.data.userid, res.id);
            }
        });
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