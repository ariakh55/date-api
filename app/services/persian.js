//import events from '../events.json';
import { readFileSync } from 'fs';
import paths from '../tools/paths.js';
import path from 'path';
import PersianDate from 'persian-date';
import {
	toGregorian,
	toHijri
} from 'hijri-converter'

const events = JSON.parse(
	readFileSync(path.resolve(paths.__dirname, 'events.json'), 'utf-8')
);

const dateBuilder = (day, month, year) => `${year}/${month}/${day}`;

export function getCalendar(year, month, endOfMonthDay) {
	let persianDate = new PersianDate([year, month]);
	const endOfMonth = new PersianDate([year, month, endOfMonthDay]);

	let gregorianDate = new Date(persianDate.toCalendar('gregorian').toLocale('en').format());
	const gregorianEndOfMonth = new Date(endOfMonth.toCalendar('gregorian').toLocale('en').format());

	let hijriDate = toHijri(gregorianDate.getFullYear(),
		gregorianDate.getMonth() + 1, gregorianDate.getDate());
	const hijriEndOfMonth = toHijri(gregorianEndOfMonth.getFullYear(),
		gregorianEndOfMonth.getMonth() + 1, gregorianEndOfMonth.getDate());


	persianDate = persianDate.toCalendar('persian');

	let selectedEvents = {
		"PersianCalendar": [],
		"GregorianCalendar": [],
		"HijriCalendar": []
	}

	events.PersianCalendar.forEach(day => {
		if (day.month === persianDate.month()) {
			if (day.type === "Iran") {
				selectedEvents.PersianCalendar.push({
					isHoliday: day.holiday,
					text: day.title,
					jDate: dateBuilder(day.day, day.month, persianDate.year()),
					jDay: day.day,
					jMonth: day.month
				});
			}
		}
	});

	events.HijriCalendar.forEach(day => {
		if ([hijriDate.hm, hijriEndOfMonth.hm].includes(day.month) && day.type === "Islamic Iran") {
			let jalaiDate = toGregorian(hijriDate.hy, day.month, day.day + 1);
			jalaiDate = new PersianDate(new Date(`${jalaiDate.gm}/${jalaiDate.gd}/${jalaiDate.gy}`))
			jalaiDate = jalaiDate.toCalendar('persian');

			selectedEvents.HijriCalendar.push({
				isHoliday: day.holiday,
				text: day.title,
				hDate: dateBuilder(day.day, day.month, hijriDate.hy),
				hDay: day.day,
				jDay: jalaiDate.date(),
				jMonth: jalaiDate.month()
			});
		}
	})

	return selectedEvents;
}


export const getCalEvent = (year, month, dayOfMonth, eventType) => {
	let isHoliday = false;

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
			if (eventType === 'irn' && day.type === "Iran") {
				selectedEvents.PersianCalendar.push({
					isHoliday: day.holiday,
					text: day.title,
					jDate: dateBuilder(day.day, day.month, persianDate.year()),
					jDay: day.day,
					jMonth: day.month
				})
				isHoliday = day.holiday;
			}
		}
	});

	if(hijriDate.hm > 9) hijriDate.hd -= 1;
	
	events.HijriCalendar.forEach(day => {
		if (day.day === hijriDate.hd && day.month === hijriDate.hm) {
			if (eventType === 'irn' && day.type === "Islamic Iran") {
				selectedEvents.HijriCalendar.push({
					isHoliday: day.holiday,
					text: day.title,
					hDate: dateBuilder(day.day, day.month, hijriDate.hy),
					hDay: day.day,
					jDay: dayOfMonth,
					jMonth: month
				})

				isHoliday = day.holiday;
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
