import { keyframes } from "@emotion/css"

export const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

export const gradient = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`
