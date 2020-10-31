import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput"

export const validateRegister = (input: UsernamePasswordInput) => {
  if (input.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ]
  }

  if (input.username.includes("@")) {
    return [
      {
        field: "username",
        message: "username cannot include an @",
      },
    ]
  }

  if (!input.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ]
  }

  if (input.password.length <= 2) {
    return [
      {
        field: "password",
        message: "length must be greater than 2",
      },
    ]
  }
  return
}
