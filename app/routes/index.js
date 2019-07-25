import express from 'express'
const router = express.Router()

import {
  getToday,
  getDateByTimestamp
} from '../controllers/gregorian'

import {
  checkSchema
} from 'express-validator'


/**
 * @api {get} /api/today?eventType=something Today
 * @apiName Today
 * @apiGroup General
 * @apiVersion 1.0.0
 * @apiDescription Get events of today.
 *
 * @apiParam {String="irn","afg","both"} [eventType="both"] You can filter between Iranian events and Afghanistan events.
 *
 * @apiSuccess {String} persianDate Selected date converted to Persian Calendar in DD/MM/YYYY format.
 * @apiSuccess {String} hijriDate Selected date converted to Hijri Calendar in DD/MM/YYYY format.
 * @apiSuccess {String} gregorianDate Selected date converted to Gregorian Calendar in DD/MM/YYYY format.
 * @apiSuccess {Object} events A JSON Object containing three arrays of PersianCalendar, HijriCalendar and GregorianCalendar Events.
 * @apiSuccess {Boolean} isHoliday Indicates that is this day a holiday or not.
 *
 * @apiError {String} msg Error message.
 */
router.get('/api/today', getToday)

/**
 * @api {get} /api/timestamp/:timestamp?eventType=something Timestamp
 * @apiName Timestamp
 * @apiGroup General
 * @apiVersion 1.0.0
 * @apiDescription Get events of a timestamp.
 *
 * @apiParam {Number{1..31}} timestamp Timestamp in in miliseconds. (like: 1564058554000)
 * @apiParam {String="irn","afg","both"} [eventType="both"] You can filter between Iranian events and Afghanistan events.
 *
 * @apiSuccess {String} persianDate Selected date converted to Persian Calendar in DD/MM/YYYY format.
 * @apiSuccess {String} hijriDate Selected date converted to Hijri Calendar in DD/MM/YYYY format.
 * @apiSuccess {String} gregorianDate Selected date converted to Gregorian Calendar in DD/MM/YYYY format.
 * @apiSuccess {Object} events A JSON Object containing three arrays of PersianCalendar, HijriCalendar and GregorianCalendar Events.
 * @apiSuccess {Boolean} isHoliday Indicates that is this day a holiday or not.
 *
 * @apiError {String} msg Error message.
 */
router.get('/api/timestamp/:timestamp', checkSchema({
  timestamp: {
    in: ['params'],
    errorMessage: 'timestamp is required',
    isInt: {
      errorMessage: 'timestamp should be a positive number',
      options: {
        min: 0
      }
    },
  }
}), getDateByTimestamp)

export {
  router as indexRoute
}

/**
 * @api {object} Event Event
 * @apiName Event
 * @apiGroup Models
 * @apiVersion 1.0.0
 * @apiDescription Structure of an event.
 *
 * @apiSuccess {Number} month Shows the event month in it's own calendar.
 * @apiSuccess {Number} day Shows the event day in it's own calendar.
 * @apiSuccess {String} title Shows the event title.
 * @apiSuccess {String="Iran","Afghanistan","Ancient Iran","Islamic Iran","Islamic Afghanistan"} [type] Shows the event type.
 * @apiSuccess {String} [persianDate] Shows the event date in Persian Calendar in DD/MM format.
 * @apiSuccess {Boolean} [holiday] Indicates that is this day a holiday or not.
 *
 * @apiError {String} msg Error message.
 */
