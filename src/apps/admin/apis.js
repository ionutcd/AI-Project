import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// get users api
export const getAllUsers = () => {
  return axios.get(`${API_URL}/admin`);
};
// delete user api
export const deleteUser = (id) => {
  return axios.post(`${API_URL}/admin/deleteUser`, { id });
};

// add user api
export const addUsers = (value) => {
  return axios.post(`${API_URL}/admin/addUsers`, { value });
};

// get users api
export const getRoles = () => {
  return axios.get(`${API_URL}/admin/getRoles`);
};

// get llm option with users api
export const getLLMOptionWithUser = () => {
  return axios.get(`${API_URL}/llm_option/getOptionWithUser`);
};

//app
export const createChatbotApp = (values) => {
  return axios.post(`${API_URL}/admin/createChatbotApp`, { values });
};

export const updateChatbotApp = (values) => {
  return axios.post(`${API_URL}/admin/updateChatbotApp`, { values });
};

export const deleteApp = (id) => {
  return axios.post(`${API_URL}/admin/deleteApp`, { id });
};

export const getAllApps = () => {
  return axios.get(`${API_URL}/admin/getApps`);
};

//Org
export const deleteOrg = (id) => {
  return axios.post(`${API_URL}/admin/deleteOrg`, { id });
};

export const getAllOrgs = () => {
  return axios.get(`${API_URL}/admin/getOrgs`);
};

export const createChatbotOrg = (values) => {
  return axios.post(`${API_URL}/admin/createChatbotOrg`, { values });
};

export const updateChatbotOrg = (values) => {
  return axios.post(`${API_URL}/admin/updateChatbotOrg`, { values });
};

// chatbots
export const getAllChatbots = () => {
  return axios.get(`${API_URL}/admin/getChatbots`);
};

export const createChatbot = (values) => {
  return axios.post(`${API_URL}/admin/createChatbot`, { values });
};

export const updateChatbot = (values) => {
  return axios.post(`${API_URL}/admin/updateChatbot`, { values });
};

export const deleteBot = (id) => {
  return axios.post(`${API_URL}/admin/deleteChatbot`, { id });
};

// upload file
export const uploadAvatar = (avatar, id = null) => {
  const formData = new FormData();
  formData.append("file", avatar);
  formData.append("id", id);
  console.log("id--------", id);
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  return axios.post(`${API_URL}/admin/uploadAvatar`, formData, config);
};
