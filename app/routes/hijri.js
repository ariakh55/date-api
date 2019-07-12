import express from 'express'
const router = express.Router()

import {
  getByHijriDate,
} from '../controllers/hijri'

router.get('/api/hij/:day/:month/:year?', getByHijriDate)

export {
  router as hijriRoute
}
