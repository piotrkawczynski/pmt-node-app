import * as express from 'express'

import { db } from '../database'

export const router = express.Router()

router.get('/', async (req, res) => {
  try {
    res.status(200).send('User endpoint')
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error)
  }
})
