const initialize = require("../../../private/initialize");
const {util, wxfun, authorize, request, Bar, calendar} = initialize;


Page({
    data: {
        img: util.data.img + "calendar/",
        isPrizeHidden: true,
        now: {}
    },
    onLoad() {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('签到有礼', pages, this, true);
        this.setData({bar});
    },
    onShow() {
        this.getPrizes();
        this.getMarkedDays();
    },
    getPrizes() {
        const list = [];
        list.length = 6;
        this.setData({
            list
        });
    },
    getMarkedDays() {
        //获取签到天数
        const userid = wxfun.getStored(util.data.userid);
        calendar.GetPrizeSigninInfo(userid).then(res => {
            const registeredDays = res.remaining_count > 0 ? 7 : res.signin_count;
            const markedDays = [];
            let isPrizeHidden = true;
            markedDays.length = 7;
            if (registeredDays === 7) {
                isPrizeHidden = false;
            }
            this.setData({markedDays, registeredDays, isPrizeHidden});
        });
    },
    //签到
    signIn(e) {
        let {index}          = wxfun.getDataset(e),
            {registeredDays} = this.data;
        if (index == registeredDays) {
            registeredDays += 1;
        }
        this.setData({registeredDays});
    },
    goBackPage() {
        wxfun.goBackPage();
    }
})