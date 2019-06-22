import { sign, verify } from 'jsonwebtoken'
import { app } from '../app'

export const createToken = (data) =>
  new Promise((resolve, reject) => {
    sign(
      {
        data,
      },
      app.get('secret'),
      {
        expiresIn: '2000h',
      },
      (err, encoded) => {
        if (err) {
          return reject(err)
        }

        return resolve(encoded)
      },
    )
  })

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    verify(token, app.get('secret'), (err, decoded) => {
      if (err) {
        return reject(err)
      }

      return resolve(decoded)
    })
  })
