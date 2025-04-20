import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import "../../style.css";
import { setLLMOption } from "../../../menu/apis";

const LLMModal = ({ data, onClose, user, getOptions }) => {
  const [isLoading, changeIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      llm_name: "",
      llm_key: "",
      llm_temp: 0,
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const onSubmit = async (values) => {
    changeIsLoading(true);
    try {
      const res = await setLLMOption({
        gpt: values.llm_name,
        llmKey: values.llm_key,
        llmTemp: values.llm_temp,
        userId: user,
      });
      changeIsLoading(false);
      onClose();
      getOptions();
      // if (response) {
      //   showToast(response);
      // }
    } catch (e) {
      console.log("error ", e.message);
      changeIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      formik.setValues({
        fullname: data.user.firstName + data.user.lastName,
        email: data.user.email,
        llm_name: data.llm_data ? data.llm_data?.gpt_name : "",
        llm_key: data.llm_data ? data.llm_data?.llm_key : "",
        llm_temp: data.llm_data ? data.llm_data?.llm_temperature : 0,
      });
    } else {
      formik.setValues({
        fullname: "",
        email: "",
        llm_name: "",
        llm_key: "",
        llm_temp: 0,
      });
    }
  }, [data]);

  if (isLoading) {
    return <div className="coverSpinner"></div>;
  }

  return (
    <>
      <section className={`form-sections relative`}>
        <div className="login-area fixed top-[15%]">
          <h1 align="center" className="title">
            Edit LLM Information
          </h1>
          <div className="form-area">
            <form onSubmit={formik.handleSubmit}>
              <div className="form-control">
                <span>
                  <label htmlFor="firstName">Full Name</label>
                </span>
                <input
                  type="text"
                  autoComplete="off"
                  value={formik.values.fullname}
                  className="input-box"
                  disabled
                />
              </div>
              <div className="form-control">
                <span>
                  <label htmlFor="email">Email</label>
                </span>
                <input
                  type="text"
                  autoComplete="off"
                  value={formik.values.email}
                  className="input-box"
                  disabled
                />
              </div>

              <div className="form-control">
                <span>
                  <label htmlFor="mobile_no">LLM Name</label>
                  {formik.touched.llm_name && formik.errors.llm_name ? (
                    <div className="error">{formik.errors.llm_name}</div>
                  ) : null}
                </span>
                <input
                  type="text"
                  autoComplete="off"
                  id="llm_name"
                  name="llm_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.llm_name}
                  className="input-box"
                  placeholder="Enter LLM Name"
                />
              </div>

              <div className="form-control">
                <span>
                  <label htmlFor="password">LLM Key</label>
                  {formik.touched.llm_key && formik.errors.llm_key ? (
                    <div className="error">{formik.errors.llm_key}</div>
                  ) : null}
                </span>
                <input
                  type="text"
                  id="llm_key"
                  autoComplete="off"
                  name="llm_key"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.llm_key}
                  className="input-box"
                  placeholder="Enter LLM key"
                />
              </div>

              <div className="form-control">
                <span className="input-error">
                  <label> LLM Temperature </label>
                  {formik.touched.llm_temp && formik.errors.llm_temp ? (
                    <div className="error">{formik.errors.llm_temp}</div>
                  ) : null}
                </span>

                <input
                  type="range"
                  id="llm_temp"
                  name="llm_temp"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.llm_temp}
                  className="input-box !border-0 !p-0"
                  placeholder="Enter temparature"
                  min={0}
                  max={1}
                  step={0.1}
                />
                <span>{formik.values.llm_temp}</span>
              </div>
              <div style={{ display: "flex" }}>
                <button type="submit" align="center" className="btn submit-btn">
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
    </>
  );
};

export default LLMModal;
