import { JSX } from "react"
import { css } from "@emotion/css"
import { State } from "../State"
import { color, font, theme, bp } from "../View/Theme"
import { emit } from "../Runtime/React"
import { RemoteData } from "../../../Core/Data/RemoteData"
import { ApiError } from "../Api"
import * as LoginApi from "../Api/Public/Login"
import * as LoginAction from "../Action/Login"
import * as FieldString from "../../../Core/Data/Form/FieldString"
import InputText from "../View/Form/InputText"
import { gradient } from "../View/Theme/Keyframe"
import Button from "../View/Form/Button"
import { parseNotValidate } from "../State/Login"

export type Props = { state: State }
export default function LoginPage(props: Props): JSX.Element {
  const { email, password, loginResponse } = props.state.login
  const loginParams = parseNotValidate(props.state.login)
  const isSubmitting = loginResponse._t === "Loading"

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.pageTitle}>Login</div>

        {responseMessage(loginResponse)}

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault()
            if (isSubmitting == false && loginParams != null) {
              emit(LoginAction.onSubmit(loginParams))
            }
          }}
        >
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Email</span>
            <InputText
              value={email.unwrap()}
              invalid={FieldString.error(email) != null}
              type="email"
              placeholder="Enter email"
              onChange={(value) => emit(LoginAction.onChangeEmail(value))}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Password</span>
            <InputText
              value={password.unwrap()}
              invalid={FieldString.error(password) != null}
              type="password"
              placeholder="Enter password"
              onChange={(value) => emit(LoginAction.onChangePassword(value))}
            />
          </div>
          <Button
            theme_={"Red"}
            size={"M"}
            label={isSubmitting ? "Submitting..." : "Submit"}
            onClick={() => {
              if (isSubmitting == false && loginParams != null) {
                emit(LoginAction.onSubmit(loginParams))
              }
            }}
            disabled={isSubmitting === true || loginParams == null}
          />
        </form>
      </div>
    </div>
  )
}

function responseMessage(
  response: RemoteData<ApiError<LoginApi.ErrorCode>, LoginApi.Payload>,
): JSX.Element {
  switch (response._t) {
    case "NotAsked":
      return <></>
    case "Loading":
      return <div className={styles.responseLoading}>Logging you in...</div>
    case "Failure":
      return (
        <div className={styles.responseError}>
          {LoginApi.errorString(response.error)}
        </div>
      )
    case "Success":
      return (
        <div className={styles.responseSuccess}>
          Login Success! Redirecting you now...
        </div>
      )
  }
}

const styles = {
  container: css({
    width: "100dvw",
    height: "100dvh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    background: `linear-gradient(-45deg, ${color.secondary400}, ${color.secondary100}, ${color.secondary400})`,
    backgroundSize: `400% 400%`,
    animation: `${gradient} 10s ease infinite`,
    ...bp.sm({
      alignItems: "center",
    }),
  }),
  wrapper: css({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.s4,
    padding: `${theme.s0} ${theme.s6}`,
    background: color.secondary50,
    ...bp.sm({
      height: "auto",
      padding: `${theme.s12} ${theme.s20}`,
      borderRadius: theme.s4,
      border: `${theme.s0_25} solid ${color.secondary100}`,
      boxShadow: theme.elevation.large,
    }),
  }),
  pageTitle: css({
    ...font.regularH1_42,
  }),
  responseError: css({
    ...font.medium14,
    color: color.semantics.error.red500,
  }),
  responseLoading: css({
    ...font.medium14,
    color: color.neutral600,
  }),
  responseSuccess: css({
    ...font.medium14,
    color: color.semantics.success.green500,
  }),
  form: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.s4,
  }),
  field: css({
    minWidth: theme.s82,
    display: "flex",
    flexDirection: "column",
    gap: theme.s1,
  }),
  fieldLabel: css({
    ...font.regular14,
  }),
}
