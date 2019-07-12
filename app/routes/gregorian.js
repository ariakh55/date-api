import express from 'express'
const router = express.Router()

import {
  getHolidays,
  getByGregorianDate
} from '../controllers/gregorian'

router.get('/api/gre/holidays/:fromMonth/:fromYear?/:toMonth/:toYear?', getHolidays)
router.get('/api/gre/:day/:month/:year?', getByGregorianDate)

export {
  router as gregorianRoute
}
