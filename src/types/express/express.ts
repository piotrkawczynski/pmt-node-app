import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express-serve-static-core"

export interface Request<Params = any, Body = any, QueryParams = any>
  extends ExpressRequest {
  params: Params
  body: Body
  query: QueryParams
}

export interface RequestParams<Params>
  extends Request<Params>,
    ExpressRequest {}

export interface RequestQueryParams<QueryParams>
  extends Request<any, any, QueryParams>,
    ExpressRequest {}

export interface RequestBody<Body>
  extends Request<any, Body>,
    ExpressRequest {}

export interface Response<T = any> extends ExpressResponse {
  locals: T
}
