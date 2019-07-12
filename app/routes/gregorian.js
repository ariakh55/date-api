import express from 'express'
const router = express.Router()

import {
  getByGregorianDate,
  getToday
} from '../controllers/gregorian'

router.get('/api/gre/:day/:month/:year?', getByGregorianDate)
router.get('/api/gre/today', getToday)

export {
  router as gregorianRoute
}
