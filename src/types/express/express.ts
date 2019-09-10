import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express-serve-static-core"

// @ts-ignore
export interface Request<
  Params = any,
  Body = any,
  QueryParams = any
> extends ExpressRequest {
  params: Params
  body: Body
  query: QueryParams
}

// @ts-ignore
export interface RequestParams<Params>
  extends Request<Params>,
    ExpressRequest {}

// @ts-ignore
export interface RequestBody<Body>
  extends Request<any, Body>,
    ExpressRequest {}

export interface Response<T = any> extends ExpressResponse {
  locals: T
}
