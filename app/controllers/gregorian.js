import events from '../events.json'
import PersianDate from 'persian-date'

import {
  toHijri,
  toGregorian
} from 'hijri-converter'

import {
  handleErrors,
  getShamsiDateFromHijriDay,
  dateIsInRange
} from '../tools/tools'

const hijriAdjustment = 1;

const getDate = (year, month, dayOfMonth, eventType) => {
  let isHoliday = false

  let gregorianDate = new Date(year, month - 1, dayOfMonth)
  let persianDate = new PersianDate(gregorianDate)
  let hijriDate = toHijri(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate())


  let selectedEvents = {
    "PersianCalendar": [],
    "GregorianCalendar": [],
    "HijriCalendar": []
  }
  events.PersianCalendar.forEach(day => {
    if (day.day === persianDate.date() && day.month === persianDate.month()) {
      if (eventType === 'both') {
        selectedEvents.PersianCalendar.push(day)
        isHoliday = day.holiday ? true : isHoliday
      } else if (eventType === 'afg' && day.type === "Afghanistan") {
        selectedEvents.PersianCalendar.push(day)
        isHoliday = day.holiday ? true : isHoliday
      } else if (eventType === 'irn' && day.type === "Iran") {
        selectedEvents.PersianCalendar.push(day)
        isHoliday = day.holiday ? true : isHoliday
      }
    }
  });

  events.GregorianCalendar.forEach(day => {
    if (day.day === gregorianDate.getDate() && day.month === gregorianDate.getMonth() + 1) {
      selectedEvents.GregorianCalendar.push(day)
    }
  });

  events.HijriCalendar.forEach(day => {
    if (day.day === hijriDate.hd && day.month === hijriDate.hm) {
      if (eventType === 'both') {
        selectedEvents.PersianCalendar.push(day)
        isHoliday = day.holiday ? true : isHoliday
      } else if (eventType === 'afg' && day.type === "Islamic Afghanistan") {
        selectedEvents.PersianCalendar.push(day)
        isHoliday = day.holiday ? true : isHoliday
      } else if (eventType === 'irn' && day.type === "Islamic Iran") {
        selectedEvents.PersianCalendar.push(day)
        isHoliday = day.holiday ? true : isHoliday
      }
    }
  });
  return {
    persianDate: persianDate.toLocale('en').format("DD/MM/YYYY"),
    hijriDate: hijriDate.hd + "/" + hijriDate.hm + "/" + hijriDate.hy,
    gregorianDate: gregorianDate.getDate() + "/" + (gregorianDate.getMonth() + 1) + "/" + gregorianDate.getFullYear(),
    events: selectedEvents,
    isHoliday: isHoliday
  }
}

const getByGregorianDate = (req, res) => {
  handleErrors(req, res, () => {
    let eventType = req.query.eventType === 'afg' ? 'afg' : req.query.eventType === 'irn' ? 'irn' : 'both'
    let year = Number(req.params.year)
    let month = Number(req.params.month)
    let dayOfMonth = Number(req.params.day)

    if (!year) {
      let date = new Date()
      year = date.getFullYear()
    }

    res.status(200).send(getDate(year, month, dayOfMonth, eventType))
  })
}

const getToday = (req, res) => {
  let eventType = req.query.eventType === 'afg' ? 'afg' : req.query.eventType === 'irn' ? 'irn' : 'both'
  let date = new Date()
  res.status(200).send(getDate(date.getFullYear(), date.getMonth() + 1, date.getDate(), eventType))
}

const getHolidays = (req, res) => {
  handleErrors(req, res, () => {
    let eventType = req.query.eventType === 'afg' ? 'afg' : req.query.eventType === 'irn' ? 'irn' : 'both'

    let fromMonth = Number(req.params.fromMonth)
    let toMonth = Number(req.params.toMonth)
    let fromYear = Number(req.params.fromYear)
    let toYear = Number(req.params.toYear)

    if (!fromYear || !toYear) {
      let year = new Date().getFullYear()
      fromYear = year;
      toYear = year;
    }

    let fromGregorianDate = new Date(fromYear, fromMonth - 1, 1)
    fromGregorianDate.setTime(fromGregorianDate.getTime() - fromGregorianDate.getTimezoneOffset() * 60 * 1000);
    let fromPersianDate = new PersianDate(fromGregorianDate)
    let fromHijriDate = toHijri(fromGregorianDate.getFullYear(), fromGregorianDate.getMonth() + 1, fromGregorianDate.getDate())

    let toGregorianDate = new Date(toYear, toMonth - 1, 31)
    toGregorianDate.setTime(toGregorianDate.getTime() - toGregorianDate.getTimezoneOffset() * 60 * 1000);
    let toPersianDate = new PersianDate(toGregorianDate)
    let toHijriDate = toHijri(toGregorianDate.getFullYear(), toGregorianDate.getMonth() + 1, toGregorianDate.getDate())

    let selectedEvents = {
      "PersianCalendar": [],
      "HijriCalendar": []
    }
    events.PersianCalendar.forEach(day => {
      if (dateIsInRange(
          fromPersianDate.year(), fromPersianDate.month(), fromPersianDate.date(),
          toPersianDate.year(), toPersianDate.month(), toPersianDate.date(),
          fromPersianDate.year(), day.month, day.day)) {
        if (eventType === 'both' && day.holiday) {
          selectedEvents.PersianCalendar.push(day)
        } else if (eventType === 'afg' && day.holiday && day.type === "Afghanistan") {
          selectedEvents.PersianCalendar.push(day)
        } else if (eventType === 'irn' && day.holiday && day.type === "Iran") {
          selectedEvents.PersianCalendar.push(day)
        }
      }
    });
    events.HijriCalendar.forEach(day => {
      if (dateIsInRange(
          fromHijriDate.hy, fromHijriDate.hm, fromHijriDate.hd,
          toHijriDate.hy, toHijriDate.hm, toHijriDate.hd,
          fromHijriDate.hy, day.month, day.day)) {
        if (eventType === 'both' && day.holiday) {
          let pdate = getShamsiDateFromHijriDay(day, toGregorian, PersianDate)
          day['persianDate'] = (pdate.date() + hijriAdjustment) + '/' + pdate.month()
          selectedEvents.HijriCalendar.push(day)
        } else if (eventType === 'afg' && day.holiday && day.type === "Islamic Afghanistan") {
          let pdate = getShamsiDateFromHijriDay(day, toGregorian, PersianDate)
          day['persianDate'] = (pdate.date() + hijriAdjustment) + '/' + pdate.month()
          selectedEvents.HijriCalendar.push(day)
        } else if (eventType === 'irn' && day.holiday && day.type === "Islamic Iran") {
          let pdate = getShamsiDateFromHijriDay(day, toGregorian, PersianDate)
          day['persianDate'] = (pdate.date() + hijriAdjustment) + '/' + pdate.month()
          selectedEvents.HijriCalendar.push(day)
        }
      }
    });
    res.status(200).send({
      holidays: selectedEvents
    })
  })
}

export {
  getByGregorianDate,
  getToday,
  getHolidays
}
