import { getAllOrgs, deleteOrg } from "../apis";
import ReactPaginate from "react-paginate";
import OrgRegisterModal from "./Modal/OrgRegisterModal";
import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button, Tooltip } from "@material-tailwind/react";
import "../style.css";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const TABLE_HEAD = ["No", "Name", "Description", "Action"];

const OrgRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgData, setOrgData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [PER_PAGE] = useState(5);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(orgData.length / PER_PAGE);

  const showToast = (msg, flag) => {
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
    const filterUser = orgData.filter((user) => user._id === e);
    setModalData(filterUser);
    setIsOpenModal(true);
  };

  const handleOpen = () => {
    setModalData(null);
    setIsOpenModal(true);
  };

  const handleClose = () => {
    setIsOpenModal(false);
  };

  const handleDelete = async (id) => {
    const orgConfirmed = window.confirm(
      "Are you sure you want to delete this Organization?"
    );
    if (orgConfirmed) {
      setIsLoading(true);
      await deleteOrg(id)
        .then((res) => {
          setOrgData((orgData) =>
            orgData.filter((user) => user._id !== res.data._id)
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
  const getOrgs = async () => {
    setIsLoading(true);
    await getAllOrgs()
      .then(async (res) => {
        setOrgData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error in get orgs ---------- ", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getOrgs();
  }, []);

  return (
    <>
      {isOpenModal && (
        <OrgRegisterModal
          data={modalData}
          onClose={handleClose}
          getOrgs={getOrgs}
          showToast={showToast}
        />
      )}
      {isLoading && <div className="coverSpinner"></div>}

      {
        <div className="bg-white p-3 rounded-xl m-2">
          <div className="rounded-none">
            <p className="flex justify-center items-center text-xl font-bold">
              Organization Register for Chatbot Integration
            </p>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Button
                className="btn danger bg-neutral-950 hover:bg-neutral-800"
                onClick={handleOpen}
              >
                Add Organization
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
                {orgData
                  .slice(offset, offset + PER_PAGE)
                  .map(({ name, description, _id }, index) => {
                    const isLast = index === orgData.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={index} id={_id}>
                        <td className={`${classes} w-10`}>
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
                        <td className={`${classes} w-24`}>
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
                        <td className={`${classes}`}>
                          <div className="flex flex-col">
                            <p
                              variant="small"
                              color="blue-gray"
                              className="font-normal truncate w-24 md:w-[500px]"
                            >
                              {description}
                            </p>
                          </div>
                        </td>

                        <td className={`${classes} w-48`}>
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
          </div>
        </div>
      }
      <ToastContainer />
    </>
  );
};

export default OrgRegister;
