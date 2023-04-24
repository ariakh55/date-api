import events from '../events.json'
import PersianDate from 'persian-date'

import {
  toGregorian,
  toHijri
} from 'hijri-converter'

import {
  handleErrors,
  getShamsiDateFromHijriDay,
  dateIsInRange
} from '../tools/tools.js'

const hijriAdjustment = 1;

const getDate = (year, month, dayOfMonth, eventType) => {
  let isHoliday = false

  let persianDate = new PersianDate([year, month, dayOfMonth])
  let gregorianDate = new Date(persianDate.toCalendar('gregorian').toLocale('en').format())
  persianDate = persianDate.toCalendar('persian')
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
    persianDate: persianDate.toCalendar('persian').toLocale('en').format("DD/MM/YYYY"),
    hijriDate: hijriDate.hd + "/" + hijriDate.hm + "/" + hijriDate.hy,
    gregorianDate: gregorianDate.getDate() + "/" + (gregorianDate.getMonth() + 1) + "/" + gregorianDate.getFullYear(),
    timestamp: gregorianDate.getTime(),
    events: selectedEvents,
    isHoliday: isHoliday
  }
}

const getByPersianDate = (req, res) => {
  handleErrors(req, res, () => {
    let eventType = req.query.eventType === 'afg' ? 'afg' : req.query.eventType === 'irn' ? 'irn' : 'both'
    let year = Number(req.params.year)
    let month = Number(req.params.month)
    let dayOfMonth = Number(req.params.day)

    if (!year) {
      year = new PersianDate().year()
    }

    res.status(200).send(getDate(year, month, dayOfMonth, eventType))
  })
}

const getHolidays = (req, res) => {
  handleErrors(req, res, () => {
    let eventType = req.query.eventType === 'afg' ? 'afg' : req.query.eventType === 'irn' ? 'irn' : 'both'

    let fromMonth = Number(req.params.fromMonth)
    let toMonth = Number(req.params.toMonth)
    let fromYear = Number(req.params.fromYear)
    let toYear = Number(req.params.toYear)
    if (!fromYear || !toYear) {
      let year = new PersianDate().year()
      fromYear = year;
      toYear = year;
    }

    let fromPersianDate = new PersianDate([fromYear, fromMonth, 1])
    let toPersianDate = new PersianDate([toYear, toMonth, 31])
    let fromGregorianDate = new Date(fromPersianDate.toCalendar('gregorian').toLocale('en').format())
    let toGregorianDate = new Date(toPersianDate.toCalendar('gregorian').toLocale('en').format())
    fromPersianDate = fromPersianDate.toCalendar('persian')
    toPersianDate = toPersianDate.toCalendar('persian')
    let fromHijriDate = toHijri(fromGregorianDate.getFullYear(), fromGregorianDate.getMonth() + 1, fromGregorianDate.getDate())
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
  getByPersianDate,
  getHolidays
}
