const initialize = require("../../private/initialize");
const {util, wxfun, request, Bar} = initialize;

Page({
	data: {
        img: util.data.img,
        subject_id: 1, //活动id
        isUploadHidden: false,
        isHintHidden: true,
        photo: "https://www.korjo.cn/xcx/tyx_playImg/default.jpg"
    },
    onLoad() {
        //设置导航栏高度与title
        const pages = getCurrentPages();
        const bar = new Bar('亭驿下玩玩玩', pages, this);
        this.setData({bar});    
    },
    upLoadImg() {
        let count = 1;
        wxfun.chooseImg(count, (res) => {
            //上传图片到服务器
            const temPath = res.tempFilePaths[0];  
            request.upload(temPath, "image").then((path) => {
                const photo = util.addHost(path);
                this.setData({photo, isUploadHidden: true});
            });    
        });
    },
    goHome() {
        wxfun.goHome();
    },
    submitData() {
        //获取专属二维码链接
        let link = "https://www.korjo.cn/hema?id=";
        const {subject_id, photo} = this.data;
        if (photo.indexOf("default") > - 1) {
            wxfun.alert("请先上传图片");
            return;
        }
        const data = {
            url: link,
            subject_id,
            photo,
            userid: wxfun.getStored(util.data.userid)
        };
        request.getPic(photo).then(response => {
            if (response.path) {
                data.picture = response.path;
                request.SaveUniquecode(data).then(res => {
                    console.log(res);
                    if (res.id) {
                        this.setData({isHintHidden: false})
                    }
                });
            } else {
                wxfun.alert("保存错误");
            }
        });
    }
});