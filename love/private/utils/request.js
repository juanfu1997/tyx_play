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

//保存信件信息
function SaveLetterInfo(receiver,sender,content){
	return util.post('/tyxcms/letter.php',{ receiver,sender,content })
}

//保存一码一贴信息
//data{url,userid,subject_id,picture,contentJSON}
function SaveUniquecodeInfo(data){
	return util.post('/tyxcms/uniquecode.php/save',data)
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