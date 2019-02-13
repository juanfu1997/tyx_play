const util = require('./util');

// 获取用户openid
function GetSessionKey(dataObj) {
	return util.get('/KorjoApi/GetSessionKey', dataObj)
}
//保存用户信息
function SaveTyxPlayUserInfo(data){
	return util.post('/tyxcms/user.php/save', data)
}

//根据id获取用户信息
function GetUserInfoById(id){
	return util.get('/tyxcms/user.php/get_by_id',{ id })
}

//根据openid获取用户信息
function GetUserInfoByOpenId(openid) {
	return util.get('/tyxcms/user.php/get_by_openid', {openid});
}
//生成信件图片 {receiver:接收者,sender:发送者,content:内容}
function SaveLetterInfo(data){
	return util.post('/tyxcms/letter.php/wellsoon', data )
}

//保存一码一贴信息 【url:跳转地址以及信件id, userid, subject_id：项目id,picture：信件图片链接,contentJSON：信件内容{ receiver,sender,content } 】
function SaveUniquecodeInfo(data){
	return util.post('/tyxcms/uniquecode.php/save', data)
}

//根据id获取一码一贴信息
function GetUniquecodeInfo(id){
	return util.get('/tyxcms/uniquecode.php/get',{id})
}

module.exports = {
	GetSessionKey,
	SaveTyxPlayUserInfo,
	GetUserInfoById,
	GetUserInfoByOpenId,
	SaveLetterInfo,
	SaveUniquecodeInfo,
	GetUniquecodeInfo
}