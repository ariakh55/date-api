import events from '../events.json'
import persianDate from 'persian-date'
import {
  toHijri
} from 'hijri-converter'

const getDate = (year, month, dayOfMonth, holiday) => {
  let isHoliday = false

  let perDate = new persianDate([year, month, dayOfMonth])
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
  let d = new Date(perDate.toCalendar('gregorian').toLocale('en').format())
  events.GregorianCalendar.forEach(day => {
    if (day.day === d.getDate() && day.month === d.getMonth() + 1) {
      selectedEvents.GregorianCalendar.push(day)
    }
  });
  let hijDate = toHijri(d.getFullYear(), d.getMonth() + 1, d.getDate())
  events.HijriCalendar.forEach(day => {
    if (day.day === hijDate.hd && day.month === hijDate.hm) {
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
    hijriDate: hijDate.hd + "/" + hijDate.hm + "/" + hijDate.hy,
    gregorianDate: d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
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
    year = new persianDate().year()
  }

  res.status(200).send(getDate(year, month, dayOfMonth, holiday))
}

const getHolidays = (req, res) => {
  let holiday = req.query.holiday === 'afg' ? 'afg' : req.query.holiday === 'irn' ? 'irn' : 'both'

  let year = new persianDate().year()

  let fromMonth = Number(req.params.fromMonth)
  let toMonth = Number(req.params.toMonth)

  let fromPerDate = new persianDate([year, fromMonth, 1])
  let toPerDate = new persianDate([year, toMonth, 31])
  let fromDate = new Date(fromPerDate.toCalendar('gregorian').toLocale('en').format())
  let toDate = new Date(toPerDate.toCalendar('gregorian').toLocale('en').format())
  let fromHijDate = toHijri(fromDate.getFullYear(), fromDate.getMonth() + 1, fromDate.getDate())
  let toHijDate = toHijri(toDate.getFullYear(), toDate.getMonth() + 1, toDate.getDate())

  let selectedEvents = {
    "PersianCalendar": [],
    "HijriCalendar": []
  }
  events.PersianCalendar.forEach(day => {
    if (day.month >= fromPerDate.month() && day.month <= toPerDate.month()) {
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
    if (day.month >= fromHijDate.hm && day.month <= toHijDate.hm) {
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
