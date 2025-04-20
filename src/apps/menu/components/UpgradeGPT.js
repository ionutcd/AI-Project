import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";

import { GPTSchema } from "../validations";
import { setLLMOption, getLLMOption } from "../apis";

const UpgradeGPT = ({ setCurrentPage }) => {
  const formik = useFormik({
    initialValues: {
      gpt: "",
    },
    // validationSchema: GPTSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [customModel, setCustomModel] = useState("");

  const gptModels = [
    "gpt-4o",
    "gpt-4-turbo",
    "gpt-3.5-turbo-0125",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307"
  ];

  useEffect(() => {
    handleGetGPT();
  }, []);

  const handleGetGPT = async () => {
    try {
      const res = await getLLMOption();
      formik.setFieldValue("gpt", res.data?.gpt_name);
    } catch (e) {
      console.log(e.message);
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    const finalValues = {
      ...values,
      gpt: values.gpt === "custom" ? customModel : values.gpt
    };
    await setLLMOption(finalValues)
      .then((res) => {
        // console.log("Res", res);
        toast.success("GPT name is saved successfully!", {
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
              GPT
            </h1>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-content-area">
              <div className="form-control">
                <span className="input-error">
                  {/* <label>Prompt </label> */}
                  {formik.touched.gpt && formik.errors.gpt ? (
                    <div className="error">{formik.errors.gpt}</div>
                  ) : null}
                </span>

            
                <select
                  id="gpt"
                  name="gpt"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gpt}
                  className="input-box"
                >
                  <option value="" label="Select GPT model" />
                  {gptModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                  <option value="custom" label="Custom (Enter below)" />
                </select>
                {formik.values.gpt === "custom" && (
                  <input
                    type="text"
                    id="customModel"
                    name="customModel"
                    onChange={(e) => setCustomModel(e.target.value)}
                    onBlur={formik.handleBlur}
                    value={customModel}
                    className="input-box"
                    placeholder="Enter custom GPT model"
                  />
                )}
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

export default UpgradeGPT;
