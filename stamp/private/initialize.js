//外部js一起引用到initialize
module.exports = {
	//WxParse: require('./libs/wxParse/wxParse'), //html元素转换为wxml
	util: require('./utils/util'),
	wxfun: require('./utils/wxfun'),
	authorize: require('./utils/authorize'),
	Bar: require('./shared/bar/bar'),
	alert: require('./shared/alert/alert').alert,
	validations: require('./utils/validations'),
	request: require('./utils/request'),
	map:require('./utils/map'),
	tem_config:require('./config/templte_config').config
}
