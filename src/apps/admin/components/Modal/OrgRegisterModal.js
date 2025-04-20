import React, { useState, useEffect } from "react";
import { orgRegSchema, orgUpdateSchema } from "../../../admin/validations";
import { createChatbotOrg, updateChatbotOrg } from "../../apis";
import { setTheme } from "../../../auth/actions";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import "../../style.css";

const OrgRegisterModal = ({ data, onClose, getOrgs, showToast }) => {
  const dispatch = useDispatch();
  // const { messages, error, isAuthenticated, errorType } = useSelector(
  //   (state) => state.auth
  // );

  const [isLoading, changeIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: orgRegSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const formik_edit = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: orgUpdateSchema,
    onSubmit: (values) => {
      onSubmitEdit(values);
    },
  });

  const onSubmit = async (values) => {
    changeIsLoading(true);
    try {
      const response = await createChatbotOrg(values);
      changeIsLoading(false);
      onClose();
      getOrgs();
    } catch (e) {
      showToast(
        e.response?.data?.error || "Server error in registering orgs",
        2
      );
      console.log("error ", e);
      changeIsLoading(false);
    }
  };

  const onSubmitEdit = async (values) => {
    changeIsLoading(true);
    try {
      const response = await updateChatbotOrg(values);
      changeIsLoading(false);
      onClose();
      getOrgs();
    } catch (e) {
      showToast(
        e.response?.data?.error || "Server error in registering orgs",
        2
      );
      console.log("error ", e);
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
        name: "",
        description: "",
      });
      formik_edit.setValues({
        name: "",
        description: "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (session_theme === "false" || session_theme === false) {
      dispatch(setTheme(false));
    } else {
      dispatch(setTheme(true));
    }
  }, []);

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
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={onClose}
          ></div>
          <div className="login-area fixed top-[15%]">
            <h1 align="center" className="title">
              Register an org for chatbot Integration
            </h1>
            <div className="form-area">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-control">
                  <span>
                    <label htmlFor="name">Organization Name</label>
                    {formik.touched.name && formik.errors.name ? (
                      <div className="error">{formik.errors.name}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className="input-box"
                    placeholder="Enter Organization Name"
                  />
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="description">Description</label>
                    {formik.touched.description && formik.errors.description ? (
                      <div className="error">{formik.errors.description}</div>
                    ) : null}
                  </span>
                  <textarea
                    autoComplete="off"
                    id="description"
                    name="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    className="input-box"
                    rows={10}
                    placeholder="Enter Description"
                  />
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
              Edit Organization
            </h1>
            <div className="form-area">
              <form onSubmit={formik_edit.handleSubmit}>
                <div className="signupForm">
                  <div className="form-control">
                    <span>
                      <label htmlFor="name">First Name</label>
                      {formik_edit.touched.name && formik_edit.errors.name ? (
                        <div className="error">{formik_edit.errors.name}</div>
                      ) : null}
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      id="name"
                      name="name"
                      onChange={formik_edit.handleChange}
                      onBlur={formik_edit.handleBlur}
                      value={formik_edit.values.name}
                      className="input-box"
                      placeholder="Enter First Name"
                      disabled
                    />
                  </div>
                  <div className="form-control">
                    <span>
                      <label htmlFor="description">Description</label>
                      {formik_edit.touched.description &&
                      formik_edit.errors.description ? (
                        <div className="error">
                          {formik_edit.errors.description}
                        </div>
                      ) : null}
                    </span>
                    <textarea
                      type="text"
                      autoComplete="off"
                      id="description"
                      name="description"
                      onChange={formik_edit.handleChange}
                      onBlur={formik_edit.handleBlur}
                      value={formik_edit.values.description}
                      className="input-box"
                      placeholder="Enter Description"
                      rows={10}
                    />
                  </div>
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

export default OrgRegisterModal;
