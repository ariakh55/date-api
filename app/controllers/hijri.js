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
} from '../tools/tools'

const hijriAdjustment = 1;

const getDate = (year, month, dayOfMonth, eventType) => {
  let isHoliday = false

  let gregorianDate = toGregorian(year, month, dayOfMonth)
  let persianDate = new PersianDate(new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd + hijriAdjustment))
  let hijriDate = toHijri(gregorianDate.gy, gregorianDate.gm, gregorianDate.gd)

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
    if (day.day === gregorianDate.gh && day.month === gregorianDate.gm) {
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
    gregorianDate: gregorianDate.gd + "/" + gregorianDate.gm + "/" + gregorianDate.gy,
    timestamp: new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd).getTime(),
    events: selectedEvents,
    isHoliday: isHoliday
  }
}

const getByHijriDate = (req, res) => {
  handleErrors(req, res, () => {
    let eventType = req.query.eventType === 'afg' ? 'afg' : req.query.eventType === 'irn' ? 'irn' : 'both'
    let year = Number(req.params.year)
    let month = Number(req.params.month)
    let dayOfMonth = Number(req.params.day)

    if (!year) {
      let date = new Date()
      let hijriDate = toHijri(date.getFullYear(), date.getMonth() + 1, date.getDate())
      year = hijriDate.hy
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
      let d = new Date()
      let year = toHijri(d.getFullYear(), d.getMonth() - 1, d.getDate()).hy
      fromYear = year;
      toYear = year;
    }

    let fromGregorianDate = toGregorian(fromYear, fromMonth, 1)
    let fromPersianDate = new PersianDate(new Date(fromGregorianDate.gy, fromGregorianDate.gm - 1, fromGregorianDate.gd + hijriAdjustment))
    let fromHijriDate = toHijri(fromGregorianDate.gy, fromGregorianDate.gm, fromGregorianDate.gd)

    let toGregorianDate = toGregorian(toYear, toMonth, 31)
    let toPersianDate = new PersianDate(new Date(toGregorianDate.gy, toGregorianDate.gm - 1, toGregorianDate.gd + hijriAdjustment))
    let toHijriDate = toHijri(toGregorianDate.gy, toGregorianDate.gm, toGregorianDate.gd)

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
  getByHijriDate,
  getHolidays
}
