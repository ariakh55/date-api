import express from 'express'
const router = express.Router()

import {
  getByPersianDate,
} from '../controllers/persian'

router.get('/api/per/:day/:month/:year?', getByPersianDate)

export {
  router as persianRoute
}
