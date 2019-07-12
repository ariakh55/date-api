import express from 'express'
const router = express.Router()

import {
  getByPersianDate,
  getHolidays
} from '../controllers/persian'

router.get('/api/per/holidays/:fromMonth/:fromYear?/:toMonth/:toYear?', getHolidays)
router.get('/api/per/:day/:month/:year?', getByPersianDate)

export {
  router as persianRoute
}
