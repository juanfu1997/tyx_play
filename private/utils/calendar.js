const util = require('./util');

// ***万年历接口开始
//黄历
function GetIndexBgImageInfo(date) {
	//date: 2018-03-12
	return util.get('/KorjoApi/GetIndexBgImageInfo', {date});
}

function GetRestDateList(yearmonth) {
	//2018-01
	return util.get('http://localhost/tyxcms/public/calendar_api.php/restdays', {yearmonth});
}

//获取签到信息
function GetPrizeSigninInfo(userid) {
    return util.get('/TYXApi/GetPrizeSigninInfo', {userid});
}

function SaveUserEvent(jsonData) {
    return util.get('/KorjoApi/SaveUserEvent', {jsonData: JSON.stringify(jsonData)});
}

function GetCalendarUserEvent(openid,calendar_date,isdate) {
    return util.get('/KorjoApi/GetCalendarUserEvent', {openid, calendar_date, isdate})
}

function GetCurriculumBgimageInfo(date) {
	return util.get('/GspaceApi/GetCurriculumBgimageInfo', {date});
}

function GetCurriculumInformationList() {
	return util.get('/GspaceApi/GetCurriculumInformationList');
}

function GetCurriculumInformationInfo(id) {
	return util.get('/GspaceApi/GetCurriculumInformationInfo', {id});
}

function SaveMakeAppointment(username, phone, number_people) {
	return util.post('/GspaceApi/SaveMakeAppointment', {username, phone, number_people});
}

function GetCourseArrangementList(date) {
	//2018-03
	return util.get('/GspaceApi/GetCourseArrangementList', {date});
}

function DeleteSendMsg(event_id) {
	return util.get('/KorjoApi/DeleteSendMsg', {event_id, wxpublic_id: util.data.appid});
}

function GetSingleCommonList(date) {
	// date=2018-03 
	return util.get('/GspaceApi/GetSingleCommonList', {date});
}
// 万年历接口结束 ***


//阿拉伯数字转成中文数字
function getNumChar(num) {
	const chnNumChar = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
	return chnNumChar[num - 1];
}

//根据new Date()来获取星期几
function getWeekDay(date) {
	let chineseWeekday = ["一","二","三","四","五","六", "日"],
	      weekDay = date.getDay();
	if (weekDay === 0) {
		weekDay = 7;
	}
	return chineseWeekday[weekDay - 1]
}

function restrictDate(year, month, dirs) {
    const thisYear = new Date().getFullYear();
    if (year === thisYear && month === 1) {
      dirs.isLeftHidden = true;
    }
    if (year === thisYear && month === 12) {
      dirs.isRightHidden = true;
    }
    return dirs;
}

function getMoreSpots(totalSpots, allDays) {
    if (totalSpots > 28 && totalSpots <= 35) {
        var moreContainerNum = 35 - totalSpots;
        for (var ii = 0; ii < moreContainerNum; ii += 1) {
          allDays.push({});
        }
    } else if (totalSpots > 35) {
        var moreContainerNum = 42 - totalSpots;
        for (var ii = 0; ii < moreContainerNum; ii += 1) {
          allDays.push({});
        }
    }
    return allDays;
}


//获取休息日
function GetRestDays(mm, yyyy) {
    return GetRestDateList(`${yyyy}-${mm}`).then((res) => {
    //rest_value:2 //2法定休息//1周末休
      const offDays = [];
      for (let value of res) {
        let offDay = Number(value.day);
        offDays.push(offDay);
      }
      return offDays;
    })
}

function markOffDay(day, offDays) {
    if (offDays.indexOf(day) > -1) {
        return true;
    }
}


function createMonthData(WholeMonth, mm, yyyy) {
    //确认每月天数DaysOfMonth
    let DaysOfMonth = checkDaysOfMonth(mm, yyyy);
    //得到休息日（周末加法定休）
    return GetRestDays(mm, yyyy).then((res) => {
        //周数以0开始
        let weekIndex = 0;
        const firstOfMonth = new Date(yyyy, mm - 1, 1);
        let firstWeekday = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay();
        for (let iii = 0; iii < DaysOfMonth; iii += 1) {
            //第一周占据几天
            let firstWeekAllDays = 7 - firstWeekday + 1;
            if (iii >= firstWeekAllDays && iii == firstWeekAllDays + 7 * weekIndex) {
                //除了首周，每7天增加周数
                weekIndex += 1;
            }
            if (weekIndex == 0) {
                WholeMonth[0].weekdays[firstWeekday + iii - 1].num = iii + 1;
                WholeMonth[0].weekdays[firstWeekday + iii - 1].off = markOffDay(iii + 1, res);
            } else if (iii < firstWeekAllDays + 7 * weekIndex && iii >= firstWeekAllDays + 7 * (weekIndex - 1)) {
                WholeMonth[weekIndex].weekdays[iii - firstWeekAllDays - 7 * (weekIndex - 1)].num = iii + 1;
                WholeMonth[weekIndex].weekdays[iii - firstWeekAllDays - 7 * (weekIndex - 1)].off = markOffDay(iii + 1, res);
            }           
        }
        console.log("WholeMonth: ", WholeMonth);
        return WholeMonth;
    });
}

function checkDaysOfMonth(mm, yyyy) {
    var daysofmonth;
    if ((mm == 4) || (mm ==6) || (mm ==9) || (mm == 11)){
        daysofmonth = 30;
    } else {
        daysofmonth = 31;
        if (mm == 2){
            if (yyyy/4 - parseInt(yyyy/4, 10) != 0){
                daysofmonth = 28;
            } else {
                if (yyyy/100 - parseInt(yyyy/100, 10) != 0) {
                    daysofmonth = 29;
                }else{
                    if (yyyy/400 - parseInt(yyyy/400, 10) != 0) {
                        daysofmonth = 28;
                    }else{
                        daysofmonth = 29;
                    }
                }
            }
        }
    }
    return daysofmonth;
}



module.exports = {
	GetIndexBgImageInfo,
	getNumChar,
	getWeekDay,
	createMonthData,
	GetRestDateList,
	GetIndexBgImageInfo,
	GetCurriculumBgimageInfo,
	GetCurriculumInformationList,
	GetCurriculumInformationInfo,
	SaveMakeAppointment,
	GetCourseArrangementList,
	SaveUserEvent,
	GetCalendarUserEvent,
	DeleteSendMsg,
	GetSingleCommonList,
    GetPrizeSigninInfo
}