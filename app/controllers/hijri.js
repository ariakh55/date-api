import events from '../events.json'
import PersianDate from 'persian-date'
import {
  toGregorian,
  toHijri
} from 'hijri-converter'

const hijriAdjustment = 1;

const getDate = (year, month, dayOfMonth, holiday) => {
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
      selectedEvents.PersianCalendar.push(day)
      if (holiday === 'both' && day.holiday) {
        isHoliday = true
      } else if (holiday === 'afg' && day.holiday && day.type === "Afghanistan") {
        isHoliday = true
      } else if (holiday === 'irn' && day.holiday && day.type === "Iran") {
        isHoliday = true
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
      selectedEvents.HijriCalendar.push(day)
      if (holiday === 'both' && day.holiday) {
        isHoliday = true
      } else if (holiday === 'afg' && day.holiday && day.type === "Islamic Afghanistan") {
        isHoliday = true
      } else if (holiday === 'irn' && day.holiday && day.type === "Islamic Iran") {
        isHoliday = true
      }
    }
  });
  return {
    persianDate: persianDate.toCalendar('persian').toLocale('en').format("DD/MM/YYYY"),
    hijriDate: hijriDate.hd + "/" + hijriDate.hm + "/" + hijriDate.hy,
    gregorianDate: gregorianDate.gd + "/" + gregorianDate.gm + "/" + gregorianDate.gy,
    events: selectedEvents,
    isHoliday: isHoliday
  }
}

const getByHijriDate = (req, res) => {
  let holiday = req.query.holiday === 'afg' ? 'afg' : req.query.holiday === 'irn' ? 'irn' : 'both'
  let year = Number(req.params.year)
  let month = Number(req.params.month)
  let dayOfMonth = Number(req.params.day)

  if (!year) {
    let date = new Date()
    let hijriDate = toHijri(date.getFullYear(), date.getMonth() + 1, date.getDate())
    year = hijriDate.hy
  }

  res.status(200).send(getDate(year, month, dayOfMonth, holiday))
}

const getHolidays = (req, res) => {
  let holiday = req.query.holiday === 'afg' ? 'afg' : req.query.holiday === 'irn' ? 'irn' : 'both'

  let d = new Date()
  let year = toHijri(d.getFullYear(),d.getMonth()-1,d.getDate()).hy
  
  let fromMonth = Number(req.params.fromMonth)
  let toMonth = Number(req.params.toMonth)

  let fromGregorianDate = toGregorian(year, fromMonth, 1)
  let fromPersianDate = new PersianDate(new Date(fromGregorianDate.gy, fromGregorianDate.gm - 1, fromGregorianDate.gd + hijriAdjustment))
  let fromHijriDate = toHijri(fromGregorianDate.gy, fromGregorianDate.gm, fromGregorianDate.gd)

  let toGregorianDate = toGregorian(year, toMonth, 1)
  let toPersianDate = new PersianDate(new Date(toGregorianDate.gy, toGregorianDate.gm - 1, toGregorianDate.gd + hijriAdjustment))
  let toHijriDate = toHijri(toGregorianDate.gy, toGregorianDate.gm, toGregorianDate.gd)

  let selectedEvents = {
    "PersianCalendar": [],
    "HijriCalendar": []
  }
  events.PersianCalendar.forEach(day => {
    if (day.month >= fromPersianDate.month() && day.month <= toPersianDate.month()) {
      if (holiday === 'both' && day.holiday) {
        selectedEvents.PersianCalendar.push(day)
      } else if (holiday === 'afg' && day.holiday && day.type === "Afghanistan") {
        selectedEvents.PersianCalendar.push(day)
      } else if (holiday === 'irn' && day.holiday && day.type === "Iran") {
        selectedEvents.PersianCalendar.push(day)
      }
    }
  });
  events.HijriCalendar.forEach(day => {
    if (day.month >= fromHijriDate.hm && day.month <= toHijriDate.hm) {
      if (holiday === 'both' && day.holiday) {
        selectedEvents.HijriCalendar.push(day)
      } else if (holiday === 'afg' && day.holiday && day.type === "Islamic Afghanistan") {
        selectedEvents.HijriCalendar.push(day)
      } else if (holiday === 'irn' && day.holiday && day.type === "Islamic Iran") {
        selectedEvents.HijriCalendar.push(day)
      }
    }
  });
  res.status(200).send({
    holidays: selectedEvents
  })
}

export {
  getByHijriDate,
  getHolidays
}
