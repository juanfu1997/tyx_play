const initialize = require("../../../private/initialize");
const {util, wxfun, authorize, request, Bar, validations, alert} = initialize;
const {list} = require("../../data/data"); //食物数据

Page({
	data: {
        img: util.data.img,
        isItemListHidden: true,
        choosenItemList: [],
        show: 'show',
        total_animation: 'fideIn'
    },
    onLoad() {
        alert();//获取alert模板数据与方法
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        this.setData({bar, height: wx.getSystemInfoSync().windowHeight});
        this.getList();    
    },
    getList() {
        const data = {};
        Object.assign(data, list);
        this.setData({list: data});
    },
    chooseType(e) {
        const {i} = wxfun.getDataset(e);
        this.setData({
            activeIdx: i,
            isItemListHidden: false
        });
    },
    //增加或减少食物
    chooseItem(e) {
        const {i} = wxfun.getDataset(e);
        const {choosenItemList, list, activeIdx} = this.data;
        const choosenItems = {kal: 0, kilo: 0};
        list[activeIdx].items.activeList = list[activeIdx].items.activeList ? list[activeIdx].items.activeList : [];
        list[activeIdx].items.activeList[i] = ! list[activeIdx].items.activeList[i];
        if (list[activeIdx].items.activeList[i]) {
            //增加食物
            list[activeIdx].items.kals[i] = list[activeIdx].items.kals[i].replace(/\s?\/\s?/, '/');
            let name = list[activeIdx].items.titles[i],
                kal  = list[activeIdx].items.kals[i].split("/")[0],
                kilo = list[activeIdx].items.kals[i].split("/")[1];
            choosenItemList.push({
                kal,
                name,
                kilo,
                content: name + "（" + kal + "kal/" + kilo + "克）"
            });
        } else {
            //减少食物
            const index = choosenItemList.findIndex(elem => {
                return elem.name == list[activeIdx].items.titles[i];
            });
            choosenItemList.splice(index, 1);
        }
        for (let v of choosenItemList) {
            choosenItems.kal += Number(v.kal);
            choosenItems.kilo += Number(v.kilo);
        }
        if (choosenItemList.length) {
            choosenItems.total = choosenItems.kal + "kal，" + choosenItems.kilo + "克";
            choosenItems.content = choosenItemList.map(elem => {
                return elem.content;
            }).join('；');
        }
        this.setData({
            choosenItemList, 
            list, 
            choosenItems, 
            isItemListHidden: true,
            total_animation: ''
        });
        setTimeout(() => {
            this.setData({total_animation: 'fideIn'});
        }, 100);
    },
    //清空数据
    clearData() {
        this.getList();
        this.setData({choosenItemList: [], choosenItems: {}});
    },
    close() {
        this.setData({
            isItemListHidden: true
        });
    },
    goBmi() {
        wxfun.redirectPage("../bmi/bmi");
    },
    onShareAppMessage(res) {
        return {
            title: '燃烧你的卡路里'
        }
    }
});