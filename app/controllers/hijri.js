import events from '../events.json'
import PersianDate from 'persian-date'
import {
  toGregorian,
  toHijri
} from 'hijri-converter'

const getDate = (year, month, dayOfMonth, holiday) => {
  let isHoliday = false
  let hijriAdjustment = 1;

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

export {
  getByHijriDate
}
