const util = require('./util');

function relaunchPage(url) {
    wx.reLaunch({url});
}

function navigatePage(url) {
	wx.navigateTo({url});
}

function redirectPage(url) {
	wx.redirectTo({url});
}
function openSetting(){
    wx.openSetting({
      success(res){},
      complete(res){
        console.log('四百',res)
      }
    })
}
function goToPage(e) {
    const currentUrl = util.getCurrentPageUrl();
    const page = e.currentTarget.dataset.page;
    if (currentUrl.split("/")[2] == page) {
        return true;
    }
    let url = `../${page}/${page}`;
    if (page == "verification") {
        url += "?shop=true";
    }
    relaunchPage(url);
}

function goPage(e) {
    const data = e.currentTarget.dataset,
        { page, openType = 'navigate' } = data,
        param = data.param ? `?${data.param}` : '',
        url = `/pages/${page}/${page}${param}`,
        obj = {
            navigate() {
                wx.navigateTo({ url })
            },
            redirect() {
                wx.redirectTo({ url })
            },
            reLaunch() {
                wx.reLaunch({ url })
            },
            back() {
                wx.navigateBack({ delta: 1 })
            }
        }
    page && obj[openType]()
}

function getStored(pro) {
    return wx.getStorageSync(pro);
}

function store(pro, value) {
    wx.setStorageSync(pro, value);
}

function getDataset(e) {
    return e.currentTarget.dataset;
}

function navigateBack() {
  wx.navigateBack({
    delta: 1
  })
}

function goHome() {
    relaunchPage("../index/index");
}

function toast(title,icon,callback) {
    wx.showToast({
        title,
        icon: icon||'success',
        mask: true,
        duration: 2000,
        success() {
            callback && callback()
        }
    })
}

function modal(content, confirm, cancel) {
    wx.showModal({
        title: '提示',
        content,
        confirmColor: "#f4c21d",
        success: function(res) {
            if (res.confirm) {
                confirm && confirm();

            } else if (res.cancel) {
                cancel && cancel();
            }
        }
    })
}

function alert(content, callback) {
    // 提示弹层
    wx.showModal({
        title: '提示',
        content,
        confirmColor: "#f4c21d",
        showCancel: false,
        success: function (res) {
            callback && callback()
        }
    })
}

function setNavTitle(title) {
    if (title) {
        wx.setNavigationBarTitle({title})
    }
}

//状态栏的高度
function getBarHeight() {
    const res = wx.getSystemInfoSync();
    return res.statusBarHeight + 44;
}

function goBackPage() {
    if (getCurrentPages().length == 1) {
        goHome();
    } else {
        navigateBack();
    }
}
function loading(title) {
    wx.showLoading({
        title: title,
        mask: true,
    })
}
//隐藏加载图标
function hideLoading() {
    wx.hideLoading()
}

function hint(title) {
    wx.showToast({
        title,
        mask: true,
        icon: "none",
        duration: 2000
    })
}

function chooseImg(count, callback) {
    wx.chooseImage({
        count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
            callback(res);
        }
    })
}

function hasSubmit(url) {
    toast("提交成功");
    setTimeout(() => {
        redirectPage(url);
    }, 1000);
}

//跳转小程序
function goMiniProgram(appId, path, fail) {
    wx.navigateToMiniProgram({
        appId,
        path,
        envVersion: "trial",
        success() {

        },
        fail() {
            fail && fail();
        }
    })
}

module.exports = {
	relaunchPage,
	navigatePage,
	redirectPage,
	goToPage,
    goPage,
    openSetting,
    getStored,
    store,
    getDataset,
    navigateBack,
    goHome,
    loading,
    hideLoading,
    toast,
    modal,
    alert,
    setNavTitle,
    getBarHeight,
    goBackPage,
    hint,
    chooseImg,
    hasSubmit,
    goMiniProgram
}