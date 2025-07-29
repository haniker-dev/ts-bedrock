/**
 * Add all the images for the app here
 * ImageLocalSrc is an opaque type to ensure
 * that the image path is always correct
 * (provided it is created correctly)
 */
import { Opaque } from "../../../Core/Data/Opaque"

const key: unique symbol = Symbol()
export type ImageLocalSrc = Opaque<string, typeof key>

export const localImage = {
  logo: _create("/assets/favicon.ico"),
  circleLoading: _create("/assets/images/circle-loading.svg"),
}

function _create(url: string): ImageLocalSrc {
  return {
    [key]: url,
    unwrap: function () {
      return this[key]
    },
    toJSON: function () {
      return this[key]
    },
  }
}
