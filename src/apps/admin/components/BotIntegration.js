import { getAllApps, getAllOrgs, getAllChatbots, deleteBot } from "../apis";
import ReactPaginate from "react-paginate";
import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button, Tooltip } from "@material-tailwind/react";
import "../style.css";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEdit } from "@fortawesome/free-solid-svg-icons";
import ChatbotModal from "./Modal/ChatbotModal";
import { Avatar } from "@material-tailwind/react";

const TABLE_HEAD = [
  "No",
  "Organization",
  "App",
  "User",
  "Avatar",
  "URL",
  "Action",
];

const backendURL = process.env.REACT_APP_URL;

const BotIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chatbots, setChatbots] = useState([]);
  const [isOpenBotModal, setIsOpenBotModal] = useState(false);
  const [botModalData, setBotModalData] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [PER_PAGE] = useState(5);
  const [orgs, setOrgs] = useState([]);
  const [apps, setApps] = useState([]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(chatbots.length / PER_PAGE);

  const showToast = (flag, msg) => {
    if (flag === 0) {
      toast.success(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (flag === 1) {
      toast.warn(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (flag === 2) {
      toast.error(msg, {
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

  const handleEdit = (e) => {
    const filterBot = chatbots.filter((bot) => bot._id === e);
    console.log("filterbot-------", filterBot);
    setBotModalData(filterBot);
    setIsOpenBotModal(true);
  };

  const handleOpen = () => {
    setBotModalData(null);
    setIsOpenBotModal(true);
  };

  const handleClose = () => {
    setIsOpenBotModal(false);
  };

  const handleDelete = async (id) => {
    const botDelFlag = window.confirm(
      "Are you sure you want to delete this chatbot?"
    );
    if (botDelFlag) {
      setIsLoading(true);
      await deleteBot(id)
        .then((res) => {
          setChatbots((chatbot) =>
            chatbot.filter((bot) => bot._id !== res.data._id)
          );
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("error ", err);
          setIsLoading(false);
        });
    } else {
      console.log("Chatbot deletion cancelled");
      return false;
    }
  };

  const getApps = async () => {
    // console.log("getapps");
    setIsLoading(true);
    await getAllApps()
      .then(async (res) => {
        setApps(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error getting apps", err);
        setIsLoading(false);
      });
  };

  const getOrgs = async () => {
    setIsLoading(true);
    await getAllOrgs()
      .then(async (res) => {
        setOrgs(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error ", err);
        setIsLoading(false);
      });
  };

  const getChatbots = async () => {
    setIsLoading(true);
    await getAllChatbots()
      .then(async (res) => {
        console.log("getall chatbots---------------", res.data);
        setChatbots(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error ", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getApps();
    getOrgs();
    getChatbots();
  }, []);

  const timestamp = new Date().getTime();
  return (
    <>
      {isOpenBotModal && (
        <ChatbotModal
          data={botModalData}
          onClose={handleClose}
          getChatbots={getChatbots}
          showToast={showToast}
          apps={apps}
          orgs={orgs}
        />
      )}
      {isLoading && <div className="coverSpinner"></div>}

      {
        <div className="bg-white p-3 rounded-xl m-2">
          <div className="rounded-none">
            <p className="flex justify-center items-center text-xl font-bold">
              Chatbot Integration
            </p>
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
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chatbots
                  .slice(offset, offset + PER_PAGE)
                  .map(
                    ({ app_id, org_id, user_id, avatar, _id, url }, index) => {
                      const isLast = index === chatbots.length - 1;
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
                                  {index + 1}
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
                                {org_id.name}
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
                                {app_id.name}
                              </p>
                            </div>
                          </td>
                          <td className={classes}>
                            <p
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user_id}
                            </p>
                          </td>
                          <td className={classes}>
                            {avatar ? (
                              <Avatar
                                src={`${process.env.REACT_APP_URL}/avatar/${avatar}?${timestamp}`}
                              />
                            ) : (
                              <Avatar src="/images/default_bot.png" />
                            )}
                          </td>
                          <td className={classes}>
                            <p
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {url ? (
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(url);
                                    showToast(0, "The URL was copied!");
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
      }
      <ToastContainer />
    </>
  );
};

export default BotIntegration;
