import React, { useState } from "react";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import CryptoJS from "crypto-js";

import { LLMKeySchema } from "../validations";
import { setLLMOption } from "../apis";

const secretKey = process.env.REACT_APP_SECRET_KEY;

const UIKey = ({ setCurrentPage }) => {
  const formik = useFormik({
    initialValues: {
      llmKey: "",
    },
    validationSchema: LLMKeySchema,
    onSubmit: (values) => {
      onSubmit(values);
      // encryptLLMKey(values);
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const encryptLLMKey = (key) => {
    const ciphertext = CryptoJS.AES.encrypt(key, secretKey).toString();
    return { llmKey: ciphertext };
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    const data = encryptLLMKey(values.llmKey);
    await setLLMOption(data)
      .then((res) => {
        // console.log("Res", res);
        toast.success("LLM Key added successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          setIsLoading(false);
          setCurrentPage("");
        }, 4000);
        // setIsLoading(false);
        // setCurrentPage("");
      })
      .catch((err) => {
        console.log("error ", err);

        setIsLoading(false);
        toast.error("Something Went wrong!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <>
      {isLoading && <div className="coverSpinner"></div>}
      <section className="menu-section">
        {/* <div className="container"> */}
        <div className="menu-area">
          <div className="flex flex-col align-center">
            <div className="flex cursor-pointer">
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => setCurrentPage("")}
              />
            </div>
            <h1 align="center" className="title">
              LLM Key
            </h1>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-content-area">
              <div className="form-control">
                <span className="input-error">
                  <label>LLM Key </label>
                  {formik.touched.llmKey && formik.errors.llmKey ? (
                    <div className="error">{formik.errors.llmKey}</div>
                  ) : null}
                </span>

                <input
                  type="password"
                  id="llmKey"
                  name="llmKey"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.llmKey}
                  className="input-box"
                  placeholder="Enter LLM Key"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {/* <button
                    className="btn cancel-btn"
                    // onClick={() => navigate("/login")}
                    style={{
                      marginRight: "4px",
                    }}
                  >
                    Cancel
                  </button> */}
                <button type="submit" className="btn forgot-btn">
                  Submit
                </button>
              </div>
            </div>
          </form>
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "15px",
            }}
          ></div>
        </div>
        {/* </div> */}
        <ToastContainer />
      </section>
    </>
  );
};

export default UIKey;
