import React, { useState, useEffect } from "react";
import {
  chatbotRegSchema,
  chatbotUpdateSchema,
} from "../../../admin/validations";
import { createChatbot, updateChatbot, uploadAvatar } from "../../apis";
import { setTheme } from "../../../auth/actions";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import "../../style.css";
import { Avatar } from "@material-tailwind/react";

const ChatbotModal = ({
  data,
  onClose,
  getChatbots,
  showToast,
  apps,
  orgs,
}) => {
  const dispatch = useDispatch();

  const [isLoading, changeIsLoading] = useState(false);
  const [appList, setAppList] = useState([]);
  const [image, _setImage] = useState(null);
  const [avatar, setImageData] = useState(null);

  const formik = useFormik({
    initialValues: {
      org: "",
      app: "",
      email: "",
      prompt: "",
    },
    validationSchema: chatbotRegSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const formik_edit = useFormik({
    initialValues: {
      org: "",
      app: "",
      email: "",
      prompt: "",
      avatar: "",
    },
    validationSchema: chatbotUpdateSchema,
    onSubmit: (values) => {
      onSubmitEdit(values);
    },
  });

  const onSubmit = async (values) => {
    changeIsLoading(true);
    try {
      const res = await createChatbot(values);
      // console.log("res-------", res.data);
      if (avatar !== null) {
        await uploadAvatar(avatar, res.data?._id);
      }
      changeIsLoading(false);
      onClose();
      getChatbots();
    } catch (e) {
      showToast(
        2,
        e.response?.data?.error || "Server error in registering apps"
      );
      console.log("error ", e);
      changeIsLoading(false);
    }
  };

  const onSubmitEdit = async (values) => {
    changeIsLoading(true);
    try {
      const res = await updateChatbot(values);
      console.log("heelo", res.data);
      if (avatar !== null) {
        await uploadAvatar(avatar, res.data?.id);
      }
      changeIsLoading(false);
      onClose();
      getChatbots();
    } catch (e) {
      showToast(
        2,
        e.response?.data?.error || "Server error in registering apps"
      );
      console.log("error ", e);
      changeIsLoading(false);
    }
  };

  const theme = useSelector((store) => store.setting.isDark);
  const session_theme = sessionStorage.getItem("dark");

  useEffect(() => {
    if (data?.length > 0) {
      const edit_data = {
        app: data[0].app_id._id,
        email: data[0].user_id,
        org: data[0].org_id._id,
        prompt: data[0].prompt,
        avatar: data[0].avatar,
        _id: data[0]._id,
      };
      formik.setValues(edit_data);
      formik_edit.setValues(edit_data);
    } else {
      formik.setValues({
        org: "",
        app: "",
        email: "",
        prompt: "",
      });
      formik_edit.setValues({
        org: "",
        app: "",
        email: "",
        prompt: "",
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

  useEffect(() => {
    const selectedOrg = formik.values.org;
    const filterApps = apps.filter((app) => {
      return app.org_id._id == selectedOrg;
    });
    setAppList(filterApps);
  }, [formik.values.org]);

  if (isLoading) {
    return <div className="coverSpinner"></div>;
  }

  const handleAvatarChange = (e) => {
    e.preventDefault();
    const newImage = e.target?.files?.[0];
    if (newImage) {
      setImageData(newImage);
      setImage(URL.createObjectURL(newImage));
    }
  };

  const cleanup = () => {
    URL.revokeObjectURL(image);
    // inputFileRef.current.value = null;
  };

  const setImage = (newImage) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
  };

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
              Add Chatbot
            </h1>
            <div className="form-area">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-control justify-center items-center flex">
                  <label htmlFor="input_file">
                    <Avatar
                      src={image || "/images/default_bot.png"}
                      className="cursor-pointer rounded-full"
                    ></Avatar>
                  </label>
                  <div>
                    <input
                      type="file"
                      id="input_file"
                      accept=".jpg,.png"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="org">Organization</label>
                    {formik.touched.org && formik.errors.org ? (
                      <div className="error">{formik.errors.org}</div>
                    ) : null}
                  </span>
                  <select
                    type="text"
                    autoComplete="off"
                    id="org"
                    name="org"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.org}
                    className="input-box"
                  >
                    <option value={""}>Select Organization</option>
                    {orgs.map((org, i) => {
                      return (
                        <option key={i} value={org._id}>
                          {org.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="app">App Name</label>
                    {formik.touched.app && formik.errors.app ? (
                      <div className="error">{formik.errors.app}</div>
                    ) : null}
                  </span>
                  <select
                    type="text"
                    autoComplete="off"
                    id="app"
                    name="app"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.app}
                    className="input-box"
                  >
                    <option value={""}>Select App</option>
                    {appList.map((app, i) => {
                      return (
                        <option key={i} value={app._id}>
                          {app.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="email">Email</label>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="error">{formik.errors.email}</div>
                    ) : null}
                  </span>
                  <input
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
                    <label htmlFor="prompt">Prompt</label>
                    {formik.touched.prompt && formik.errors.prompt ? (
                      <div className="error">{formik.errors.prompt}</div>
                    ) : null}
                  </span>
                  <textarea
                    autoComplete="off"
                    id="prompt"
                    name="prompt"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.prompt}
                    className="input-box"
                    rows={6}
                    placeholder="Enter prompt"
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
              Edit Chatbot Information
            </h1>
            <div className="form-area">
              <form onSubmit={formik_edit.handleSubmit}>
                <div className="signupForm">
                  <div className="form-control justify-center items-center flex">
                    <label htmlFor="input_file">
                      <Avatar
                        src={image || "/images/default_bot.png"}
                        className="cursor-pointer rounded-full"
                      ></Avatar>
                    </label>
                    <div>
                      <input
                        type="file"
                        id="input_file"
                        accept=".jpg,.png"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <span>
                      <label htmlFor="org">Organization</label>
                      {formik_edit.touched.org && formik_edit.errors.org ? (
                        <div className="error">{formik_edit.errors.org}</div>
                      ) : null}
                    </span>
                    <select
                      type="text"
                      autoComplete="off"
                      id="org"
                      name="org"
                      onChange={formik_edit.handleChange}
                      onBlur={formik_edit.handleBlur}
                      value={formik_edit.values.org}
                      className="input-box"
                    >
                      <option value={""}>Select Organization</option>
                      {orgs.map((org, i) => {
                        return (
                          <option key={i} value={org._id}>
                            {org.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-control">
                    <span>
                      <label htmlFor="app">App Name</label>
                      {formik_edit.touched.app && formik_edit.errors.app ? (
                        <div className="error">{formik_edit.errors.app}</div>
                      ) : null}
                    </span>
                    <select
                      type="text"
                      autoComplete="off"
                      id="app"
                      name="app"
                      onChange={formik_edit.handleChange}
                      onBlur={formik_edit.handleBlur}
                      value={formik_edit.values.app}
                      className="input-box"
                    >
                      <option value={""}>Select App</option>
                      {appList.map((app, i) => {
                        return (
                          <option key={i} value={app._id}>
                            {app.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-control">
                    <span>
                      <label htmlFor="email">Email</label>
                      {formik_edit.touched.email && formik_edit.errors.email ? (
                        <div className="error">{formik_edit.errors.email}</div>
                      ) : null}
                    </span>
                    <input
                      id="email"
                      name="email"
                      onChange={formik_edit.handleChange}
                      onBlur={formik_edit.handleBlur}
                      value={formik_edit.values.email}
                      className="input-box"
                      placeholder="Enter Email"
                    />
                  </div>
                  <div className="form-control">
                    <span>
                      <label htmlFor="prompt">Prompt</label>
                      {formik_edit.touched.prompt &&
                      formik_edit.errors.prompt ? (
                        <div className="error">{formik_edit.errors.prompt}</div>
                      ) : null}
                    </span>
                    <textarea
                      autoComplete="off"
                      id="prompt"
                      name="prompt"
                      onChange={formik_edit.handleChange}
                      onBlur={formik_edit.handleBlur}
                      value={formik_edit.values.prompt}
                      className="input-box"
                      rows={6}
                      placeholder="Enter prompt"
                    />
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
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ChatbotModal;
