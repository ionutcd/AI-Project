import { getAllUsers, getRoles } from "../apis";
import ReactPaginate from "react-paginate";
import LLMModal from "./Modal/LLMModal";
import React, { useState, useEffect } from "react";
import "../style.css";
import { ToastContainer, toast } from "react-toastify";
import { EMAIL_EXIST_MSG } from "../../auth/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { getLLMOptionWithUser } from "../apis";

const TABLE_HEAD_LLM = [
  "Name",
  "Email",
  "GPT Name",
  "LLM key",
  "LLM Temperature",
  "Action",
];

const LLMManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [is_open_option_modal, setIsOpenOModal] = useState(false);
  const [option_modal_data, setOModalData] = useState(null);

  const [_currentPage, setCurrentPage1] = useState(0);
  const [PER_PAGE] = useState(5);
  const [options, setOptions] = useState([]);
  const [option_userId, setOptionUserId] = useState(null);

  const _offset = _currentPage * PER_PAGE;
  const _pageCount = Math.ceil(options.length / PER_PAGE);

  const _handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage1(selectedPage);
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

  const getOptions = async () => {
    const res = await getLLMOptionWithUser();
    setOptions(res.data);
  };
  useEffect(() => {
    getOptions();
  }, []);

  return (
    <>
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
        <div className="w-[70%] md:w-full bg-white p-3 rounded-xl">
          <p className="flex justify-center items-center text-xl font-bold">
            LLM Manage
          </p>
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
                        className="flex items-center justify-between gap-2 font-bold italic leading-none opacity-70"
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
                              onClick={() => handleEditLLM(option.user._id)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="mr-1" />
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
      }
      <ToastContainer />
    </>
  );
};

export default LLMManager;
