const initialize = require("../../../private/initialize");
const {util, wxfun, authorize, request, Bar, validations, alert} = initialize;

Page({
	data: {
        img: util.data.img
    },
    onLoad() {
        alert();//获取alert模板数据与方法
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        this.setData({bar});    
    },
    validateData(data) {
        let errors = [];
        if (!validations.hasPresence(data.height)) {
            errors.push("身高不能为空");
        } 
        if (!validations.hasPresence(data.weight)) {
            errors.push("体重不能为空")
        }
        return errors;
    },
    showResult(submitData) {
        //BMI标准
        //营养不良：低于15
        // 偏瘦：低于18.5
        // 正常：18.5 - 23.9
        // 过重：24 - 27
        // 肥胖：28 - 32
        // 非常肥胖, 高于32
        const result = {};
        submitData.height = submitData.height / 100;
        result.num = Math.fround(submitData.weight / (submitData.height * submitData.height)).toFixed(1);
        if (result.num < 15) {
            result.status = '营养不良';
        } else if (result.num < 18.5 && result.num >= 15) {
            result.status = '偏瘦';
        } else if (result.num < 24 && result.num >= 18.5) {
            result.status = '正常';
        } else if (result.num < 28 && result.num >= 24) {
            result.status = '过重';
        } else if (result.num < 32 && result.num >= 28) {
            result.status = '肥胖';
        } else {
            result.status = '非常肥胖';
        }
        if (result.status) {
            this.setData({show: '', result, introAnimation: 'left'});
            setTimeout(() => {
                this.setData({show: 'show'});
            }, 300);
        }
    },
    formSubmit(e) {
        let submitData = e.detail.value;
        let errors = this.validateData(submitData);
        if (errors.length > 0) {
            const hint = errors.join("\n");
            this.showAlert(hint);
            return;
        }
        this.showResult(submitData);
    },
    goCalculation() {
        wxfun.navigatePage('../calculation/calculation');
    },
    onShareAppMessage(res) {
        return {
            title: '燃烧你的卡路里'
        }
    }
});