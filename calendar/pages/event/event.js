const initialize = require("../../../private/initialize");
const {util, wxfun, authorize, request, Bar, calendar} = initialize;


Page({
    data: {
        img: util.data.img + "calendar/",
        ampm: ["上午", "下午"],
        timeArray: [{
            timeStart: "00:00",
            timeEnd: "11:59"
        }, {
            timeStart: "12:00",
            timeEnd: "23:59"
        }],
        switchStatus: "on"
    },
    onLoad(options) {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('添加事件', pages, this, true);
        this.setData({bar});
        wx.setStorageSync("yymmdd", "");
        //如果是修改事件，需要另外去事件的日期，时间，上下午
        this.eventId = options.id;
        //从week page进来
        const that = this;
        const beDate = [options.yy, options.mm, options.dd];
        const today = new Date();
        let ampmIndex = 0;
        let time = util.formatNumber(today.getHours()) + ":" + util.formatNumber(today.getMinutes());
        const deniedUserEventMessages = wx.getStorageSync("deniedUserEventMessages");
        if (options.id) {
            //要修改事件，获取事件数据
            const requestDate = beDate.join("-") + " " + options.hm + ":00";
            this.getTheEvent(options.id, requestDate);
            time = options.hm;
            if (options.hm.split(":")[0] > 11) {
                ampmIndex = 1;
            }
        } else {
            if (today.getHours() > 11) {
                ampmIndex = 1;
            }
        }
        this.setData({
            ampmIndex,
            time,
            beDate,
            switchStatus: deniedUserEventMessages ? "" : "on"
        })      
    },
    getTheEvent(id, requestDate) {
        const that = this;
        // 授权,false表示无需unionid
        authorize.isLogin({
            success: () => {
                const courseOpenId = wx.getStorageSync(util.data.openIdStorage);
                request.GetCalendarUserEvent(courseOpenId, requestDate, true).then((response) => {
                    const event = response.find((event) => {
                        return event.id == id;
                    })
                    that.eventValue = event.user_event;
                    that.setData({
                        eventValue: event.user_event
                    })
                })
            },
            fail: () => {
                util.alert('登录失败！')
            }
        }, false)
    },
    chooseBeDate: function(e) {
        const date = e.detail.value;
        const beDate = date.split("-");
        const thisYear = new Date().getFullYear();
        this.setData({
            beStart: `${thisYear}-01-01`,
            beDate,
            beEnd: `${thisYear + 1}-12-31`
        });
    },
    chooseAMPM: function(e) {
        let ampmIndex = e.detail.value;
        let time = this.data.time;
        const hour = time.split(":")[0];
        if (ampmIndex == 0 && hour > 11) {
            time = `${util.formatNumber(Number(time.split(":")[0]) - 12)}:${time.split(":")[1]}`
        } else if (ampmIndex == 1 && hour <= 11) {
            time = `${util.formatNumber(Number(time.split(":")[0]) + 12)}:${time.split(":")[1]}`
        }
        this.setData({
            ampmIndex,
            time
        })
    },
    chooseTime(e) {
        this.setData({
            time: e.detail.value
        })
    },
    eventInput: function(e) {
        if (e.detail.value.trim()) {
          this.eventValue = e.detail.value;
        } else {
          this.eventValue = "";
        }
        this.setData({
          eventValue: this.eventValue
        })
    },
    goBack() {
        util.navigateBack();
    },
    send(e) {
        const beDate = this.data.beDate;
        const that = this;
        if (!this.eventValue) {
            util.alert("请填写事件内容");
            return
        }
        const jsonData = {
            calendar_date: beDate.join("-") + " " + this.data.time,
            user_event: this.eventValue,
            wxpublic_id: util.data.appid
        }
        if (this.eventId) {
            //修改事件
            jsonData.id = this.eventId;
            //不管是否之前有推送这个事件，都先尝试删除推送
            request.DeleteSendMsg(this.eventId).then((response) => {
                console.log("删除推送：", response);
            })
        }
        // 授权,false表示无需unionid
        authorize.isLogin({
            success: () => {
                jsonData.openid = wx.getStorageSync(util.data.openIdStorage);
                request.SaveUserEvent(jsonData).then((res) => {
                    let id = JSON.parse(res.replace(/[()]/g,'')).data;
                    const switchStatus = that.data.switchStatus;
                    if (!switchStatus) {
                        //不推送
                        that.showSuccess();
                        
                    } else {
                        if (!id) {
                          id = jsonData.id;
                        }
                        that.sendMessage(id, e.detail.formId)
                    }
                })
            },
            fail: () => {
              util.alert('登录失败！')
            }
        }, false)
    },
    turnOnMessage(e) {
        let switchStatus = this.data.switchStatus;
        if (switchStatus == "on") {
            switchStatus = "";
        } else {
            switchStatus = "on";
        }
        //用户是否接受推送的接口---保存到本地
        wx.setStorageSync("deniedUserEventMessages", switchStatus == "on" ? "" : true);
        this.setData({
            switchStatus
        })
    },
    sendMessage(id, formId) {
        console.log("call sendMessage.");
        //如果事件时间在未来，可以提醒;
        //但如果大于7天不可以提醒;
        const openid = wx.getStorageSync(util.data.openIdStorage);
        const now = new Date().getTime();
        const beDate = this.data.beDate;
        const sendtime = beDate.join("-") + " " + this.data.time + ":00";
        const sendtype = notification.conformSendType(sendtime, openid);
        const eventDate = beDate[0] + "年" + beDate[1] + "月" + beDate[2] + "日" + " " + this.data.time;
        const param = notification.eventStartMessage(this.eventValue, eventDate, formId, openid);
        if (now > util.formatDate(sendtime).getTime() || sendtype == 2) {
            this.showSuccess();
            return;
        } 
        request.SaveSendMsg(sendtime, param, 1, openid, id).then((res) => {
            console.log(res);
            this.showSuccess();
        })
    },
    showSuccess() {
        const beDate = this.data.beDate;
        util.toast("提交成功");
        setTimeout(() => {
            wx.setStorageSync("yymmdd", {
                yy: beDate[0],
                mm: beDate[1],
                dd: beDate[2]
            })
            util.navigateBack();
        }, 2000);
    },
    goBackPage() {
        wxfun.goBackPage();
    }
})
