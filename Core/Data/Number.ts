import * as JD from "decoders"

/** Clamp a value between a min and max inclusive */
export function clamp(min: number, max: number, value: number): number {
  if (value <= min) {
    return min
  } else if (value >= max) {
    return max
  } else {
    return value
  }
}

export const numberStringDecoder: JD.Decoder<number> = JD.string
  .transform(Number)
  .transform(JD.number.verify)
