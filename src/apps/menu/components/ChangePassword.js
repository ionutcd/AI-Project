import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";

import { passwordSchema } from "../validations";
import { updatePassword } from "../apis";
import "../style.css";

const ChangePassword = ({ setCurrentPage }) => {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmpassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      changePassword(values);
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const changePassword = async (values) => {
    setIsLoading(true);
    await updatePassword(values)
      .then((res) => {
        console.log("Res", res);
        toast.success(res.data.msg, {
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
        }, 5000);
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
                // size={25}
                onClick={() => setCurrentPage("")}
              />
            </div>
            <h1 align="center" className="title">
              Change Password
            </h1>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-content-area">
              <div className="form-control">
                <span className="input-error">
                  <label>New Password </label>
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
                  placeholder="Create New Password"
                />
              </div>

              <div className="form-control">
                <span className="input-error">
                  <label>Confirm Password </label>
                  {formik.touched.confirmpassword &&
                  formik.errors.confirmpassword ? (
                    <div className="error">{formik.errors.confirmpassword}</div>
                  ) : null}
                </span>

                <input
                  type="password"
                  id="confirmpassword"
                  name="confirmpassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmpassword}
                  className="input-box"
                  placeholder="Enter Confirm New Password"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
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

export default ChangePassword;
