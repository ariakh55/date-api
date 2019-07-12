import express from 'express'
const router = express.Router()

import {
  getHolidays,
  getByGregorianDate
} from '../controllers/gregorian'

router.get('/api/gre/holidays/:fromMonth/:toMonth', getHolidays)
router.get('/api/gre/:day/:month/:year?', getByGregorianDate)

export {
  router as gregorianRoute
}
