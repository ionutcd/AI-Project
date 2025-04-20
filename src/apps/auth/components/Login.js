import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import { loginSchema } from "../validations";
import { login, loginWithGoogle, setTheme, verifyURL } from "../actions";
import "../style.css";
import { Helmet } from "react-helmet";
import {
  EMAIL_ALREADY_EXIST,
  EMAIL_EXIST_MSG,
  EMAIL_VERIFY,
  EMAIL_VERIFY_MSG,
  INCORRECT_E_P,
  LOGIN_ERROR,
  LOGIN_NOT_EXIST,
  NOT_REGISTER_MSG,
  UNKNOWN_MSG,
  URL_VERIFY_ERROR,
  URL_VERIFY_ERROR_MSG,
} from "../constants";
import { getStyles } from "../../menu/apis";

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [setStyle, setStyleData] = useState(false);

  const { chat_back, text_title, font_size, font_color } =
    setStyle.length > 0 ? setStyle[0] : {};

  console.log("text_title------", text_title);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const { messages, error, isAuthenticated, errorType } = useSelector(
    (state) => state.auth
  );
  const theme = useSelector((store) => store.setting.isDark);
  const session_theme = sessionStorage.getItem("dark");

  const getStyle = async () => {
    setIsLoading(true);
    await getStyles("default")
      .then((res) => {
        setStyleData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error ", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getStyle();
  }, []);

  const onSubmit = async (values) => {
    setIsLoading(true);
    dispatch(login(values));
  };

  useEffect(() => {
    if (session_theme === "false" || session_theme === false) {
      dispatch(setTheme(false));
    } else {
      dispatch(setTheme(true));
    }
    if (error) {
      console.log("errors ", errorType, error);
      setIsLoading(false);
      if (errorType === LOGIN_NOT_EXIST) {
        toast.error(NOT_REGISTER_MSG, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (errorType === LOGIN_ERROR) {
        toast.error(INCORRECT_E_P, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (errorType === EMAIL_VERIFY) {
        toast.warning(EMAIL_VERIFY_MSG, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (errorType === EMAIL_ALREADY_EXIST) {
        toast.warning(EMAIL_EXIST_MSG, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (errorType === URL_VERIFY_ERROR) {
        toast.warning(URL_VERIFY_ERROR_MSG, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.warning(UNKNOWN_MSG, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [error, isAuthenticated, messages, errorType]);

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) =>
      dispatch(loginWithGoogle(codeResponse.access_token)),
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <>
      {text_title ? (
        <Helmet>
          <title>{text_title}</title>
        </Helmet>
      ) : (
        <></>
      )}
      {isLoading && <div className="coverSpinner"></div>}
      <section
        className={`form-section ${
          theme === true ? "bg-chat_back" : "bg-white"
        }`}
      >
        {/* <div className="container"> */}
        <div className="login-area">
          <h1 align="center" className="title">
            Login
          </h1>

          <form onSubmit={formik.handleSubmit}>
            <div className="form-area">
              <div className="form-control">
                <span className="input-error">
                  <label>Email </label>
                  {formik.touched.email && formik.errors.email ? (
                    <div className="error">{formik.errors.email}</div>
                  ) : null}
                </span>

                <input
                  type="text"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="input-box"
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-control">
                <span className="input-error">
                  <label>Password </label>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="error">{formik.errors.password}</div>
                  ) : null}
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="input-box"
                  placeholder="Enter your password"
                />
              </div>

              {/* <div
                style={{
                  textAlign: "right",
                  marginTop: "4px",
                  fontSize: "15px",
                }}
              >
                <Link
                  to={`/forgot-password`}
                  style={{ textDecoration: "none" }}
                >
                  Forgot Password?
                </Link>
              </div> */}

              <button
                type="submit"
                align="center"
                className="btn text-white bg-neutral-950 hover:bg-neutral-800 w-full relative flex items-center flex justify-center !w-full"
              >
                Login
              </button>
              <div className="mt-5 flex justify-center">
                <button
                  onClick={loginGoogle}
                  type="button"
                  align="center"
                  className="btn text-white bg-neutral-950 hover:bg-neutral-800 w-full relative flex items-center flex justify-center !w-full"
                >
                  Login with Google
                </button>
              </div>
            </div>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "12px",
              fontSize: "15px",
            }}
          >
            Don't have an account? &nbsp;
            <Link to={`/signup`} style={{ textDecoration: "none" }}>
              Signup
            </Link>
          </div>
        </div>
        {/* </div> */}
        <ToastContainer />
      </section>
    </>
  );
};

export default Login;
