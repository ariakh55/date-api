import express from 'express'
const router = express.Router()

import {
  getToday
} from '../controllers/gregorian'

router.get('/api/today', getToday)

export {
  router as indexRoute
}
