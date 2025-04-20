import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { getAllUsers, deleteUser, getRoles } from "../apis";
import ReactPaginate from "react-paginate";
import CustomModal from "../../admin/components/Modal/CustomModal";
import LLMModal from "./Modal/LLMModal";
import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import "../style.css";
import { ToastContainer, toast } from "react-toastify";
import { EMAIL_EXIST_MSG } from "../../auth/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faCopy,
  faEdit,
  faRobot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { getLLMOptionWithUser } from "../apis";
import { setLLMOption } from "../../menu/apis";

const TABLE_HEAD = ["Name", "Email", "Phone Number", "Role", "URL", "Action"];
const TABLE_HEAD_LLM = [
  "Name",
  "Email",
  "GPT Name",
  "LLM key",
  "LLM Temperature",
  "Action",
];

const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [is_open_user_modal, setIsOpenUModal] = useState(false);
  const [user_modal_data, setUModalData] = useState(null);
  const [is_open_option_modal, setIsOpenOModal] = useState(false);
  const [option_modal_data, setOModalData] = useState(null);
  // const [tabState, setTabState] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [_currentPage, setCurrentPage1] = useState(0);
  const [PER_PAGE] = useState(5);
  const [user_roles, setRoles] = useState([]);
  const [selectedTab, setSelectedTab] = useState("userinfo");
  const [options, setOptions] = useState([]);
  const [option_userId, setOptionUserId] = useState(null);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(userData.length / PER_PAGE);

  const _offset = _currentPage * PER_PAGE;
  const _pageCount = Math.ceil(options.length / PER_PAGE);

  const _handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage1(selectedPage);
  };

  const showToast = (value) => {
    if (value === 0) {
      toast.error(EMAIL_EXIST_MSG, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (value === 1) {
      toast.success("A new user was registerd succesfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (value === 2) {
      toast.success("The user was updated succesfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (value === 3) {
      toast.success("The text is copied in clipboard succesfully", {
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
  };

  const handleEditLLM = (userid) => {
    setOptionUserId(userid);
    setIsOpenOModal(true);
    const option = options.find((item) => {
      return item.user._id == userid;
    });
    setOModalData(option);
  };

  const handleCloseLLM = () => {
    setIsOpenOModal(false);
  };

  const handleEdit = (e) => {
    const filterUser = userData.filter((user) => user._id === e);
    setUModalData(filterUser);
    setIsOpenUModal(true);
  };

  const handleOpen = () => {
    setUModalData(null);
    setIsOpenUModal(true);
  };

  const handleClose = () => {
    setIsOpenUModal(false);
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (userConfirmed) {
      setIsLoading(true);
      await deleteUser(id)
        .then((res) => {
          setUserData((userData) =>
            userData.filter((user) => user._id !== res.data._id)
          );
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("error ", err);
          setIsLoading(false);
        });
    } else {
      console.log("User deletion cancelled");
      return false;
    }
  };
  const getUsers = async () => {
    setIsLoading(true);
    await getAllUsers()
      .then(async (res) => {
        setUserData(res.data);
        const role_res = await getRoles();
        setRoles(role_res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error ", err);
        setIsLoading(false);
      });
  };

  const getOptions = async () => {
    const res = await getLLMOptionWithUser();
    setOptions(res.data);
  };
  useEffect(() => {
    getUsers();
    getOptions();
  }, []);

  return (
    <>
      {is_open_user_modal && (
        <CustomModal
          data={user_modal_data}
          onClose={handleClose}
          getUsers={getUsers}
          showToast={showToast}
          roles={user_roles}
        />
      )}

      {is_open_option_modal && (
        <LLMModal
          data={option_modal_data}
          onClose={handleCloseLLM}
          getOptions={getOptions}
          user={option_userId}
        />
      )}

      {isLoading && <div className="coverSpinner"></div>}

      {
        <Tabs value="userinfo" className="m-2 p-2 bg-gray-200 rounded-lg">
          <TabsHeader
            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
          >
            <Tab
              key={"userinfo"}
              value={"userinfo"}
              onClick={() => setSelectedTab("userinfo")}
              className={
                selectedTab === "userinfo"
                  ? "text-gray-900 border-b-4 border-gray-900 p-2"
                  : " p-2"
              }
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              {"User Information"}
            </Tab>

            <Tab
              key={"chatbotinfo"}
              value={"chatbotinfo"}
              onClick={() => setSelectedTab("chatbotinfo")}
              className={
                selectedTab === "chatbotinfo"
                  ? "text-gray-900 border-b-4 border-gray-900 p-2"
                  : " p-2"
              }
            >
              <FontAwesomeIcon icon={faRobot} className="mr-2" />
              {"Chatbot Information"}
            </Tab>
            <Tab
              key={"llminfo"}
              value={"llminfo"}
              onClick={() => setSelectedTab("llminfo")}
              className={
                selectedTab === "llminfo"
                  ? "text-gray-900 border-b-4 border-gray-900  p-2"
                  : " p-2"
              }
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              {"LLM Information"}
            </Tab>
          </TabsHeader>

          <TabsBody
            animate={{
              initial: { y: 250 },
              mount: { y: 0 },
              unmount: { y: 250 },
            }}
          >
            <TabPanel key={"userinfo"} value={"userinfo"}>
              <div className="w-full bg-white p-3 rounded-xl">
                <div className="rounded-none">
                  <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Button
                      className="btn danger bg-neutral-950 hover:bg-neutral-800"
                      onClick={handleOpen}
                    >
                      Add user
                    </Button>
                  </div>
                </div>
                <div className="px-0">
                  <table className="mt-4 w-full min-w-max table-auto text-left">
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
                              className="flex items-center justify-between gap-2 font-bold italic leading-none opacity-70"
                            >
                              {head}
                              {/* {index !== TABLE_HEAD.length - 1 && (
                            <ChevronUpDownIcon
                              strokeWidth={2}
                              className="h-4 w-4"
                            />
                          )} */}
                            </p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {userData
                        .slice(offset, offset + PER_PAGE)
                        .map(
                          (
                            {
                              firstName,
                              lastName,
                              email,
                              mobile_no,
                              roles,
                              _id,
                              direct_URL,
                            },
                            index
                          ) => {
                            const Croles = parseInt(roles);
                            const role = user_roles.find(
                              (item) => item.value === Croles
                            );
                            let name =
                              firstName +
                              " " +
                              (lastName === undefined ? "" : lastName);
                            const isLast = index === userData.length - 1;
                            const classes = isLast
                              ? "p-4"
                              : "p-4 border-b border-blue-gray-50";

                            return (
                              <tr key={index} id={_id}>
                                <td className={classes}>
                                  <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                      <p
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                      >
                                        {name}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className={classes}>
                                  <div className="flex flex-col">
                                    <p
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                    >
                                      {email}
                                    </p>
                                  </div>
                                </td>
                                <td className={classes}>
                                  <div className="w-max">
                                    <p
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                    >
                                      {mobile_no}
                                    </p>
                                  </div>
                                </td>
                                <td className={classes}>
                                  <p
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {role?.title}
                                  </p>
                                </td>
                                <td className={classes}>
                                  <p
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {direct_URL ? (
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            direct_URL
                                          );
                                          showToast(3);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faCopy} />
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </td>
                                <td className={classes}>
                                  <p
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    <Tooltip content="Delete">
                                      <Button
                                        onClick={() => handleDelete(_id)}
                                        variant="text"
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </Button>
                                    </Tooltip>
                                    <Tooltip content="Edit">
                                      <Button
                                        onClick={() => handleEdit(_id)}
                                        variant="text"
                                      >
                                        <FontAwesomeIcon
                                          icon={faEdit}
                                          className="mr-1"
                                        />
                                      </Button>
                                    </Tooltip>
                                  </p>
                                </td>
                              </tr>
                            );
                          }
                        )}
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
                </div>
              </div>
            </TabPanel>

            <TabPanel key={"chatbotinfo"} value={"chatbotinfo"}>
              <div className="w-full bg-white p-3 rounded-xl">
                <div className="rounded-none">
                  <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Button
                      className="btn danger bg-neutral-950 hover:bg-neutral-800"
                      onClick={handleOpen}
                    >
                      Add Chatbot
                    </Button>
                  </div>
                </div>
                <div className="px-0">
                  <table className="mt-4 w-full min-w-max table-auto text-left">
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
                              className="flex items-center justify-between gap-2 font-bold italic leading-none opacity-70"
                            >
                              {head}
                              {/* {index !== TABLE_HEAD.length - 1 && (
                            <ChevronUpDownIcon
                              strokeWidth={2}
                              className="h-4 w-4"
                            />
                          )} */}
                            </p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {userData
                        .slice(offset, offset + PER_PAGE)
                        .map(
                          (
                            {
                              firstName,
                              lastName,
                              email,
                              mobile_no,
                              roles,
                              _id,
                              direct_URL,
                            },
                            index
                          ) => {
                            const Croles = parseInt(roles);
                            const role = user_roles.find(
                              (item) => item.value === Croles
                            );
                            let name =
                              firstName +
                              " " +
                              (lastName === undefined ? "" : lastName);
                            const isLast = index === userData.length - 1;
                            const classes = isLast
                              ? "p-4"
                              : "p-4 border-b border-blue-gray-50";

                            return (
                              <tr key={index} id={_id}>
                                <td className={classes}>
                                  <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                      <p
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                      >
                                        {name}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className={classes}>
                                  <div className="flex flex-col">
                                    <p
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                    >
                                      {email}
                                    </p>
                                  </div>
                                </td>
                                <td className={classes}>
                                  <div className="w-max">
                                    <p
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                    >
                                      {mobile_no}
                                    </p>
                                  </div>
                                </td>
                                <td className={classes}>
                                  <p
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {role?.title}
                                  </p>
                                </td>
                                <td className={classes}>
                                  <p
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {direct_URL ? (
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            direct_URL
                                          );
                                          showToast(3);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faCopy} />
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </td>
                                <td className={classes}>
                                  <p
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    <Tooltip content="Delete">
                                      <Button
                                        onClick={() => handleDelete(_id)}
                                        variant="text"
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </Button>
                                    </Tooltip>
                                    <Tooltip content="Edit">
                                      <Button
                                        onClick={() => handleEdit(_id)}
                                        variant="text"
                                      >
                                        <FontAwesomeIcon
                                          icon={faEdit}
                                          className="mr-1"
                                        />
                                      </Button>
                                    </Tooltip>
                                  </p>
                                </td>
                              </tr>
                            );
                          }
                        )}
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
                </div>
              </div>
            </TabPanel>

            <TabPanel key={"llminfo"} value={"llminfo"}>
              <div className="w-[70%] md:w-full bg-white p-3 rounded-xl">
                <div className="px-0">
                  <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                      <tr key={-1} className="">
                        {TABLE_HEAD_LLM.map((head, index) => (
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
                      {options
                        .slice(_offset, _offset + PER_PAGE)
                        .map((option, index) => {
                          let name =
                            option.user.firstName +
                            " " +
                            (option.user.lastName === undefined
                              ? ""
                              : option.user.lastName);
                          const isLast = index === options.length - 1;
                          const classes = isLast
                            ? "p-4"
                            : "p-4 border-b border-blue-gray-50";

                          return (
                            <tr key={index} id={option.user._id}>
                              <td className={classes}>
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col">
                                    <p
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                    >
                                      {name}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex flex-col">
                                  <p
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {option.user.email}
                                  </p>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex flex-col">
                                  <p
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {option.llm_data?.gpt_name}
                                  </p>
                                </div>
                              </td>
                              <td className={`${classes} `}>
                                <p
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal truncate w-18 md:w-24"
                                >
                                  {option.llm_data?.llm_key}
                                </p>
                              </td>
                              <td className={classes}>
                                <p
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {option.llm_data?.llm_temperature}
                                </p>
                              </td>
                              <td className={classes}>
                                <p
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  <button
                                    className="select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none flex justify-center items-center"
                                    type="button"
                                    data-dialog-target={`sign-in-dialog${option.user._id}`}
                                    onClick={() =>
                                      handleEditLLM(option.user._id)
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faEdit}
                                      className="mr-1"
                                    />
                                    Edit
                                  </button>
                                </p>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <div className="tableFooter">
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      pageCount={_pageCount}
                      onPageChange={_handlePageClick}
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
                </div>
              </div>
            </TabPanel>
          </TabsBody>
          {/* </div> */}
        </Tabs>
      }
      <ToastContainer />
    </>
  );
};

export default Admin;
