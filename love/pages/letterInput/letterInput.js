const initialize = require("../../private/initialize");
const {util, wxfun, authorize, request, Bar} = initialize;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      img:util.data.img,
      showTeaStore:true,//true为隐藏提示框
      letterInfo:{
          "receiver": "",
          "sender": "",
          "content": ""
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        this.setData({bar});
        this.getUserId();
  },

  //判断userID是否存在，否则用openid验证是否注册
  getUserId() {
      const userid = wxfun.getStored(util.data.userid);
      console.log('userid',userid)
      if (userid) {
          this.disGetUserBtn();
          return;
      }
      authorize.isLogin({
          success: (openid) => {
              console.log('openid',openid)
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
  saveReceive(e){
      var that = this;
      var letterInfo = that.data.letterInfo;
      that.setData({
          'letterInfo.receiver':e.detail.value,
      })
  },
  saveSend(e){
      var that = this;
      var letterInfo = that.data.letterInfo;
      that.setData({
          'letterInfo.sender':e.detail.value,
      })
  },
  saveContent(e){
      console.log(e)
      var that = this;
      var letterInfo = that.data.letterInfo;
      that.setData({
          'letterInfo.content':e.detail.value,
      })
  },
  hideMongolia(e){
      var that = this;
      var showTeaStore = that.data.showTeaStore;
      that.setData({
          showTeaStore:true,
      })
  },
  bindgetuserinfo(res){
      // this.teaStore();
      // return;
      // console.log(res.detail.userInfo,res)
      var that = this;
      var showTeaStore = that.data.showTeaStore;
      var getUserInfo = that.data.getUserInfo;
      var userInfo = {
          username:res.detail.userInfo.nickName,
          photo:res.detail.userInfo.avatarUrl,
          openid:that.data.openid
      };
      var letterInfo = that.data.letterInfo;

      // 检测信件内容是否为空
      let letterFlag = true;
      util.each(letterInfo,(i,v)=> {
          if(!v){
            letterFlag = false;
          }
      })

      //判断用户是否已注册
      if(getUserInfo){
          request.SaveTyxPlayUserInfo(userInfo).then(res=>{
              console.log('userInfo',userInfo)
              wxfun.store(util.data.userid, res.id);
          })
      }

      if(letterFlag){
          request.SaveLetterInfo(letterInfo.receiver,letterInfo.sender,letterInfo.content).then(res=>{
              console.log('情书'+letterInfo)
              util.store('pictureUrl',res.path)
              showTeaStore = false;
              that.setData({
                  showTeaStore,
              })

              var QRcodeInfo = {
                    url : 'https://www.korjo.cn/letter?id=',
                    userid : wxfun.getStored(util.data.userid),
                    subject_id : 2,
                    picture : wxfun.getStored('pictureUrl'),
                    contentJSON : JSON.stringify(that.data.letterInfo)
              }

              request.SaveUniquecodeInfo(QRcodeInfo).then(res=>{
                  console.log('保存一码一贴信息'+JSON.stringify(letterInfo))
              })
          })
      }else{
          util.alert('请填写完整信件信息')
      }



  },
  teaStore(){
    var that = this;
    var letterId = that.data.letterId;
    wx.navigateToMiniProgram({
        appId: 'wxc3990715990eb82a',
        path: 'pages/index/index',
        extraData: {
          name: '亭驿下玩玩玩',
          params:'id:'+ letterId + + '|'+ 'activeName:情意码',
        },
        envVersion: 'release',
        success(res) {
          console.log('跳转成功'+res)
        },
        fail(res){
          console.log('跳转失败'+res.errMsg)
        }
    })
  }
})