const util = require('./util');

//根据链接生成二维码
function getQRcode(link) {
	return util.get('/tyxcms/qrcode.php', {link});
}

//上传照片生成加盒马背景图片
function getPic(photo) {
	return util.post('/tyxcms/pic.php', {photo});
}

// 获取用户openid
function GetSessionKey(dataObj) {
	return util.get('/KorjoApi/GetSessionKey', dataObj)
}

//获取二维码 page = "pages/instructions/instructions"
function CreateWxCode(wxpublic_id, scene, page) {
	return util.get('/korjoApi/CreateWxCode', {wxpublic_id, scene, page})
}

function GetRestDateList(yearmonth) {
	//2018-01
	return util.get('/KorjoApi/GetRestDateList', {yearmonth});
	//rest_value:2 //2法定休息//1周末休
}

//上传图片，视频，音频 , type: image movie audio
function upload(filePath, type) {
	util.loading();
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: `${util.data.host}/KorjoApi/AdminUpload`,
			name: 'file',
			formData: {"path": "tyx_play", "type": type},
			filePath,
			success: (res) => {
				util.hideLoading();
				resolve(res.data);
			},
			fail: (error) => {
				reject(error);
			}
		})
	});
}

//保存用户信息信息,修改时加id
//"username", "photo", "openid"
function SaveUser(data) {
	return util.post('/tyxcms/user.php/save', data);
}

//根据id获取用户信息
function GetUserInfoById(id) {
	return util.get('/tyxcms/user.php/get_by_id', {id});
}

//根据openid获取用户信息
function GetUserInfoByOpenId(openid) {
	return util.get('/tyxcms/user.php/get_by_openid', {openid});
}

//保存一贴一码数据
//"url", "subject_id", "userid", 'picture', 'photo'
function SaveUniquecode(data) {
	return util.post('/tyxcms/uniquecode.php/save', data);
}

//根据id获取一贴一码数据
function GetUniquecode(id) {
	return util.get('/tyxcms/uniquecode.php/get', {id});
}

//生成情书的图片
function createLetter(data) {
	return util.post('/tyxcms/public/letter.php', data);
}

//定时消息提醒
function sendTimedMsg(data) {
	return util.post('http://localhost/tyx/public/msg.php', data);
}

module.exports = {
	getQRcode,
	getPic,
	GetSessionKey,
	CreateWxCode,
	GetRestDateList,
	upload,
	SaveUser,
	GetUserInfoById,
	GetUserInfoByOpenId,
	SaveUniquecode,
	GetUniquecode,
	createLetter,
	sendTimedMsg
}