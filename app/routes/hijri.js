import express from 'express'
const router = express.Router()

import {
  getHolidays,
  getByHijriDate
} from '../controllers/hijri'

router.get('/api/hij/holidays/:fromMonth/:toMonth', getHolidays)
router.get('/api/hij/:day/:month/:year?', getByHijriDate)

export {
  router as hijriRoute
}
