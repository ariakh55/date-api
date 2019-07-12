import events from '../events.json'
import PersianDate from 'persian-date'
import {
  toHijri
} from 'hijri-converter'

const getDate = (year, month, dayOfMonth, holiday) => {
  let isHoliday = false

  let hijriDate = toHijri(year, month, dayOfMonth)
  let gregorianDate = new Date(year, month - 1, dayOfMonth);
  let persianDate = new PersianDate(gregorianDate)


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
    if (day.day === gregorianDate.getDate() && day.month === gregorianDate.getMonth()) {
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
    persianDate: persianDate.toLocale('en').format("DD/MM/YYYY"),
    hijriDate: hijriDate.hd + "/" + hijriDate.hm + "/" + hijriDate.hy,
    gregorianDate: gregorianDate.getDate() + "/" + (gregorianDate.getMonth() + 1) + "/" + gregorianDate.getFullYear(),
    events: selectedEvents,
    isHoliday: isHoliday
  }
}

const getByGregorianDate = (req, res) => {
  let holiday = req.query.holiday === 'afg' ? 'afg' : req.query.holiday === 'irn' ? 'irn' : 'both'
  let year = Number(req.params.year)
  let month = Number(req.params.month)
  let dayOfMonth = Number(req.params.day)

  if (!year) {
    let date = new Date()
    year = date.getFullYear()
  }

  res.status(200).send(getDate(year, month, dayOfMonth, holiday))
}

const getToday = (req, res) => {
  let holiday = req.query.holiday === 'afg' ? 'afg' : req.query.holiday === 'irn' ? 'irn' : 'both'
  let date = new Date()
  res.status(200).send(getDate(date.getFullYear(), date.getMonth() + 1, date.getDate(), holiday))
}

export {
  getByGregorianDate,
  getToday
}
