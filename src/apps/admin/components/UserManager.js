import { getAllUsers, deleteUser, getRoles } from "../apis";
import ReactPaginate from "react-paginate";
import CustomModal from "../../admin/components/Modal/CustomModal";
import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button, Tooltip } from "@material-tailwind/react";
import "../style.css";
import { ToastContainer, toast } from "react-toastify";
import { EMAIL_EXIST_MSG } from "../../auth/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEdit } from "@fortawesome/free-solid-svg-icons";

const TABLE_HEAD = ["Name", "Email", "Phone Number", "Role", "Action"];

const UserManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [is_open_user_modal, setIsOpenUModal] = useState(false);
  const [user_modal_data, setUModalData] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [_currentPage, setCurrentPage1] = useState(0);
  const [PER_PAGE] = useState(5);
  const [user_roles, setRoles] = useState([]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(userData.length / PER_PAGE);

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

  useEffect(() => {
    getUsers();
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
      {isLoading && <div className="coverSpinner"></div>}

      {
        <div className="bg-white p-3 rounded-xl m-2">
          <div className="rounded-none">
            <p className="flex justify-center items-center text-xl font-bold">
              User Manage
            </p>
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
                      { firstName, lastName, email, mobile_no, roles, _id },
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

export default UserManager;
