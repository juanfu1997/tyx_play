//index.js
const app = getApp()
const { util, wxfun, authorize, request, Bar } = require('../../private/initialize')

Page({
  data: {
    img:util.data.img,
    indicatorDots:true,
    swiperHidden:true,
    swiperCurrent:0,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    balloons:{},
    theme:{},
    theCupOfTea:{},
    animationData:{},
    bg:'bg1',
  },
  onLoad: function() {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        this.setData({bar});

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  onShow(){
    var that = this;
    var theCupOfTea = wx.createAnimation({
      duration:800,
      timingFunction:'ease-out',
    })
    var balloons = wx.createAnimation({
      duration:2000,
      timingFunction:'ease-out',
      delay:800,
    })
    var theme = wx.createAnimation({
      duration:800,
      timingFunction:'ease-out',
      delay:2800,
    })

    that.theCupOfTea = theCupOfTea
    that.balloons = balloons
    that.theme = theme

    theCupOfTea.opacity(0).translateX('100%').step({duration:1})
    theCupOfTea.opacity(1).translateX('0%').step({duration:800})
    that.setData({
      theCupOfTea:theCupOfTea.export(),
    })

    balloons.opacity(0).translateY('50%').step({duration:1})
    balloons.opacity(1).translateY('0%').step({duration:2000})
    that.setData({
      balloons:balloons.export(),
    })

    theme.opacity(1).step({duration:800})
    that.setData({
      theme:theme.export(),
    })


  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid,res)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  goLetter(e){
    this.setData({
        avatarUrl:e.detail.userInfo.avatarUrl,
        userInfo:e.detail.userInfo,
    })
    util.goPage(e);
  },
  changeCurrent(e){
    // console.log(e)
    var that = this;
    var indicatorDots = that.data.indicatorDots;
    var swiperHidden = that.data.swiperHidden;
    var swiperCurrent = that.data.swiperCurrent;
    var bg = that.data.bg;
    if(e.detail.current==1&&e.detail.source=="touch"){
          indicatorDots = false;
          // swiperHidden = false;
          swiperCurrent = 1;
          bg = "bg2";

          var animation = wx.createAnimation({
              duration:1500,
              timingFunction:'ease',
          })
          that.animation = animation
          animation.opacity(1).step({duration: 1500})
          that.setData({
              animationData:animation.export()
          })
    }
    if(e.detail.current==0&&e.detail.source=="touch"){
          indicatorDots = true;
          swiperCurrent = 0;
          bg = "bg1";
    }
    that.setData({
        indicatorDots,
        swiperHidden,
        swiperCurrent,
        bg,
    })
  },

})
