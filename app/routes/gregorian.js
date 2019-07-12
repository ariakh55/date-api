import express from 'express'
const router = express.Router()

import {
  getByGregorianDate,
} from '../controllers/gregorian'

router.get('/api/gre/:day/:month/:year?', getByGregorianDate)

export {
  router as gregorianRoute
}
