import React, { useState, useEffect } from "react";
import { register, setActiveModel, setTheme } from "../../../auth/actions";
import { EMAIL_VERIFY_MSG, EMAIL_VERIFY } from "../../../auth/constants";
import { addUserSchema, editUserSchema } from "../../../admin/validations";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import "../../style.css";

const CustomModal = ({ data, onClose, getUsers, showToast, roles }) => {
  const dispatch = useDispatch();
  const { messages, error, isAuthenticated, errorType } = useSelector(
    (state) => state.auth
  );

  const [isLoading, changeIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      mobile_no: "",
      email: "",
      password: "",
      confirmPassword: "",
      roles: "2",
    },
    validationSchema: addUserSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const formik_edit = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      mobile_no: "",
      email: "",
      roles: "",
    },
    validationSchema: editUserSchema,
    onSubmit: (values) => {
      onSubmitEdit(values);
    },
  });

  const onSubmit = async (values) => {
    let data = { ...values, state: "user", is_EV: true };
    changeIsLoading(true);
    try {
      const response = await dispatch(register(data));
      changeIsLoading(false);
      onClose();
      getUsers();
      if (response) {
        showToast(response);
      }
    } catch (e) {
      console.log("error ", e.message);
      changeIsLoading(false);
    }
  };

  const onSubmitEdit = async (values) => {
    let data = { ...values, state: "user", is_EV: true };
    changeIsLoading(true);
    try {
      const response = await dispatch(register(data));
      changeIsLoading(false);
      onClose();
      getUsers();
      if (response) {
        showToast(response);
      }
    } catch (e) {
      console.log("error ", e.message);
      changeIsLoading(false);
    }
  };

  const theme = useSelector((store) => store.setting.isDark);
  const session_theme = sessionStorage.getItem("dark");

  useEffect(() => {
    if (data?.length > 0) {
      formik.setValues(data[0]);
      formik_edit.setValues(data[0]);
    } else {
      formik.setValues({
        email: "",
        firstName: "",
        lastName: "",
        mobile_no: "",
        password: "",
        confirmPassword: "",
        roles: 2,
      });
      formik_edit.setValues({
        email: "",
        firstName: "",
        lastName: "",
        mobile_no: "",
        password: "",
        confirmPassword: "",
        roles: 2,
      });
    }
  }, [data]);

  useEffect(() => {
    if (session_theme === "false" || session_theme === false) {
      dispatch(setTheme(false));
    } else {
      dispatch(setTheme(true));
    }
    if (error) {
      console.log("errors ", error);
      changeIsLoading(false);
      if (errorType === EMAIL_VERIFY) {
        toast.success(EMAIL_VERIFY_MSG, {
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
        toast.error(error, {
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
      changeIsLoading(false);
    }
  }, [error, isAuthenticated, messages]);

  if (isLoading) {
    return <div className="coverSpinner"></div>;
  }

  return (
    <>
      {data === null ? (
        <section
          className={`form-sections ${
            theme === true ? "" : "bg-white"
          } relative `}
        >
          <div className="login-area fixed top-[15%]">
            <h1 align="center" className="title">
              Add User
            </h1>
            <div className="form-area">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-control">
                  <span>
                    <label htmlFor="firstName">First Name</label>
                    {formik.touched.firstName && formik.errors.firstName ? (
                      <div className="error">{formik.errors.firstName}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="firstName"
                    name="firstName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    className="input-box"
                    placeholder="Enter First Name"
                  />
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="lastName">Last Name</label>
                    {formik.touched.lastName && formik.errors.lastName ? (
                      <div className="error">{formik.errors.lastName}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="lastName"
                    name="lastName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    className="input-box"
                    placeholder="Enter Last Name"
                  />
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="email">Email</label>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="error">{formik.errors.email}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className="input-box"
                    placeholder="Enter Email"
                  />
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="mobile_no">Contact</label>
                    {formik.touched.mobile_no && formik.errors.mobile_no ? (
                      <div className="error">{formik.errors.mobile_no}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="mobile_no"
                    name="mobile_no"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.mobile_no}
                    className="input-box"
                    placeholder="Enter Contact"
                  />
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="password">Password</label>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="error">{formik.errors.password}</div>
                    ) : null}
                  </span>
                  <input
                    type="password"
                    id="password"
                    autoComplete="off"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className="input-box"
                    placeholder="Create Password"
                  />
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                      <div className="error">
                        {formik.errors.confirmPassword}
                      </div>
                    ) : null}
                  </span>
                  <input
                    type="password"
                    autoComplete="off"
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values?.confirmPassword}
                    className="input-box"
                    placeholder="Confirm Password"
                  />
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="confirmPassword">Roles</label>
                    {formik.touched.roles && formik.errors.roles ? (
                      <div className="error">{formik.errors.roles}</div>
                    ) : null}
                  </span>
                  <select
                    id="roles"
                    name="roles"
                    className="input-box"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.roles}
                  >
                    {roles.map((item, i) => {
                      return (
                        <option key={i} value={item.value}>
                          {item.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div style={{ display: "flex" }}>
                  <button
                    type="submit"
                    align="center"
                    className="btn submit-btn"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    align="center"
                    className="btn submit-btn"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : (
        <section
          className={`form-sections ${
            theme === true ? "" : "bg-white"
          } relative`}
        >
          <div className="login-area fixed top-[15%]">
            <h1 align="center" className="title">
              Edit User
            </h1>
            <div className="form-area">
              <form onSubmit={formik_edit.handleSubmit}>
                <div className="signupForm">
                  <div className="form-control">
                    <span>
                      <label htmlFor="firstName">First Name</label>
                      {formik_edit.touched.firstName &&
                      formik_edit.errors.firstName ? (
                        <div className="error">
                          {formik_edit.errors.firstName}
                        </div>
                      ) : null}
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      id="firstName"
                      name="firstName"
                      onChange={formik_edit.handleChange}
                      onBlur={formik_edit.handleBlur}
                      value={formik_edit.values.firstName}
                      className="input-box"
                      placeholder="Enter First Name"
                    />
                  </div>
                  <div className="form-control">
                    <span>
                      <label htmlFor="lastName">Last Name</label>
                      {formik_edit.touched.lastName &&
                      formik_edit.errors.lastName ? (
                        <div className="error">
                          {formik_edit.errors.lastName}
                        </div>
                      ) : null}
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      id="lastName"
                      name="lastName"
                      onChange={formik_edit.handleChange}
                      onBlur={formik_edit.handleBlur}
                      value={formik_edit.values.lastName}
                      className="input-box"
                      placeholder="Enter Last Name"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="email">Email</label>
                    {formik_edit.touched.email && formik_edit.errors.email ? (
                      <div className="error">{formik_edit.errors.email}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="email"
                    name="email"
                    onChange={formik_edit.handleChange}
                    onBlur={formik_edit.handleBlur}
                    value={formik_edit.values.email}
                    className="input-box disabled"
                    disabled
                  />
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="mobile_no">Contact</label>
                    {formik_edit.touched.mobile_no &&
                    formik_edit.errors.mobile_no ? (
                      <div className="error">
                        {formik_edit.errors.mobile_no}
                      </div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="mobile_no"
                    name="mobile_no"
                    onChange={formik_edit.handleChange}
                    onBlur={formik_edit.handleBlur}
                    value={formik_edit.values.mobile_no}
                    className="input-box"
                    placeholder="Enter Contact"
                  />
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="roles">Roles</label>
                    {formik_edit.touched.roles && formik_edit.errors.roles ? (
                      <div className="error">{formik_edit.errors.roles}</div>
                    ) : null}
                  </span>

                  <select
                    id="roles"
                    name="roles"
                    className="input-box"
                    onChange={formik_edit.handleChange}
                    onBlur={formik_edit.handleBlur}
                    value={formik_edit.values.roles}
                  >
                    {roles.map((item, i) => {
                      return (
                        <option key={i} value={item.value}>
                          {item.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div style={{ display: "flex" }}>
                  <button
                    type="submit"
                    align="center"
                    className="btn submit-btn"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    align="center"
                    className="btn submit-btn"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CustomModal;
