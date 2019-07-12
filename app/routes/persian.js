import express from 'express'
const router = express.Router()

import {
  getByPersianDate,
  getToday
} from '../controllers/persian'

router.get('/api/per/:day/:month/:year?', getByPersianDate)
router.get('/api/per/today', getToday)

export {
  router as persianRoute
}
