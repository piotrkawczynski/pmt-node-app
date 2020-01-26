import { expect } from "chai"
import * as sinon from "sinon"

import { db } from "../database"
import { login } from "../controllers/auth"
import { Request, Response } from "../types/express/express"
import { User } from "../models/user"

describe("Greetings Route", function() {
  describe("Hello() function", function() {
    const body = {
      email: "kawczyniak@gmail.com",
      password: "password",
    }

    const req: Partial<
      Request<{}, { email: string; password: string }>
    > = {
      body,
    }

    const res: Partial<Response> = {
      send: sinon.stub(),
    }

    const mockedData = {
      id: 3,
      email: "kawczyniak@gmail.com",
      username: "john_smith",
      firstName: "John",
      lastName: "Smith",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoia2F3Y3p5bmlha0BnbWFpbC5jb20iLCJpYXQiOjE1Nzk5MTIzMDAsImV4cCI6MTU4NzExMjMwMH0.DmRCjb49lEAvQvKsPLFHnGcBCKAFIRiaKs-QEC84Rs0",
      remainPasswordId: 1,
    }

    beforeEach(function() {
      sinon
        .stub(db.User, "findOne")
        .resolves({ dataValues: mockedData } as any)
    })

    afterEach(function() {
      ;(db.User.findOne as sinon.SinonStub).restore()
    })

    it("Should error out if no name provided ", async function() {
      await login(req as Request, res as Response)

      sinon.assert.calledWith(res.send as sinon.SinonStub)
    })
  })
})
