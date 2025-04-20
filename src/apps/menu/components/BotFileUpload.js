import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import {
  getAllBotFiles,
  retrainModel,
  uploadFileForBot,
  deleteModelForBot,
  uploadURL,
} from "../apis";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faTimesCircle,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import UploadModal from "./UploadModal";
import { useFormik } from "formik";
import { ScrapURL } from "../validations";
import { FileUploader } from "react-drag-drop-files";
import { getAllOrgs, getAllApps } from "../../admin/apis";

const fileTypes = ["PDF", "TXT", "DOCX", "CSV"];

const BotFileUpload = () => {
  const theme = useSelector((store) => store.setting.isDark);
  const [uploaddata, setUploadData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrained, setIsRetrained] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [PER_PAGE, setPER_PAGE] = useState(6);
  const [isFile, setIsFile] = useState(true);
  const [role, setRole] = useState(true);
  const [apps, setApps] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [appList, setAppList] = useState([]);
  const [appListForFilter, setAppListForFilter] = useState([]);
  const [currentApp, setCurrentApp] = useState("");
  const [currentOrg, setCurrentOrg] = useState("");

  const [file, setFile] = useState(null);
  const handleFileChange = (file) => {
    setFile(file);
  };

  const formik = useFormik({
    initialValues: {
      url: "",
    },
    validationSchema: !isFile ? ScrapURL : null,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    if (isFile) {
      try {
        const res = await uploadFileForBot({
          file,
          app_id: values.app,
          org_id: values.org,
        });
        handleClose();
        handleGetAllFiles();
        // storeVectorDB(res.data.result._id, res.data.result.path);
        toast.success("Upload successful", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (e) {
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
        console.log(e.message);
      }
    } else {
      try {
        await uploadURL({
          url: values.url,
          app_id: values.app,
          org_id: values.org,
        });
        handleClose();
        handleGetAllFiles();
        // // storeVectorDB(res.data.result._id, res.data.result.path);
        toast.success("Upload successful", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (e) {
        setIsLoading(false);
        console.log(e.message);
      }
    }
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(uploaddata.length / PER_PAGE);

  useEffect(() => {
    handleGetAllFiles();
    getRole();
    getApps();
    getOrgs();
  }, []);

  const getApps = async () => {
    const apps = await getAllApps();
    setApps(apps.data);
  };
  const getOrgs = async () => {
    const orgs = await getAllOrgs();
    console.log("orgs-------------", orgs);
    setOrgs(orgs.data);
  };

  useEffect(() => {
    const selectedOrg = formik.values.org;
    if (apps.length > 0) {
      const filterApps = apps.filter((app) => {
        return app.org_id._id == selectedOrg;
      });
      setAppList(filterApps);
    }
  }, [formik.values.org]);

  useEffect(() => {
    handleGetAllFiles();
  }, [currentApp, currentOrg]);

  const getRole = () => {
    const role = sessionStorage.getItem("user");
    setRole(JSON.parse(role).roles);
  };

  const handleGetAllFiles = async () => {
    try {
      const res = await getAllBotFiles(currentApp, currentOrg);
      setUploadData(res.result);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
    }
  };

  const handleRetrainModel = async () => {
    setIsLoading(true);
    setIsDelete(false);
    try {
      await retrainModel(uploaddata);
      await handleGetAllFiles();
      toast.success("Model retrained successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (e) {
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
      console.log(e.message);
    }
  };

  const handleDeleteFile = async (id, path) => {
    setIsLoading(true);
    setIsDelete(true);
    try {
      await deleteModelForBot({ id, path });
      handleGetAllFiles();
      // await retrainModel(files);
      toast.success("File deleted successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (e) {
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
      console.log(e.message);
    }
  };

  const TABLE_HEAD = ["Organization", "App", "Type", "Name", "Action"];

  const handleChangeOrgFilter = (e) => {
    const selectedOrg = e.target.value;
    setCurrentOrg(selectedOrg);
    if (apps.length > 0) {
      const filterApps = apps.filter((app) => {
        return app.org_id._id == selectedOrg;
      });
      setAppListForFilter(filterApps);
    }
  };

  const handleChangeAppFilter = (e) => {
    const selectedApp = e.target.value;
    setCurrentApp(selectedApp);
  };

  return (
    <div className="w-full bg-white p-3 rounded-xl border border-gray-500">
      {isLoading && <div className="coverSpinner"></div>}
      <div className="firstSection">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">File Upload for Integration Bot</p>
          <div className="flex">
            <div className="flex ">
              <select
                className="border-2 border-gray-500"
                onChange={handleChangeOrgFilter}
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

              <select
                className="border-2 border-gray-500 ml-2"
                onChange={handleChangeAppFilter}
              >
                <option value={""}>Select App</option>
                {appListForFilter.map((app, i) => {
                  return (
                    <option key={i} value={app._id}>
                      {app.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <button
                className={` ${
                  theme === true
                    ? "bg-white text-black hover:bg-gray-300"
                    : "bg-black text-white"
                }  p-2 text-base font-bold rounded cursor-pointer`}
                onClick={handleOpen}
              >
                <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
                Upload
              </button>
              {currentApp === "" || uploaddata.length === 0 ? (
                <></>
              ) : (
                <button
                  className={` ${
                    theme === true
                      ? "bg-white text-black hover:bg-gray-300"
                      : "bg-black text-white"
                  }  p-2 text-base font-bold rounded cursor-pointer`}
                  onClick={() => {
                    handleRetrainModel();
                  }}
                >
                  <FontAwesomeIcon icon={faStore} className="mr-2" />
                  Retrain
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {uploaddata.length ? (
        <>
          <table
            id="filesTable"
            className="mt-4 w-full min-w-max table-auto text-left"
          >
            <thead>
              <tr key={-1}>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <p
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploaddata.slice(offset, offset + PER_PAGE).map((item, i) => {
                const isLast = i === uploaddata.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <>
                    <tr key={i}>
                      {/* <td className={classes}>{item.status}</td>*/}
                      <td className={classes}>{item.org_id.name}</td>
                      <td className={classes}>{item.app_id.name}</td>
                      <td className={classes}>{item.type}</td>
                      <td className={classes}>{item.name}</td>
                      <td className="p-4 btn-container">
                        {/* <button
                          onClick={() => handleDeleteFile(item.id, item.path)}
                        >
                          <FontAwesomeIcon icon={faSync} />
                        </button> */}
                        <button
                          onClick={() => handleDeleteFile(item._id, item.path)}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>

          <div className="tableFooter">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              disabledClassName={"page-item"}
              activeClassName={"page-item active"}
              activeLinkClassName="page-link"
            />
          </div>
        </>
      ) : (
        <div className="noRecordFound">
          <h2 className={`${theme === true ? "text-black" : "text-black"}`}>
            No record found
          </h2>
        </div>
      )}
      <UploadModal isOpen={open} onClose={handleClose}>
        <div className="p-1">
          <form onSubmit={formik.handleSubmit}>
            <div className="form-content-area">
              <p className="text-xl my-1 font-bold">{`Add new ${
                isFile ? "document" : "URL"
              } `}</p>
              {role === 0 ? (
                <>
                  <label>For Chatbot Integration</label>
                  <div className="flex border-2 rounded border-gray-600">
                    <div className="form-control flex-1">
                      <span className="input-error">
                        <label>Organization</label>
                        {formik.touched.org && formik.errors.org ? (
                          <div className="error">{formik.errors.org}</div>
                        ) : null}
                      </span>

                      <select
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
                    <div className="form-control flex-1">
                      <span className="input-error">
                        <label>App</label>
                        {formik.touched.app && formik.errors.app ? (
                          <div className="error">{formik.errors.app}</div>
                        ) : null}
                      </span>

                      <select
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
                  </div>
                </>
              ) : (
                <></>
              )}

              <div className="flex justify-center items-center my-2">
                <button
                  type="button"
                  className={
                    isFile
                      ? `px-2 py-1 rounded bg-black text-white`
                      : `px-2 py-1 rounded bg-white border`
                  }
                  onClick={() => {
                    setIsFile(true);
                  }}
                >
                  File
                </button>
                <button
                  type="button"
                  className={
                    !isFile
                      ? `px-2 py-1 rounded bg-black text-white ml-1`
                      : `px-2 py-1 rounded bg-white border ml-1`
                  }
                  onClick={() => {
                    setIsFile(false);
                  }}
                >
                  URL
                </button>
              </div>
              <div className="my-2">
                {isFile ? (
                  <>
                    <FileUploader
                      handleChange={handleFileChange}
                      name="file"
                      types={fileTypes}
                    />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <button type="submit" className="btn forgot-btn !w-full">
                        Submit
                      </button>
                    </div>
                    {/* <label
                      className="btn bg-black text-white !w-full"
                      htmlFor="customFile"
                    >
                      Upload File
                    </label>
                    <input
                      ref={fileRef}
                      type="file"
                      onChange={handleUploadFile}
                      id="customFile"
                      style={{ display: "none", height: "0px", width: "0px" }}
                    /> */}
                  </>
                ) : (
                  <div>
                    <div className="form-control">
                      <span className="input-error">
                        <label>URL </label>
                        {formik.touched.url && formik.errors.url ? (
                          <div className="error">{formik.errors.url}</div>
                        ) : null}
                      </span>

                      <input
                        type="url"
                        id="url"
                        name="url"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.url}
                        className="input-box"
                        placeholder="Enter URL"
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <button type="submit" className="btn forgot-btn !w-full">
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button className="btn cancel-btn !w-full" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </UploadModal>
      <ToastContainer />
    </div>
  );
};

export default BotFileUpload;
