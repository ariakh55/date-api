import express from 'express'
const router = express.Router()

import {
  checkSchema
} from 'express-validator'

import {
  getHolidays,
  getByHijriDate
} from '../controllers/hijri'

/**
 * @api {get} /api/hij/holidays/:fromMonth/:fromYear/:toMonth/:toYear?holiday=something Holidays
 * @apiName Holidays
 * @apiGroup Hijri
 * @apiVersion 1.0.0
 * @apiDescription Get holidays of a Hijri timespan.
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
router.get('/api/hij/holidays/:fromMonth/:fromYear?/:toMonth/:toYear?', checkSchema({
  fromMonth: {
    in: ['params'],
    errorMessage: 'fromMonth is required',
    isInt: {
      errorMessage: 'toMonth should be a number between 1 and 12',
      options: {
        min: 1,
        max: 12
      }
    },
  },
  fromYear: {
    in: ['params'],
    errorMessage: 'fromYear should be a number',
    isInt: {
      errorMessage: 'fromYear should be a positive number',
      options: {
        gt: 0
      }
    },
    optional: {
      options: {
        nullable: true
      }
    }
  },
  toMonth: {
    in: ['params'],
    errorMessage: 'toMonth is required',
    isInt: {
      errorMessage: 'toMonth should be a number between 1 and 12',
      options: {
        min: 1,
        max: 12
      }
    },
  },
  toYear: {
    in: ['params'],
    errorMessage: 'toYear should be a number',
    isInt: {
      errorMessage: 'toYear should be a positive number',
      options: {
        gt: 0
      }
    },
    optional: {
      options: {
        nullable: true
      }
    },
  }
}), getHolidays)
/**
 * @api {get} /api/hij/events/:day/:month/:year?holiday=something Events
 * @apiName Events
 * @apiGroup Hijri
 * @apiVersion 1.0.0
 * @apiDescription Get events of a Hijri date.
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
router.get('/api/hij/events/:day/:month/:year?', checkSchema({
  day: {
    in: ['params'],
    errorMessage: 'day is required',
    isInt: {
      errorMessage: 'day should be a number between 1 and 31',
      options: {
        min: 1,
        max: 31
      }
    },
  },
  month: {
    in: ['params'],
    errorMessage: 'month should be a number',
    isInt: {
      errorMessage: 'month should be a number between 1 and 12',
      options: {
        min: 1,
        max: 12
      }
    }
  },
  year: {
    in: ['params'],
    errorMessage: 'year should be a number',
    isInt: {
      errorMessage: 'year should be a positive number',
      options: {
        gt: 0
      }
    },
    optional: {
      options: {
        nullable: true
      }
    },
  }
}), getByHijriDate)

export {
  router as hijriRoute
}
