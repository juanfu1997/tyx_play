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
      console.log(res)
        const openid = JSON.parse(res).openid;
        // 获取用户信息
        obj.success(openid)
    })
}

function isLogin(obj) {
    getOpenId(obj);
}

module.exports = {
    isLogin
};