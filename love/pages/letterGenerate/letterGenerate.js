const initialize = require("../../private/initialize");
const {util, wxfun, authorize, request, Bar} = initialize;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:util.data.img,
    contentJSON:{},
    letterText:[
        {text:''},
        {text:'                    '},
        {text:''},
        {text:''},
        {text:''},
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var contentJSON = that.data.contentJSON;
      var letterText = that.data.letterText;
      //设置导航栏高度与title
      const pages = getCurrentPages();
      const bar = new Bar('亭驿下玩玩玩', pages, this);
      this.setData({bar});
      const url = decodeURIComponent(options.q);
      const letterid = util.deparam(url.split('?')[1]).id;
      wx.getSystemInfo({
        success(res){
          that.setData({
            windowWidth:res.windowWidth,
          })

          //判断设备一行能放置多少个20rpx的字
          var textLength = that.data.windowWidth*0.532*2/20>>>0

          //根据id查询一码一贴信息
          // var letterid = options.p.split('?id=')[1]
          request.GetUniquecodeInfo(letterid).then(res=>{
            //判断接口返回是否报错
            // if(res.errors.length!=0){ return; }
              contentJSON = JSON.parse(res.contentJSON)
              console.log('contentJSON'+contentJSON)
              var letterRowNumber = Math.ceil(contentJSON.content.length/textLength)
              console.log('contentJSON'+letterRowNumber)
              for(var i=0;i<letterRowNumber;i++){
                if(i!=0){
                  letterText[i].text = contentJSON.content.substring( (i-1)*textLength ,i*textLength)
                }else{
                  letterText[i].text =contentJSON.content.substring(0,textLength)
                }

                console.log('contentJSON'+letterText[i].text)
              }
              that.setData({
                contentJSON,
                letterText,
                letterPicture:res.picture,
              })
          })
        }
      })

  },
  saveImg(tempFilePath){
    wxfun.hideLoading();
    wx.saveImageToPhotosAlbum({
      filePath:tempFilePath,
      success(res) {
        wxfun.toast('保存成功','success',function(){
        })
        console.log('保存路径'+res)
      },
      fail(res){
        wxfun.toast('保存失败','none',function(){
        })
        console.log('保存失败'+res)
      }
    })
  },
  saveLetterImg: function(e) {
    var that = this;
    wxfun.loading('loading');
    wx.getSetting({
        success(res){
          console.log('已授权',res.authSetting)
          var authSetting = res.authSetting;
          var writePhotosAlbum = res.authSetting['scope.writePhotosAlbum'];
          if(writePhotosAlbum == false){
            wxfun.hideLoading();
            wxfun.openSetting();
          }else{
            wx.downloadFile({
              url: that.data.letterPicture, // 仅为示例，并非真实的资源
              success(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                  console.log('图片资源'+res.tempFilePath,authSetting['scope.writePhotosAlbum'])
                  var tempFilePath = res.tempFilePath;
                  if(writePhotosAlbum== true){
                      // util.alert('"亭驿下玩玩玩"需要保存图片或视频到你的相册',function(){
                        that.saveImg(tempFilePath)
                      // })
                  }
                  if(!authSetting['scope.writePhotosAlbum']){
                        that.saveImg(tempFilePath)
                  }

                }
              }
            })
          }
        }
      })
  },
  BackIndexPage(e){
      wx.reLaunch({url: "../../../pages/index/index"})
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      //如果有更改活动，需要更改分享图
        const imageUrl = "../../images/share.jpg";
        return {
            title: '用此刻，抒情传意',
            imageUrl
        }
  }
})