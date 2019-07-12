import express from 'express'
const router = express.Router()

import {
  getHolidays,
  getByHijriDate
} from '../controllers/hijri'

router.get('/api/hij/holidays/:fromMonth/:fromYear?/:toMonth/:toYear?', getHolidays)
router.get('/api/hij/:day/:month/:year?', getByHijriDate)

export {
  router as hijriRoute
}
