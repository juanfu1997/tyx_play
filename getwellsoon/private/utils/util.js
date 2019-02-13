//获取app.js数据
const data =  {
    img: 'https://www.korjo.cn/xcx/tyx_play_getwellsoon/', //ftp文件夹，放图片
    host: 'https://www.korjo.cn', //域名
    appid: 122, //korjo.cn密钥管理里该小程序的id
    userid: 'playuser'
}

//显示加载图标
function loading() {
    wx.showLoading({
        title: '加载中',
        mask: true
    })
}

//隐藏加载图标
function hideLoading() {
    wx.hideLoading()
}

//request function
function request(url, dataObj, method) {
    loading();
    return new Promise((resolve, reject) => {
        wx.request({
            url: url.indexOf("http://") > -1 ? url : data.host + url,
            data: dataObj,
            method,
            header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
            success: (res) => {
                hideLoading();
                resolve(res.data);
            },
            fail: (res) => {
                console.error('request fail:' + url)
                console.error(res)
            }
        })
  });
}
function alert(content, callback) {
    wx.showModal({
        title: '提示',
        content,
        showCancel: false,
        success: function (res) {
            callback && callback()
        }
    })
}
function get(url, dataObj) {
  return request(url, dataObj, 'GET');
}

function post(url, dataObj) {
  return request(url, dataObj, 'POST');
}

