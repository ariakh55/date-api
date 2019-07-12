import events from '../events.json'
import persianDate from 'persian-date'
import {
  toGregorian,
  toHijri
} from 'hijri-converter'

const getDate = (year, month, dayOfMonth, holiday) => {
  let isHoliday = false
  let hijriAdjustment = 1;

  let greDate = toGregorian(year, month, dayOfMonth)
  let d = new Date(greDate.gy, greDate.gm - 1, greDate.gd + hijriAdjustment)
  let perDate = new persianDate(d)

  let selectedEvents = {
    "PersianCalendar": [],
    "GregorianCalendar": [],
    "HijriCalendar": []
  }
  events.PersianCalendar.forEach(day => {
    if (day.day === perDate.date() && day.month === perDate.month()) {
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
    if (day.day === d.getDate() && day.month === d.getMonth() + 1) {
      selectedEvents.GregorianCalendar.push(day)
    }
  });

  events.HijriCalendar.forEach(day => {
    if (day.day === dayOfMonth && day.month === month) {
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
    persianDate: perDate.toCalendar('persian').toLocale('en').format("DD/MM/YYYY"),
    hijriDate: dayOfMonth + "/" + month + "/" + year,
    gregorianDate: d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
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
    let hijriDate = toHijri(date.getFullYear, date.getMonth() + 1, date.getDate())
    year = hijriDate.hy
  }

  res.status(200).send(getDate(year, month, dayOfMonth, holiday))
}

const getToday = (req, res) => {
  let holiday = req.query.holiday === 'afg' ? 'afg' : req.query.holiday === 'irn' ? 'irn' : 'both'
  let date = new Date()
  let hijriDate = toHijri(date.getFullYear, date.getMonth() + 1, date.getDate())
  res.status(200).send(getDate(hijriDate.hy, hijriDate.hm, hijriDate.hd, holiday))
}

export {
  getByHijriDate,
  getToday
}
