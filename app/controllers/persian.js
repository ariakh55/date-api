import events from '../events.json'
import PersianDate from 'persian-date'
import {
  toHijri
} from 'hijri-converter'

const getDate = (year, month, dayOfMonth, holiday) => {
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
    if (day.day === gregorianDate.getDate() && day.month === gregorianDate.getMonth() + 1) {
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
    gregorianDate: gregorianDate.getDate() + "/" + (gregorianDate.getMonth() + 1) + "/" + gregorianDate.getFullYear(),
    events: selectedEvents,
    isHoliday: isHoliday
  }
}

const getByPersianDate = (req, res) => {
  let holiday = req.query.holiday === 'afg' ? 'afg' : req.query.holiday === 'irn' ? 'irn' : 'both'
  let year = Number(req.params.year)
  let month = Number(req.params.month)
  let dayOfMonth = Number(req.params.day)

  if (!year) {
    year = new PersianDate().year()
  }

  res.status(200).send(getDate(year, month, dayOfMonth, holiday))
}

const getHolidays = (req, res) => {
  let holiday = req.query.holiday === 'afg' ? 'afg' : req.query.holiday === 'irn' ? 'irn' : 'both'

  let year = new PersianDate().year()

  let fromMonth = Number(req.params.fromMonth)
  let toMonth = Number(req.params.toMonth)

  let fromPersianDate = new PersianDate([year, fromMonth, 1])
  let toPersianDate = new PersianDate([year, toMonth, 31])
  let fromGregorianDate = new Date(fromPersianDate.toCalendar('gregorian').toLocale('en').format())
  let toGregorianDate = new Date(toPersianDate.toCalendar('gregorian').toLocale('en').format())
  let fromHijriDate = toHijri(fromGregorianDate.getFullYear(), fromGregorianDate.getMonth() + 1, fromGregorianDate.getDate())
  let toHijriDate = toHijri(toGregorianDate.getFullYear(), toGregorianDate.getMonth() + 1, toGregorianDate.getDate())

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
  getByPersianDate,
  getHolidays
}
