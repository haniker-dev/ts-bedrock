import { JSX } from "react"
import { css } from "@emotion/css"
import { AuthState } from "../State"
import { RemoteData } from "../../../Core/Data/RemoteData"
import { ApiError } from "../Api"
import { bp, color, font, theme } from "../View/Theme"
import * as UpdateProfileApi from "../Api/Auth/UpdateProfile"
import * as UpdateProfileAction from "../Action/UpdateProfile"
import { emit } from "../Runtime/React"
import * as FieldString from "../../../Core/Data/Form/FieldString"
import InputText from "../View/Form/InputText"
import Button from "../View/Form/Button"
import { parseNotValidate } from "../State/UpdateProfile"

export type Props = { authState: AuthState }
export default function ProfilePage(props: Props): JSX.Element {
  const { updateProfile, profile } = props.authState
  const {
    name,
    email,
    newPassword,
    confirmPassword,
    currentPassword,
    updateResponse,
  } = updateProfile
  const updateProfileParams = parseNotValidate(updateProfile)
  const isSubmitting = updateResponse._t === "Loading"

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Profile</h1>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          if (isSubmitting == false && updateProfileParams != null) {
            emit(UpdateProfileAction.onSubmit(updateProfileParams))
          }
        }}
      >
        <div className={styles.formInformation}>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Name*</span>
              <InputText
                value={name.unwrap()}
                invalid={FieldString.error(name) != null}
                changed={name.unwrap() !== profile.name.unwrap()}
                placeholder="Enter name"
                onChange={(value) =>
                  emit(UpdateProfileAction.onChangeName(value))
                }
              />
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Email*</span>
              <InputText
                value={email.unwrap()}
                invalid={FieldString.error(email) != null}
                changed={email.unwrap() !== profile.email.unwrap()}
                type="email"
                placeholder="Enter email"
                onChange={(value) =>
                  emit(UpdateProfileAction.onChangeEmail(value))
                }
              />
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>New password</span>
              <InputText
                value={newPassword.unwrap()}
                invalid={
                  newPassword.unwrap() !== "" &&
                  FieldString.error(newPassword) != null
                }
                changed={newPassword.unwrap() !== ""}
                type="password"
                placeholder="Enter password"
                onChange={(value) =>
                  emit(UpdateProfileAction.onChangeNewPassword(value))
                }
              />
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Confirmation password</span>
              <InputText
                value={confirmPassword.unwrap()}
                invalid={
                  newPassword.unwrap() !== "" &&
                  (FieldString.error(confirmPassword) != null ||
                    newPassword.unwrap() !== confirmPassword.unwrap())
                }
                changed={confirmPassword.unwrap() !== ""}
                type="password"
                placeholder="Enter confirmation password"
                onChange={(value) =>
                  emit(UpdateProfileAction.onChangeConfirmPassword(value))
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.fieldCurrentPassword}>
          <span className={styles.fieldLabel}>Current password</span>
          <InputText
            value={currentPassword.unwrap()}
            invalid={FieldString.error(currentPassword) != null}
            changed={currentPassword.unwrap() !== ""}
            type="password"
            placeholder="Enter password"
            onChange={(value) =>
              emit(UpdateProfileAction.onChangeCurrentPassword(value))
            }
          />
        </div>
        {responseMessage(updateResponse)}
        <div className={styles.button}>
          <Button
            theme_={"Red"}
            size={"M"}
            label={isSubmitting ? "Submitting..." : "Submit"}
            onClick={() => {
              if (isSubmitting == false && updateProfileParams != null) {
                emit(UpdateProfileAction.onSubmit(updateProfileParams))
              }
            }}
            disabled={isSubmitting === true || updateProfileParams == null}
          />
        </div>
      </form>
    </div>
  )
}

function responseMessage(
  response: RemoteData<
    ApiError<UpdateProfileApi.ErrorCode>,
    UpdateProfileApi.Payload
  >,
): JSX.Element {
  switch (response._t) {
    case "NotAsked":
      return <></>
    case "Loading":
      return (
        <div className={styles.responseLoading}>Updating your profile...</div>
      )
    case "Failure":
      return (
        <div className={styles.responseError}>
          {UpdateProfileApi.errorString(response.error)}
        </div>
      )
    case "Success":
      return (
        <div className={styles.responseSuccess}>
          Profile updated successfully!
        </div>
      )
  }
}

const styles = {
  container: css({
    display: "flex",
    flexDirection: "column",
    padding: `${theme.s0} ${theme.s4}`,
    ...bp.xl({
      padding: theme.s0,
    }),
  }),
  pageTitle: css({
    ...font.boldH1_42,
    color: color.secondary500,
  }),
  responseError: css({
    ...font.medium14,
    color: color.semantics.error.red500,
    textAlign: "center",
  }),
  responseLoading: css({
    ...font.medium14,
    color: color.neutral600,
    textAlign: "center",
  }),
  responseSuccess: css({
    ...font.medium14,
    color: color.semantics.success.green500,
    textAlign: "center",
  }),
  form: css({
    display: "flex",
    flexDirection: "column",
    gap: theme.s4,
  }),
  formInformation: css({
    display: "flex",
    flexDirection: "column",
    gap: theme.s4,
    ...bp.md({
      flexDirection: "row",
    }),
  }),
  fieldGroup: css({
    width: "auto",
    display: "flex",
    flexDirection: "column",
    gap: theme.s4,
    padding: theme.s6,
    borderRadius: theme.br2,
    backgroundColor: color.secondary100,
    ...bp.md({
      width: "100%",
    }),
  }),
  fieldCurrentPassword: css({
    display: "flex",
    flexDirection: "column",
    gap: theme.s1,
    padding: theme.s6,
    borderRadius: theme.br2,
    backgroundColor: color.secondary100,
  }),
  field: css({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: theme.s1,
  }),
  fieldLabel: css({
    ...font.regular14,
  }),
  button: css({
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    alignSelf: "center",
    ...bp.md({
      maxWidth: theme.s82,
    }),
  }),
}
