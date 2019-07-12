import express from 'express'
const router = express.Router()

import {
  getByHijriDate,
  getToday
} from '../controllers/hijri'

router.get('/api/hij/:day/:month/:year?', getByHijriDate)
router.get('/api/hij/today', getToday)

export {
  router as hijriRoute
}
