const util = require('util');

function hasPresence(value) {
    return value && value.trim() !== '';
}

function hasInclusionOf(value, arr) {
    return arr.indexOf(value) > -1;
}

function hasExclusionOf(value, arr) {
    return arr.indexOf(value) == -1;
}

function hasLengthLessThan(value, max) {
    var length = value.length;
    return length < max;
}

function hasLengthGreaterThan(value, min) {
    var length = value.length;
    return length > min;
}

function hasNumGreaterThan(value, min) {
    return Number(value) > min;
}

//hasString("nobody@nowhere.com", ".com");
function hasString(value, required_string) {
    return value.indexOf(required_string) > -1;
}

function hasTime(beDate, enDate, beTime, enTime) {
    enDate = enDate ? beDate : enDate;
    const beginTime = util.formatDate(`${beDate} ${beTime}:00`);
    const endTime = util.formatDate(`${enDate} ${enTime}:00`);
    const now = new Date().getTime();
    if (now > endTime.getTime()) {
        const hintText = "结束时间需大于当前时间";
        util.alert(hintText);
        return false;
    } else if (beginTime.getTime() > endTime.getTime()) {
        const hintText = "开始时间需小于结束时间";
        util.alert(hintText);
        return false;
    } else {
        return true;
    }
}

function hasInvalidPhone(phone) {
    const phoneRegex = /^[0-9]{8,13}$/;
    const result = phoneRegex.test(phone);
    if (!result && phone) {    
        return true;
    }
}

function trimFormData(obj) {
    for (const prop in obj) {
        obj[prop] = obj[prop].trim();
    }
    return obj;
}

function hasInvalidEmail(email) {
    const emailRe = /^[\w.%+\-]+@[\w.\-]+\.[A-Za-z]{2,6}$/;
    const result = emailRe.test(email);
    if (!result && email) {    
        return true;
    }
}

module.exports = {
    hasPresence,
    hasInclusionOf,
    hasExclusionOf,
    hasLengthLessThan,
    hasLengthGreaterThan,
    hasNumGreaterThan,
    hasString,
    hasTime,
    hasInvalidPhone,
    trimFormData,
    hasInvalidEmail
}