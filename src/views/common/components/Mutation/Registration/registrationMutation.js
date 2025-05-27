import axios from "axios";
import { CustomAxios } from "../../../utils/CustomAxios";

export const ResetPassword = async (data) =>
  await CustomAxios()
    .post(`${process.env.REACT_APP_ENDPOINT}/auth/reset-password/`, data)
    .then((res) => res.data);

export const socialAuthSignIn = async (data) =>
  await CustomAxios()
    .post(
      `${process.env.REACT_APP_ENDPOINT}/auth/social-signin/google?population=["account"]`,
      data
    )
    .then((res) => res.data);

export const socialAuthSignup = async (data) =>
  await CustomAxios()
    .post(`${process.env.REACT_APP_ENDPOINT}/auth/social-signup/google`, data)
    .then((res) => res.data);

export const socialAuthMicrosoftSignup = async (data) =>
  await CustomAxios()
    .post(
      `${process.env.REACT_APP_ENDPOINT}/auth/social-signup/microsoft`,
      data
    )
    .then((res) => res.data);

export const socialAuthMicrosoftSignIn = async (data) =>
  await CustomAxios()
    .post(
      `${process.env.REACT_APP_ENDPOINT}/auth/social-signin/microsoft?population=["account"]`,
      data
    )
    .then((res) => res.data);

export const createPassword = async ({ token, ...data }) =>
  await axios
    .post(`${process.env.REACT_APP_ENDPOINT}/auth/activate-account`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data);

export const forgotPassword = async (data) =>
  await CustomAxios()
    .post(`${process.env.REACT_APP_ENDPOINT}/auth/forget-password`, data)
    .then((res) => res.data);

export const verifyEmail = async (data) =>
  await CustomAxios()
    .put(`${process.env.REACT_APP_ENDPOINT}/auth/verify-email`, data)
    .then((res) => res.data);

export const verifyRecaptcha = async (data) =>
  await CustomAxios()
    .post(`${process.env.REACT_APP_ENDPOINT}/auth/verify-recaptcha`, data)
    .then((res) => res.data);
