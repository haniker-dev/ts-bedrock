import { Either, left, right } from "../../../Core/Data/Either"
import * as Logger from "../Logger"

export type FetchError = "NETWORK_ERROR"
export type FetchData = { httpStatus: number; data: unknown }
export type FetchResult = Either<FetchError, FetchData>

export async function fetchE(
  url: string,
  options: RequestInit,
): Promise<FetchResult> {
  return fetch(url, options)
    .then((response) =>
      response
        .json()
        .then((data) => right({ httpStatus: response.status, data })),
    )
    .catch((error) => {
      Logger.error(error)
      return left("NETWORK_ERROR")
    })
}
