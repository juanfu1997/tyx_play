const request = require("./request"),
      util = require('./util');

//获取code，通过code获取openid
function login() {
    return  new Promise((resolve, reject) => {
        wx.login({
          success: (res) => {
            resolve(res)
          },
          fail: (res) => {
            reject(res)
          }
        })
    })
}

//获取openid
function getOpenId(obj) {
    login().then((res) => {
        const data = {
          id: util.data.appid,
          js_code: res.code
        }
        return request.GetSessionKey(data);
    }).then(res => {
        const openid = JSON.parse(res).openid;
        const unionid = JSON.parse(res).unionid; //用于发送公众号模板消息
        // 获取用户信息
        obj.success(openid, unionid)
    })
}

function isLogin(obj) {   
    getOpenId(obj);
}

module.exports = {
    isLogin
};