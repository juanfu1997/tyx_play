const k = 'M2CBZ-IKZWU-UHZVJ-43N2O-W7PUO-5AFBC';
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') ;//+ ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取坐标 
 */
const getLocationRes = function(successed,failed,completed) {
    wx.getLocation({
        success: function(res) {
            if (typeof (successed) == 'function')         
                successed(res);
        },
        fail: function(r){
            if (typeof (failed) == 'function'){
                failed(r);
            }
        },
        complete(r){
            if (typeof (completed) == 'function') {
                completed(r);
            }
        }
    })
}

//设置地址，存在缓存里
const setAddress = function(address){
    wx.setStorage({
        key: 'address',
        data: address,
    })
}

//设置明信片背景图，保存在缓存里
const setPicUrl = function(picUrl){
    wx.setStorage({
        key: 'postcard_image',
        data: picUrl,
    })
}

//设置邮票图片，存在缓存里
const setStampUrl = function(stampUrl){
    wx.setStorage({
        key: 'stamp',
        data: stampUrl,
    })
}

/**
 * 逆地址解析
 * loc = lat,lon 经纬度
 */
const getAddressByLocation = function (loc, successed, failed, completed){
    wx.showLoading({
        title: 'loading...',
    })
    wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1',
        data: {
            location: loc,
            key: k 
        },
        success(res){
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

/**
 * 根据地区名字获取对应图片和邮票
 */
const getPicAndStampByAreaName = function (areaName, successed, failed, completed){
    wx.showLoading({
        title: 'loading...',
    })
    wx.request({
      url: 'https://www.korjo.cn/korjoApi/GetSendLetterInfo',
        data:{
            area: areaName
        },
        success(res){
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

/**
 * 获取地区列表
 */
const getAreaList = function (successed, failed, completed){
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

module.exports = {
  formatTime: formatTime,
  getLocationRes: getLocationRes,
  getAddressByLocation: getAddressByLocation,
  getPicAndStampByAreaName: getPicAndStampByAreaName,
  getAreaList: getAreaList,
  setAddress:setAddress,
  setPicUrl: setPicUrl,
  setStampUrl: setStampUrl
}
