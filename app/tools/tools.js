const shamsiStartDayOfHijri = 14
const shamsiStartMonthOfHijri = 7
const shamsiStartYearOfHijri = 1440

import {
  validationResult
} from 'express-validator'

const dateIsInRange = (fromYear, fromMonth, fromDay, toYear, toMonth, toDay, year, month, day) => {
  return dateIsLargerThan(fromYear, fromMonth, fromDay, year, month, day) && dateIsSmallerThan(toYear, toMonth, toDay, year, month, day)
}

const getHijriYearOfTheDay = (day) => {
  return (day.month > shamsiStartMonthOfHijri && day.day > shamsiStartDayOfHijri) ? shamsiStartYearOfHijri : shamsiStartYearOfHijri + 1
}

const getShamsiDateFromHijriDay = (day, toGregorian, PersianDate) => {
  let gdate = toGregorian(getHijriYearOfTheDay(day), day.month, day.day)
  let date = new Date(gdate.gy, gdate.gm - 1, gdate.gd)
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
  return new PersianDate(date)
}

const dateIsLargerThan = (fromYear, fromMonth, fromDay, year, month, day) => {
  let result = false
  if (year === fromYear && month === fromMonth && day >= fromDay) {
    result = true
  } else if (year === fromYear && month > fromMonth) {
    result = true
  } else if (year > fromYear) {
    result = true
  }
  return result
}

const dateIsSmallerThan = (toYear, toMonth, toDay, year, month, day) => {
  let result = false
  if (year === toYear && month === toMonth && day <= toDay) {
    result = true
  } else if (year === toYear && month < toMonth) {
    result = true
  } else if (year < toYear) {
    result = true
  }
  return result
}

const createErrorMessages = (errors) => {
  let messages = ''
  for (let i = 0; i < errors.array().length; i++) {
    messages += errors.array()[i].msg
    if (i !== errors.array().length - 1) {
      messages += '\n'
    }
  }
  return messages
}

const handleErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).send({
      msg: createErrorMessages(errors)
    })
  } else {
    next()
  }
}

export {
  handleErrors,
  dateIsInRange,
  getShamsiDateFromHijriDay
}
