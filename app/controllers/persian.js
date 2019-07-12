import events from '../events.json'
import persianDate from 'persian-date'
import hijriDate from 'hijri'

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
  let hijDate = hijriDate.convert(d, -1)
  events.HijriCalendar.forEach(day => {
    if (day.day === hijDate.dayOfMonth && day.month === hijDate.month) {
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
    hijriDate: hijDate.dayOfMonth + "/" + hijDate.month + "/" + hijDate.year,
    gregorianDate: d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear(),
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

const getToday = (req, res) => {
  let holiday = req.query.holiday === 'afg' ? 'afg' : req.query.holiday === 'irn' ? 'irn' : 'both'
  let perDate = new persianDate();
  res.status(200).send(getDate(perDate.year(), perDate.month(), perDate.date(), holiday))
}

export {
  getByPersianDate,
  getToday
}
