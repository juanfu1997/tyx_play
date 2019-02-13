const initialize = require("../../../private/initialize");
const {util, wxfun, authorize, request, Bar, calendar} = initialize;

Page({
	data: {
        img: util.data.img,
        chosenIdx: "",
        swipers: [{}, {}, {}],
        swiperCurrent: 1,
        allDataForDay: {}     
    },
    onLoad(options) {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下万年历', pages, this, true);
        this.setData({bar}); 
        this.dir = "";
        //现在所在的具体日期信息
        this.dateObj = util.getNowObj();
        if (options && options.yy) {
            //分享打开或者是保存事件后
            this.dateObj.year = Number(options.yy);
            this.dateObj.month = Number(options.mm);
            this.dateObj.day = Number(options.dd);
            this.isChoosen = true;
        }
        this.fetchAllData();   
    },
    onShow() {
        const yymmdd = wx.getStorageSync("yymmdd");
        if (yymmdd) {
            wx.setStorageSync("yymmdd", "");
            this.onLoad(yymmdd);
        }
    },
    fetchAllData() {
        const ym = this.dateObj.year + "-" + util.formatNumber(this.dateObj.month);
        this.getCalendarHoliday(ym, () => {
            this.getEvents(ym, () => {
                this.getCourses(ym, this.setWholeMonth);
            });
        })
    },
    getCalendarHoliday(date, callback) {
        calendar.GetSingleCommonList(date).then((res) => {
            this.allMonthholidays = [];
            for (let h of res) {
                h.calendar_date = h.calendar_date.split(" ")[0].split("/")[2];
                this.allMonthholidays.push(h);
            }
            callback()
        })
    },
    getEvents(date, callback) {
        // 授权,false表示无需unionid
        authorize.isLogin({
            success: (openid) => {
                calendar.GetCalendarUserEvent(openid, date, false).then((res) => {
                    this.allMonthEvents = [];
                    for (let event of res) {
                        event.day = event.calendar_date.split(" ")[0].split("/")[2];
                        const timeArray = event.calendar_date.split(" ")[1].split(":");
                        event.hm = timeArray[0] + ":" + timeArray[1];
                        if (timeArray[0] > 11) {
                            event.time = "下午" + timeArray[0] + ":" + timeArray[1];
                        } else {
                            event.time = "上午" + timeArray[0] + ":" + timeArray[1];
                        }
                        this.allMonthEvents.push(event);
                    }
                    callback();
                })
            },
            fail: () => {
              util.alert('登录失败！')
            }
        }, false)
    },
    setThisWeek: function(weekObj, isChoosen) {
        console.log("weekObj: ", weekObj);
        const dateObj = this.dateObj;
        const allDataForDay = this.data.allDataForDay;
        let weekList = util.templateList();
        let chosenIdx = "";
        let firstDay = "";
        for (let i = 0; i < 7; i += 1) {
            weekList[i].num = weekObj.weekdays[i].num;
            weekList[i].off = weekObj.weekdays[i].off;
            if (weekObj.weekdays[i].num == dateObj.theDay && dateObj.theMonth == dateObj.month && dateObj.theYear == dateObj.year) {
                //标记今天
                weekList[i].mark = "today";
            } 

            if (isChoosen) {
                //from choose date, then the firstDay can't be the active day
                if (weekObj.weekdays[i].num == dateObj.day) {
                    weekList[i].chosen = 'active';
                    chosenIdx = i;
                }
            } else if (weekObj.weekdays[i].num == dateObj.theDay && dateObj.theMonth == dateObj.month && dateObj.theYear == dateObj.year) {
                weekList[i].chosen = 'active';
                chosenIdx = i;
            }
        }
        firstDay = weekList.find((elem) => {
            return elem.num
        })
        
        if (!chosenIdx) {
            firstDay.chosen = 'active';
            dateObj.day = firstDay.num;
            chosenIdx = weekList.findIndex((elem) => {
                return elem.num
            })
        }

        let isLeftHidden = this.hideLeft(firstDay);
        const beDate = [dateObj.year, util.formatNumber(dateObj.month), util.formatNumber(weekList[chosenIdx].num)];
        //该天的课程与事件数据
        allDataForDay.courses = this.allMonthcourses.filter((elem) => {
            return weekList[chosenIdx].num == elem.class_begins_time;
        })
        allDataForDay.events = this.allMonthEvents.filter((elem) => {
            return weekList[chosenIdx].num == elem.day;
        })
        allDataForDay.holidays = this.allMonthholidays.filter((elem) => {
            return weekList[chosenIdx].num == elem.calendar_date;
        })
        this.setData({
            weekList,  
            isLeftHidden, 
            chosenIdx,
            beStart: `${dateObj.year}-01-01`,
            beDate,
            beEnd: `${dateObj.year + 1}-12-31`,
            allDataForDay
        });
        this.getBgByDate();
        return firstDay;
    },
    setWholeMonth: function() {
        const chineseWeekday = ["一","二","三","四","五","六", "日"];
        //每月周数weeks
        this.dateObj.weeks = util.weeksCount(this.dateObj.year, this.dateObj.month);
        let WholeMonth = [];
        for (let i = 0; i < this.dateObj.weeks; i += 1) {
            let weekdays = [];
            for (let ii = 0; ii < 7; ii += 1) {
                weekdays.push({
                    num: ""
                })
            }
            WholeMonth.push({
                weekNum: chineseWeekday[i],
                weekdays
            })
        }
        calendar.createMonthData(WholeMonth, this.dateObj.month, this.dateObj.year).then(res => {
            this.dateObj.WholeMonth = res;
            //找到今天所在的周
            if (this.dir == "left") {
                this.dateObj.weekIdx = this.dateObj.weeks - 1;
            } else if (this.dir == "right"){
                this.dateObj.weekIdx = 0;
            } else {
                this.findTheWeek();
            }
            console.log("weeks: ", this.dateObj.weekIdx);
            this.setThisWeek(this.dateObj.WholeMonth[this.dateObj.weekIdx], this.isChoosen);
        });
    },
    getCourses(yymm, callback) {
        calendar.GetCourseArrangementList(yymm).then((res) => {
            this.allMonthcourses = [];
            for (let course of res) {
                course.class_begins_time = course.class_begins_time.split("T")[0].split("-")[2];
                this.allMonthcourses.push(course);
            }
            callback();
        })
    },
    chooseDate(e) {
        const dir = e.currentTarget.dataset.dir;
        let isRightHidden = false;
        const weeks = this.dateObj.weeks;
        //往左减少日期，vice versa
        this.createNewDateObj(dir, this.fetchAllData, () => {
             this.setThisWeek(this.dateObj.WholeMonth[this.dateObj.weekIdx]);
        });
    },
    createNewDateObj(dir, callback, callbackTwo) {
        this.dir = dir;
        if (dir == "left") {
            if (this.dateObj.weekIdx > 0) {
                this.dateObj.weekIdx -= 1;
                callbackTwo();
            } else {
                if (this.dateObj.month == 1) {
                    this.dateObj.month = 12;
                    this.dateObj.year -= 1;
                } else {
                    this.dateObj.month -= 1;
                }
                callback();
            }
        } else {
            if (this.dateObj.weekIdx < this.dateObj.weeks - 1) {
                this.dateObj.weekIdx += 1;
                callbackTwo();
            } else {
                this.dateObj.weekIdx = 0;
                if (this.dateObj.month == 12) {
                    this.dateObj.month = 1;
                    this.dateObj.year += 1;
                } else {
                    this.dateObj.month += 1;
                }
                callback();
            }
        }
    },
    hideLeft(firstDay) {
        let isLeftHidden = false;
        //无法点击去2018以前的时间
        const now = new Date(2018, 0, 1, 0, 1).getTime();
        const calenderTime = util.formatDate(`${this.dateObj.year}-${this.dateObj.month}-${firstDay.num} 00:00:00`);
        if (now > calenderTime.getTime()) {
          isLeftHidden = true;
          this.setData({
            swiperCurrent: 0
          })
        }
        return isLeftHidden;
    },
    changeSwiper(e) {
        if (e.detail.source != "touch") {
            return;
        }
        const current = e.detail.current;
        if (current == 2) {
            e.currentTarget.dataset.dir = "right";
        } else if (current == 0){
            e.currentTarget.dataset.dir = "left";
        }
        // 保持可以滑动//因为swipers长度为3，1即可左右滑动
        this.setData({
            swiperCurrent: 1
        })     
        this.chooseDate(e);
    },
    chooseBeDate: function(e) {
        this.dir = "";
        const date = e.detail.value;
        const beDate = date.split("-");
        const dateObj = this.dateObj;
        if (beDate[0] == dateObj.year && Number(beDate[1]) == dateObj.month && beDate[2] == dateObj.day ) {
            return;
        }
        this.setData({beDate});
        const that = this;
        const now = util.formatDate(`${date.replace(/-0/gi, '-')}T01:00:00`);
        dateObj.year = now.getFullYear();
        dateObj.month = now.getMonth() + 1;
        dateObj.day = now.getDate();
        dateObj.weekday = now.getDay();
        this.isChoosen = true;
        const ym = dateObj.year + "-" + util.formatNumber(dateObj.month);
        this.getCalendarHoliday(ym, () => {
            this.getEvents(ym , () => {
                this.getCourses(ym, () => {
                    this.setWholeMonth(true);
                });
            })
        })
    },
    goEvent(e) {
        const beDate = this.data.beDate;
        const id = e.currentTarget.dataset.id;
        const allDataForDay = this.data.allDataForDay;
        let url = "../event/event?yy=" + beDate[0] + "&mm=" + beDate[1] + "&dd=" + beDate[2]
        if (id) {
            //修改事件
            const event = allDataForDay.events.find((elem) => {
                return elem.id == id;
            })
            url += "&id=" + id + "&hm=" + event.hm;
        }
        wx.navigateTo({
            url,
        })
    },
    goCalendar() {
        var beDate = this.data.beDate;
        wx.navigateTo({
            url: "../calendar/calendar?yy=" + beDate[0] + "&mm=" + beDate[1] + "&dd=" + beDate[2]
        })
    },
    goToday() {
        const dateObj = this.dateObj;
        if (dateObj.year == dateObj.theYear && dateObj.month == dateObj.theMonth && dateObj.day == dateObj.theDay ) {
            return;
        }
        this.onLoad();
    },
    goSignin() {
        wxfun.navigatePage("../signin/signin");
    },
    goArticle(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../article/article?id=" + id
        })
    },
    checkCourses(e) {
        const index = e.currentTarget.dataset.index;
        const weekList = this.data.weekList;
        const beDate = this.data.beDate;
        const allDataForDay = this.data.allDataForDay;
        let chosenIdx = this.data.chosenIdx;
        if (!weekList[index].num) {
            return;
        }
        weekList[chosenIdx].chosen = "";
        weekList[index].chosen = "active";
        chosenIdx = index;
        //该天的课程数据
        allDataForDay.courses = this.allMonthcourses.filter((elem) => {
            return weekList[chosenIdx].num == elem.class_begins_time;
        })
        allDataForDay.events = this.allMonthEvents.filter((elem) => {
            return weekList[chosenIdx].num == elem.day;
        })
         allDataForDay.holidays = this.allMonthholidays.filter((elem) => {
            return weekList[chosenIdx].num == elem.calendar_date;
        })
        //同步更新日期选择器的显示天
        beDate[2] = util.formatNumber(weekList[index].num);
        this.dateObj.day = weekList[index].num;
        this.setData({weekList, chosenIdx, beDate, allDataForDay});
        this.getBgByDate();       
    },
    getBgByDate() {
        const beDate = this.data.beDate;
        const date = `${beDate[0]}-${beDate[1]}-${beDate[2]}`
        calendar.GetCurriculumBgimageInfo(date).then(res => {
            const bgImg = util.addHost(res.bgimage);
            calendar.GetIndexBgImageInfo(date).then(response => {
                const nongli = response.nongli.replace(/.*年/, "").split(/\s属/),
                      suici  = response.suici.replace(/\s/g, "").replace(/[年月日]/g, ",").split(",");
                const lunar = suici[0] + " 年  " + suici[1] + " 月  " + suici[2] + " 日  【属" + nongli[nongli.length - 1] + "】";
                this.setData({bgImg, lunar})
            })
        })
    },
    findTheWeek() {
        console.log("dateObj: ", this.dateObj);
        for (let i = 0; i < this.dateObj.WholeMonth.length; i += 1) {
            let findOne = this.dateObj.WholeMonth[i].weekdays.find((elem) => {
                return elem.num == this.dateObj.day;
            })
            if (findOne) {
                this.dateObj.weekIdx = i;
                return;
            }        
        }
    },
    onShareAppMessage: function(res) {
        const beDate = this.data.beDate;
        return {
            title: "@我 " + beDate[0] + "年" + beDate[1] + "月的万年历",
            path: "/pages/week/week?yy=" + beDate[0] + "&mm=" + beDate[1] + "&dd=" + beDate[2],
            success: function(res) {
            },
            fail: function(res) {
             // 转发失败
            }
        }
    }
});