module.exports = { config }

const util = require('../utils/util');
/**模板配置
 {
    config_title:模板名字,
    config_logo:信纸右下角logo,//为空时不显示
    fontStyle:标题自已样式,
    positiveImg:正面图片,
    stamp:邮票,
    postmark:邮戳,
    letterImg:信纸圆形图片,//为空时自动截取positiveImg的部分截图
    letterPaper:信纸缩略图,
}
优化可能：图片链接优化为：_config_配置名+字段
**/
const _config_= {
    config_tyx:{
        config_title:"亭驿下圣诞节",
        config_logo:'tyx_logo.png',
        fontStyle:'color:#7f6666;',
        positiveImg:'tyx_positiveImg.jpg',
        stamp:'tyx_stamp.png',
        postmark:'tyx_postmark.png',
        letterImg:'',
        letterPaper:'tyx_letterPaper.jpg',
    },
    config_korjo:{
        config_title:"寄信小邮票",
        config_logo:'logo2.png',
        fontStyle:'color:#7f6666;',
        positiveImg:'',//korjo模板为定位城市图片，服务器获取
        stamp:'',//korjo模板为定位城市邮票，服务器获取
        postmark:'postmark_blackBg.png',
        letterImg:'',
        letterPaper: util.data.img + 'postcard_example_back.jpg'
    },
    config_SCNU:{
        config_title:"华师",
        config_logo:'',
        fontStyle:'color:#80676b;',
        positiveImg:'SCNU_positiveImg.jpg',//korjo模板为定位城市图片，服务器获取
        stamp:'SCNU_stamp.png',//korjo模板为定位城市邮票，服务器获取
        postmark:'SCNU_postmark.png',
        letterImg: util.data.img + 'SCNU_letterImg.png',
        letterPaper: 'postcard_example_normal.jpg'
    },
    config_uglyDuckling:{
        config_title:"丑小鸭",
        config_logo:'',
        fontStyle:'color:#80676b;',
        positiveImg:'uglyDuckling_positiveImg.jpg',
        stamp:'uglyDuckling_stamp.png',
        postmark:'uglyDuckling_postmark.png',
        letterImg: util.data.img + 'uglyDuckling_letterImg.png',
        letterPaper: 'postcard_example_normal.jpg'
    }
}
const fns = {

}
function setConfigName(){
    // var length = 0;
    util.each(_config_,(i,v)=>{
        v.config = i;
        // length++;
    })
    // _config_.length = length;
}
function initizlizeConfig(){
    const pages = getCurrentPages()
    const _this = pages[pages.length - 1]
    var config = [];
    util.each(_config_,(i,v)=>{
        console.log('config',i,v)
        config.push(v)
    })
    _this.setData({config})
}

function config(options = {}){
    const pages = getCurrentPages()
    const _this = pages[pages.length - 1]
    // Object.assign(_config_,{
    //     options,
    // })
    setConfigName();
    initizlizeConfig();
    _this.setData({_config_})
    Object.assign(_this,fns)
}
// var config_tyx = {
//     config_title:"亭驿下圣诞节",
//     positiveImg:'tyx_positiveImg.jpg',
//     stamp:'tyx_stamp.png',
//     postmark:'tyx_postmark.png',
//     letterPaper:'tyx_letterPaper.jpg'
// }
// function exportConfig(){
// 	var configObject = [
// 		config_tyx,
// 	];
// 	console.log('2',configObject)
// 	return configObject;
// }
