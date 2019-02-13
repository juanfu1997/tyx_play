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
    letterImg:'',
    pageParams:'letterInput',
    teaAnimation:{},
    vaseAnimation:{},
    falling_flower:{},
  },
  onLoad: function(options) {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this,'dark');
        var pageParams = this.data.pageParams;
        var letterid;
        var letterImg = this.data.letterImg;
        letterImg = wxfun.getStored('letterid')?'openletter':'care';
        this.setData({bar});
        if(options.q){
          var url = decodeURIComponent(options.q);
          letterid= util.deparam(url.split('?')[1]).id;
          pageParams = 'letterGenerate';
          wxfun.store('letterid',letterid);
        }else{
          //非扫描进入时，缓存letterid数据清空
          wxfun.store('letterid','');
        }
        this.setData({
            letterImg,
            pageParams,
        })
  },
  onReady(){
        var that = this;
        var teaAnimation = wx.createAnimation({
              duration:800,
              timingFunction:'ease-out',
        })
        var vaseAnimation =  wx.createAnimation({
              duration:1000,
              timingFunction:'ease-out',
              delay:800,
        })
        var falling_flower =  wx.createAnimation({
              duration:1000,
              timingFunction:'ease-out',
              delay:2000,
        })

        that.teaAnimation = teaAnimation;
        that.vaseAnimation = vaseAnimation;
        that.falling_flower = falling_flower;

        teaAnimation.opacity(0).translateX('-100%').step({duration:1})
        teaAnimation.opacity(1).translateX('0%').step({duration:800})

        vaseAnimation.opacity(0).translateX('100%').step({duration:1})
        vaseAnimation.opacity(1).translateX('0%').step({duration:1000})

        falling_flower.opacity(1).step({duration:1000})

        that.setData({
            teaAnimation:teaAnimation.export(),
        })
        that.setData({
            vaseAnimation:vaseAnimation.export(),
        })
        that.setData({
            falling_flower:falling_flower.export(),
        })
  },
  nextPage(e){
        util.goPage(e);
  },


})
