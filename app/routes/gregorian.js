import express from 'express'
const router = express.Router()

import {
  getHolidays,
  getByGregorianDate
} from '../controllers/gregorian'

/**
 * @api {get} /api/gre/holidays/:fromMonth/:fromYear/:toMonth/:toYear/?holiday=something Holidays
 * @apiName Holidays
 * @apiGroup Gregorian
 * @apiVersion 1.0.0
 * @apiDescription Get holidays of a Gregorian timespan.
 *
 * @apiParam {Number{1..12}} fromMonth Month number that you want to calculate holidays from that month.
 * @apiParam {Number} [fromYear] Year number that you want to calculate holidays from that year.
 * @apiParam {Number{1..12}} toMonth Month number that you want to calculate holidays to that month.
 * @apiParam {Number} [toYear] Month number that you want to calculate holidays to that year.
 * @apiParam {String="irn","afg","both"} [holiday="both"] You can filter between Iranian events and Afghanistan events.
 *
 * @apiSuccess {Object} holidays A JSON Object containing two arrays of PersianCalendar & HijriCalendar holidays containing Events.
 *
 * @apiError {String} msg Error message.
 */
router.get('/api/gre/holidays/:fromMonth/:fromYear?/:toMonth/:toYear?', getHolidays)
/**
 * @api {get} /api/gre/:day/:month/:year Events
 * @apiName Events
 * @apiGroup Gregorian
 * @apiVersion 1.0.0
 * @apiDescription Get events of a Gregorian date.
 *
 * @apiParam {Number{1..31}} day Day of the date you want to lookup.
 * @apiParam {Number{1..12}} month Month of the date you want to lookup.
 * @apiParam {Number} [year] Year of the date you want to lookup.
 * @apiParam {String="irn","afg","both"} [holiday="both"] You can filter between Iranian events and Afghanistan events.
 *
 * @apiSuccess {String} persianDate Selected date converted to Persian Calendar in DD/MM/YYYY format.
 * @apiSuccess {String} hijriDate Selected date converted to Hijri Calendar in DD/MM/YYYY format.
 * @apiSuccess {String} gregorianDate Selected date converted to Gregorian Calendar in DD/MM/YYYY format.
 * @apiSuccess {Object} events A JSON Object containing three arrays of PersianCalendar, HijriCalendar and GregorianCalendar Events.
 * @apiSuccess {Boolean} isHoliday Indicates that is this day a holiday or not.
 *
 * @apiError {String} msg Error message.
 */
router.get('/api/gre/:day/:month/:year?', getByGregorianDate)

export {
  router as gregorianRoute
}
