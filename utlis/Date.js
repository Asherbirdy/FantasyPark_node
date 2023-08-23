const CustomError = require('../errors');

function isValidDateFormat(dateString) {
  function test(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return false;
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }

    const maxDay = new Date(year, month, 0).getDate();
    if (day > maxDay) {
      return false;
    }

    return true;
  }
  if (!test(dateString)) {
    throw new CustomError.BadRequestError(`${dateString} is not a valid Date`);
  }

  return;
}

// 將UTC時間+8小時  convertToTaiwanTime(new Date())
function convertToTaiwanTime(utcDate) {
  return new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);
}

module.exports = { isValidDateFormat, convertToTaiwanTime };