function goPage(e) {
    console.log(e)
    const data = e.currentTarget.dataset,
        { page, openType = 'navigate' } = data,
        param = data.param ? `?${data.param}` : '',
        url = `../${page}/${page}${param}`,
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

function goBack() {
    wx.navigateBack({ delta: 1 })
}

/*获取当前页url*/
function getCurrentPageUrl(){
    const pages = getCurrentPages(),    //获取加载的页面
          currentPage = pages[pages.length-1],   //获取当前页面的对象
          url = currentPage.route;   //当前页面url
    return url;
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs(){
    const pages = getCurrentPages(),  //获取加载的页面
          currentPage = pages[pages.length-1],   //获取当前页面的对象
          url = currentPage.route,  //当前页面url
          options = currentPage.options;  //如果要获取url中所带的参数可以查看options
    //拼接url的参数
    let urlWithArgs = url + '?';
    for(let key in options){
        let value = options[key];
        urlWithArgs += key + '=' + value + '&';
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1);
    return urlWithArgs;
}

//加域名
function addHost(url) {
    if (!url) {
        return;
    }
    if (url.indexOf("http") > -1) {
        return url;
    } else {
        return data.host + url;
    }
}

//获取纯文本
function getText(str) {
    return str.replace(/<style>.*?<\/style>/gi, "").replace(/&#39;/ig, "'").replace(/<\/?[^>]*>|&[^;]*;/ig, '');
}

//过滤不必要的html代码，加域名
function url2abs(str) {
    return str.replace(/<img.*?src="\//gi, '<img src="https://www.korjo.cn//').replace(/&#39;/gi, "'").replace(/<video.*?src="\//gi, '<video src="https://www.korjo.cn//').replace(/<source.*?<\/video>/gi, "</video>").replace(/<style>.*?<\/style>/gi, "");
}

function clone(json) {
    return JSON.parse(JSON.stringify(json))
}

//获取参数
function deparam(uri) {
    //'?scene=123&b=3'
    var queryString = {};
    uri.replace(
        new RegExp("([^?=&]+)(=([^&#]*))?", "g"),function($0, $1, $2, $3) {
                queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
    });
    console.log(queryString)
    //{scene: "123", b: "3"}
    return queryString;
}

//每4个数字加个空格
function addSpaces(string) {
    const data = String(string);
    return data.replace(/(\w{4})(\w{4})/, "$1 $2 ");
}

//1 =》 01
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

//2018-10-11T10：00：00 => date
//2018-10-11 => date
function formatDate(time) {
    const arr = time.split(/[-T:\/\s]/);
    let date = "";
    if (arr[3]) {
        date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    } else {
        date = new Date(arr[0], arr[1] - 1, arr[2]);
    }
    return date;
}

//date => 2018-10-11 10：00：00
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//根据date获取年月日，默认以年月日为单位
function getYyMmDd(date, symbol="") {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let YyMmDd = symbol ? `${year}${symbol}${month}${symbol}${day}` : `${year}年${month}月${day}日`;
    return YyMmDd;
}

//根据date获取是时分秒
function getHhMmSs(date, symbol="") {
    const hh = formatNumber(date.getHours());
    const mm = formatNumber(date.getMinutes());
    const ss = formatNumber(date.getSeconds());
    let getHhMmSs = symbol ? `${hh}${symbol}${mm}${symbol}${ss}` : `${hh}:${mm}:${ss}`;
    return getHhMmSs;
}

//获取第二天日期
function getNextDay(firstDay, symbol="") {
    const time = formatDate(firstDay).getTime() + 24 * 60 * 60 * 1000;
    const date = new Date(time);
    return getYyMmDd(date, symbol);
}

function isToday(ym, d) {
    const toDate = new Date(),
          year = toDate.getFullYear(),
          month = toDate.getMonth() + 1,
          day = toDate.getDate();
    return ym.year == year && ym.month == month && d == day;
}

function getNowObj() {
    const today = new Date();
    const dateObj = {
        year: today.getFullYear(),
        theYear: today.getFullYear(),
        month: today.getMonth() + 1,
        theMonth: today.getMonth() + 1,
        day: today.getDate(),
        theDay: today.getDate(),
        weekday: today.getDay()
    }
    return dateObj;
}

//是否是string
function isRealString(stri) {
    return typeof str === 'string' && str.trim().length > 0;
}

//获取随机整数, 包含min, max
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weeksCount(year, month_number) {
  var firstOfMonth = new Date(year, month_number - 1, 1);
  var day = firstOfMonth.getDay() || 6;
  day = day === 1 ? 0 : day;
  if (day) { day-- }
  var diff = 7 - day;
  var lastOfMonth = new Date(year, month_number, 0);
  var lastDate = lastOfMonth.getDate();
  if (lastOfMonth.getDay() === 1) {
    diff--;
  }
  var result = Math.ceil((lastDate - diff) / 7);
  return result + 1;
};

function templateList() {
    const arr = ["一", "二", "三", "四", "五", "六", "日"];
    const templateList = [];
    arr.forEach(function(ele) {
        templateList.push({
            title: ele
        })
    });
    return templateList;
}

function checkDaysOfMonth(mm, yyyy) {
    var daysofmonth;
    if ((mm == 4) || (mm ==6) || (mm ==9) || (mm == 11)){
        daysofmonth = 30;
    } else {
        daysofmonth = 31;
        if (mm == 2){
            if (yyyy/4 - parseInt(yyyy/4, 10) != 0){
                daysofmonth = 28;
            } else {
                if (yyyy/100 - parseInt(yyyy/100, 10) != 0) {
                    daysofmonth = 29;
                }else{
                    if (yyyy/400 - parseInt(yyyy/400, 10) != 0) {
                        daysofmonth = 28;
                    }else{
                        daysofmonth = 29;
                    }
                }
            }
        }
    }
    return daysofmonth;
}

function isNew(date) {
    const isNew = formatDate(date).getTime() >= formatDate(getYyMmDd(new Date(), "-")).getTime();
    return isNew;
}

function getDurationDays(date) {
    const duration = formatDate(date).getTime() - formatDate(getYyMmDd(new Date(), "-")).getTime();
    return duration / (24 * 60 * 60 * 1000);
}

function deparam(uri) {
    //'?scene=123&b=3'
    var queryString = {};
    uri.replace(
        new RegExp("([^?=&]+)(=([^&#]*))?", "g"),function($0, $1, $2, $3) {
                queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
    });
    console.log(queryString)
    //{scene: "123", b: "3"}
    return queryString;
}
function store(key, data) {
    if (key instanceof Object) {
        this.each(key, (k, v) => {
            wx.setStorageSync(k, v)
        })
    } else if (typeof key == 'string') {
        return data ? wx.setStorageSync(key, data) : wx.getStorageSync(key)
    } else {
        const obj = {}
        this.each(wx.getStorageInfoSync().keys, (i, k) => {
            obj[k] = wx.getStorageSync(k)
        })
        return obj
    }
}
function each(object, callback) {
    var name, i = 0,
        length = object.length,
        isObj = length === undefined

    if (isObj) {
        for (name in object) {
            if (callback.call(object[name], name, object[name]) === false) {
                break
            }
        }
    } else {
        for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
    }
    return object
}

module.exports = {
    data,
    loading,
    hideLoading,
    get,
    post,
	request,
	getCurrentPageUrl,
	getCurrentPageUrlWithArgs,
    addHost,
    getText,
    url2abs,
    clone,
    deparam,
    addSpaces,
    formatNumber,
    formatDate,
    formatTime,
    getYyMmDd,
    getHhMmSs,
    getNextDay,
    isToday,
    getNowObj,
    isRealString,
    getRandomIntInclusive,
    weeksCount,
    templateList,
    isNew,
    getDurationDays,
    deparam,
    goPage,
    goBack,
    alert,
    store,
    each
}