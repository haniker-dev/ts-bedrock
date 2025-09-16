import * as JD from "decoders"
import * as Teki from "teki"
import * as Logger from "../Logger"
import {
  HttpStatus,
  Method,
  Api as PublicApi,
  ResponseJson,
} from "../../../Core/Data/Api"
import { toStringRecord, UrlRecord } from "../../../Core/Data/UrlToken"
import { fetchE, FetchResult } from "../Data/Fetch"
import { ok, err } from "../../../Core/Data/Result"
import {
  ApiResponse,
  decodeFetchResult,
  isNoBodyMethod,
  jsonHeaders,
  makePath,
} from "../Api"

// Convenience
export type { ApiResponse, ApiError } from "../Api"
export { apiErrorString } from "../Api"

export async function publicApi<
  M extends Method,
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  contract: PublicApi<M, Route, UrlParams, RequestBody, ErrorCode, Payload>,
  urlData: UrlParams,
  bodyData: RequestBody,
): Promise<ApiResponse<ErrorCode, Payload>> {
  const { method, route, responseDecoder } = contract
  const path = Teki.reverse(route)(toStringRecord(urlData))
  return fetchE(makePath(path), {
    method,
    headers: jsonHeaders(new Headers()),
    body: isNoBodyMethod(method) ? undefined : JSON.stringify(bodyData),
  }).then(handlePublicRequest(responseDecoder))
}

function handlePublicRequest<E, D>(
  responseDecoder: (status: HttpStatus) => JD.Decoder<ResponseJson<E, D>>,
) {
  return function (result: FetchResult): ApiResponse<E, D> {
    const payloadM = decodeFetchResult(responseDecoder, result)
    if (payloadM._t === "Err") {
      return err(payloadM.error)
    }

    switch (payloadM.value._t) {
      case "Ok":
        return ok(payloadM.value.data)
      case "Err":
        return err(payloadM.value.code)
      case "ServerError":
        Logger.error(payloadM.value.errorID)
        return err("SERVER_ERROR")
    }
  }
}
