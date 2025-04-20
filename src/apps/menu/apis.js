import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// user profile api
export const getProfile = () => {
  return axios.get(`${API_URL}/profile`);
};

export const editProfile = (values) => {
  return axios.put(`${API_URL}/profile/edit`, values);
};

// change password api
export const updatePassword = (values) => {
  return axios.put(`${API_URL}/profile/updatepassword`, values);
};

// upload file
export const uploadFile = ({ file }) => {
  const formData = new FormData();
  formData.append("file", file);
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  return axios.post(`${API_URL}/user_query/uploadFile`, formData, config);
};
export const uploadFileForBot = ({ file, app_id, org_id }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("app_id", app_id);
  formData.append("org_id", org_id);
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  return axios.post(`${API_URL}/user_query/uploadFileForBot`, formData, config);
};
// retrain model (file)
export const retrainModel = (uploads) => {
  return axios.post(`${API_URL}/user_query/retrainModel`, { uploads });
};
// retrieve all files api
export const getAllFiles = () => {
  return axios.get(`${API_URL}/user_query/getAllFiles`);
};
// retrieve all files api
export const getAllBotFiles = async (app_id, org_id) => {
  let { data } = await axios.post(`${API_URL}/user_query/getAllBotFiles`, { app_id, org_id });
  return data;
};

// delete Model (file)
export const deleteModel = (payload) => {
  return axios.post(`${API_URL}/user_query/deleteModel`, payload);
};

// delete Model (file)
export const deleteModelForBot = (payload) => {
  return axios.post(`${API_URL}/user_query/deleteModelForBot`, payload);
};

// retrain all models (files)
export const retrainAllModels = (files) => {
  return axios.post(`${API_URL}/user_query/retrainAllModels`, { files });
};
// set active model
export const setActiveModelApi = (id) => {
  return axios.post(`${API_URL}/user_query/setActiveModel`, { id });
};
// set active model
export const getActiveModelApi = () => {
  return axios.get(`${API_URL}/user_query/getActiveModel`);
};

// Prompt
export const setPrompt = (value) => {
  return axios.post(`${API_URL}/prompt/set`, value);
};

export const getUserPrompt = () => {
  return axios.get(`${API_URL}/prompt/get`);
};

//set GPT model name

export const setLLMOption = (value) => {
  return axios.post(`${API_URL}/llm_option/setLLMOption`, value);
};

export const getLLMOption = () => {
  return axios.get(`${API_URL}/llm_option/getLLMOption`);
};

// get page style api
export const getStyles = (value) => {
  return axios.get(`${API_URL}/user_style/get`, {
    params: {
      type: value,
    },
  });
};

// add page style api
export const addStyle = (value) => {
  return axios.post(`${API_URL}/user_style/addStyle`, { value });
};

//store files to vector db

// retrain all models (files)
export const storeVectorDB = (file_id, path) => {
  return axios.post(`${API_URL}/user_query/storeVectorDB`, {
    file_id,
    path,
  });
};

export const uploadURL = ({ url, app_id, org_id }) => {
  return axios.post(`${API_URL}/user_query/uploadURL`, {
    url,
    app_id: app_id || null,
    org_id: org_id || null,
  });
};
