import * as Yup from "yup";

export const signupSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile_no: Yup.string()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/,
      "Invalid phone number"
    ) // Only allow numeric characters
    .min(10, "phone number must be at least 10 digits")
    .max(15, "phone number can be at most 15 digits"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export const addUserSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile_no: Yup.string()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/,
      "Invalid phone number"
    ) // Only allow numeric characters
    .min(10, "phone number must be at least 10 digits")
    .max(15, "phone number can be at most 15 digits"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),

  roles: Yup.number().required("Please select a value"),
});

export const editUserSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile_no: Yup.string()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/,
      "Invalid phone number"
    ) // Only allow numeric characters
    .min(10, "phone number must be at least 10 digits")
    .max(15, "phone number can be at most 15 digits"),
  roles: Yup.number().required("Please select a value"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("password is required"),
  // .min(6, "Password must be at least 6 characters")
  // .required("password is required"),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const appRegSchema = Yup.object({
  name: Yup.string().required("App name is required"),
  org_id: Yup.string().required("Organization is required"),
});

export const appUpdateSchema = Yup.object({
  name: Yup.string().required("App name is required"),
  org_id: Yup.string().required("Organization is required"),
});

export const orgRegSchema = Yup.object({
  name: Yup.string().required("Organization name is required"),
});

export const orgUpdateSchema = Yup.object({
  name: Yup.string().required("Organization name is required"),
});

export const chatbotRegSchema = Yup.object({
  org: Yup.string().required("Organization is required"),
  app: Yup.string().required("App is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const chatbotUpdateSchema = Yup.object({
  org: Yup.string().required("Organization is required"),
  app: Yup.string().required("App is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});
