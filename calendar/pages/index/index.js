const initialize = require("../../../private/initialize");
const {util, wxfun, authorize, request, Bar, calendar} = initialize;
//TODO: 背景图接口，名人名言接口
Page({
	data: {
        img: util.data.img       
    },
    onLoad() {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下万年历', pages, this);
        this.setData({bar});
        this.getData();    
    },
    getData() {
        const date = new Date(),
              dateObj = {};
        //黄历
        calendar.GetIndexBgImageInfo(util.getYyMmDd(date, "-")).then(res=> {
            const nongli = res.nongli.replace(/.*年/, "").split(/\s属/),
                  suici  = res.suici.replace(/\s/g, "").replace(/[年月日]/g, ",").split(",");
            dateObj.day   = date.getDate();
            dateObj.month = calendar.getNumChar(date.getMonth() + 1);
            dateObj.weekDay = calendar.getWeekDay(date);
            dateObj.nongli = nongli[0];
            dateObj.zodiac = nongli[nongli.length - 1];
            //"戊戌 年  乙丑 月  葵未 日"
            dateObj.suici = suici[0] + " 年  " + suici[1] + " 月  " + suici[2] + " 日  ";
            this.setData({dateObj});
        });
    },
    goWeek() {
        wxfun.navigatePage("../week/week");
    },
    onShareAppMessage(res) {
        return {
            title: '亭驿下万年历',
        }
    }
});