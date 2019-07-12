import express from 'express'
const router = express.Router()

import {
  getByPersianDate,
  getHolidays
} from '../controllers/persian'

router.get('/api/per/holidays/:fromMonth/:toMonth', getHolidays)
router.get('/api/per/:day/:month/:year?', getByPersianDate)

export {
  router as persianRoute
}
