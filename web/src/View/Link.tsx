import { BaseSyntheticEvent, JSX } from "react"
import { navigateTo, Route, toPath } from "../Route"
import { emit } from "../Runtime/React"

type Props = {
  route: Route
  children: JSX.Element | string
  onClick?: () => void
  className?: string
}
export default function EmptyLayout(props: Props): JSX.Element {
  const { children, className, route, onClick } = props
  return (
    <a
      onClick={(e: BaseSyntheticEvent) => {
        emit(navigateTo(route))
        if (onClick != null) {
          onClick()
        }
        e.preventDefault()
      }}
      href={toPath(route)}
      className={className}
    >
      {children}
    </a>
  )
}
